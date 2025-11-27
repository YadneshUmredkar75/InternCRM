import Course from '../models/Course.js';

// @desc    Get all courses with analytics (FIXED VERSION)
// @route   GET /api/courses
// @access  Private
// @desc    Get all courses with analytics (ROBUST VERSION)
// @route   GET /api/courses
// @access  Private
export const getAllCourses = async (req, res) => {
    try {
        console.log('Fetching all courses...');

        let courses;
        try {
            // Try to populate instructor, but handle errors gracefully
            courses = await Course.find()
                .populate('instructor', 'name email')
                .sort({ createdAt: -1 });
        } catch (populateError) {
            console.warn('Instructor population failed, fetching courses without population:', populateError.message);
            // Fallback: get courses without populating instructor
            courses = await Course.find().sort({ createdAt: -1 });
        }

        console.log(`Found ${courses.length} courses`);

        // Manual analytics calculation
        let totalStudents = 0;
        let totalPendingFees = 0;
        let reminders = 0;

        courses.forEach(course => {
            const students = course.students || [];
            totalStudents += students.length;

            students.forEach(student => {
                const paid = Number(student.paidAmount) || 0;
                const total = Number(student.totalFee) || 0;
                const pending = total - paid;

                if (pending > 0) {
                    totalPendingFees += pending;
                    reminders += 1;
                }
            });
        });

        const analytics = {
            totalCourses: courses.length,
            totalStudents,
            totalPendingFees,
            reminders
        };

        console.log('Analytics calculated:', analytics);

        res.json({
            success: true,
            courses,
            analytics
        });
    } catch (error) {
        console.error('Get all courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching courses',
            error: error.message
        });
    }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Private
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'name email');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.json({
            success: true,
            course
        });
    } catch (error) {
        console.error('Get course by ID error:', error);
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Invalid course ID'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Admin/Instructor)
export const createCourse = async (req, res) => {
    try {
        console.log('Received course creation request:', req.body);
        console.log('User making request:', req.user);

        const {
            title,
            description,
            whatYouLearn,
            language = 'English',
            startDate,
            endDate,
            category = 'General',
            maxStudents = 50
        } = req.body;

        // Log each field for debugging
        console.log('Field validation:', {
            title: title?.length,
            description: description?.length,
            whatYouLearn: whatYouLearn?.length,
            startDate,
            endDate
        });

        // Check for required fields
        if (!title || !description || !whatYouLearn || !startDate || !endDate) {
            console.log('Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'All fields are required: title, description, whatYouLearn, startDate, endDate'
            });
        }

        // Field length validation
        if (title.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Course title must be at least 3 characters long'
            });
        }

        if (description.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Course description must be at least 10 characters long'
            });
        }

        if (whatYouLearn.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Learning objectives must be at least 10 characters long'
            });
        }

        // Date validation
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (start < today) {
            return res.status(400).json({
                success: false,
                message: 'Start date cannot be in the past'
            });
        }

        if (end <= start) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }

        // Check for duplicate title
        const existingCourse = await Course.findOne({
            title: { $regex: new RegExp(`^${title.trim()}$`, 'i') }
        });

        if (existingCourse) {
            console.log('Duplicate course found:', existingCourse.title);
            return res.status(400).json({
                success: false,
                message: 'A course with this title already exists'
            });
        }

        const course = new Course({
            title: title.trim(),
            description: description.trim(),
            whatYouLearn: whatYouLearn.trim(),
            language,
            startDate,
            endDate,
            category,
            maxStudents,
            instructor: req.user.id,
            students: []
        });

        console.log('Course object to save:', course);

        const savedCourse = await course.save();
        await savedCourse.populate('instructor', 'name email');

        console.log('Course saved successfully:', savedCourse._id);

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            course: savedCourse
        });
    } catch (error) {
        console.error('Create course error details:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            console.log('Validation errors:', messages);
            return res.status(400).json({
                success: false,
                message: messages.join(', '),
                errors: messages
            });
        }

        console.error('Unexpected error creating course:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating course',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Admin or Course Instructor)
export const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Authorization check
        if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this course'
            });
        }

        const updates = req.body;

        // Prevent duplicate title
        if (updates.title && updates.title !== course.title) {
            const existing = await Course.findOne({
                title: { $regex: new RegExp(`^${updates.title.trim()}$`, 'i') },
                _id: { $ne: req.params.id }
            });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'Another course with this title already exists'
                });
            }
        }

        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined) {
                course[key] = updates[key];
            }
        });

        await course.save();
        await course.populate('instructor', 'name email');

        res.json({
            success: true,
            message: 'Course updated successfully',
            course
        });
    } catch (error) {
        console.error('Update course error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error updating course'
        });
    }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin only)
export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        await Course.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting course'
        });
    }
};

// @desc    Get overall course analytics (optional dashboard endpoint)
// @route   GET /api/courses/analytics
// @access  Private
export const getCourseAnalytics = async (req, res) => {
    try {
        const courses = await Course.find();

        let totalStudents = 0;
        let totalRevenue = 0;
        let totalPendingFees = 0;
        let pendingReminders = 0;

        courses.forEach(course => {
            totalStudents += course.students.length;
            course.students.forEach(s => {
                const paid = s.paidAmount || 0;
                const total = s.totalFee || 0;
                const pending = total - paid;
                totalRevenue += paid;
                if (pending > 0) {
                    totalPendingFees += pending;
                    pendingReminders += 1;
                }
            });
        });

        res.json({
            success: true,
            analytics: {
                totalCourses: courses.length,
                totalStudents,
                totalRevenue,
                totalPendingFees,
                pendingReminders
            }
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching analytics'
        });
    }
};