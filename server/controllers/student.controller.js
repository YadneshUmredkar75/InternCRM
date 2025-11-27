import Course from '../models/Course.js';

// @desc    Get all students across all courses
// @route   GET /api/students
// @access  Private
export const getAllStudents = async (req, res) => {
    try {
        const courses = await Course.find();
        const allStudents = courses.flatMap(course =>
            course.students.map(student => ({
                ...student.toObject(),
                courseTitle: course.title,
                courseId: course._id
            }))
        );

        res.json({
            success: true,
            students: allStudents,
            total: allStudents.length
        });
    } catch (error) {
        console.error('Get all students error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching students'
        });
    }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private
export const getStudentById = async (req, res) => {
    try {
        const courses = await Course.find();
        let foundStudent = null;
        let courseInfo = null;

        for (const course of courses) {
            const student = course.students.id(req.params.id);
            if (student) {
                foundStudent = student;
                courseInfo = {
                    title: course.title,
                    id: course._id,
                    startDate: course.startDate,
                    endDate: course.endDate
                };
                break;
            }
        }

        if (!foundStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.json({
            success: true,
            student: foundStudent,
            course: courseInfo
        });
    } catch (error) {
        console.error('Get student error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching student'
        });
    }
};

// @desc    Search students
// @route   GET /api/students/search
// @access  Private
export const searchStudents = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const courses = await Course.find({
            $or: [
                { 'students.name': { $regex: query, $options: 'i' } },
                { 'students.email': { $regex: query, $options: 'i' } },
                { 'students.phone': { $regex: query, $options: 'i' } }
            ]
        });

        const students = courses.flatMap(course =>
            course.students
                .filter(student =>
                    student.name.toLowerCase().includes(query.toLowerCase()) ||
                    student.email.toLowerCase().includes(query.toLowerCase()) ||
                    student.phone.includes(query)
                )
                .map(student => ({
                    ...student.toObject(),
                    courseTitle: course.title,
                    courseId: course._id
                }))
        );

        res.json({
            success: true,
            students,
            total: students.length
        });
    } catch (error) {
        console.error('Search students error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error searching students'
        });
    }
};

// @desc    Add student to course
// @route   POST /api/courses/:courseId/students
// @access  Private/Admin/Instructor
export const addStudentToCourse = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            joinDate,
            totalFee,
            paidAmount
        } = req.body;

        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if student with same email already exists in this course
        const existingStudent = course.students.find(
            student => student.email.toLowerCase() === email.toLowerCase()
        );

        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: 'Student with this email already exists in the course'
            });
        }

        // Check course capacity
        if (course.students.length >= course.maxStudents) {
            return res.status(400).json({
                success: false,
                message: 'Course has reached maximum student capacity'
            });
        }

        const student = {
            name,
            email,
            phone: phone.startsWith('+') ? phone : `+91${phone}`,
            joinDate: joinDate || new Date(),
            totalFee: totalFee || 18000,
            paidAmount: paidAmount || 0,
            feeStatus: paidAmount >= totalFee ? 'paid' : 'pending',
            reminderMessage: '',
            attendance: []
        };

        course.students.push(student);
        await course.save();

        const newStudent = course.students[course.students.length - 1];

        res.status(201).json({
            success: true,
            message: 'Student added successfully',
            student: newStudent
        });
    } catch (error) {
        console.error('Add student error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error adding student'
        });
    }
};

// @desc    Update student
// @route   PUT /api/courses/:courseId/students/:studentId
// @access  Private/Admin/Instructor
export const updateStudent = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            joinDate,
            totalFee,
            paidAmount
        } = req.body;

        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        const student = course.students.id(req.params.studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Check for duplicate email (excluding current student)
        const duplicateStudent = course.students.find(
            s => s.email.toLowerCase() === email.toLowerCase() &&
                s._id.toString() !== req.params.studentId
        );

        if (duplicateStudent) {
            return res.status(400).json({
                success: false,
                message: 'Another student with this email already exists in the course'
            });
        }

        // Update student fields
        student.name = name || student.name;
        student.email = email || student.email;
        student.phone = phone ? (phone.startsWith('+') ? phone : `+91${phone}`) : student.phone;
        student.joinDate = joinDate || student.joinDate;
        student.totalFee = totalFee || student.totalFee;
        student.paidAmount = paidAmount || student.paidAmount;
        student.feeStatus = student.paidAmount >= student.totalFee ? 'paid' : 'pending';

        await course.save();

        res.json({
            success: true,
            message: 'Student updated successfully',
            student
        });
    } catch (error) {
        console.error('Update student error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error updating student'
        });
    }
};

// @desc    Delete student from course
// @route   DELETE /api/courses/:courseId/students/:studentId
// @access  Private/Admin/Instructor
export const deleteStudent = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        const student = course.students.id(req.params.studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        course.students.pull(req.params.studentId);
        await course.save();

        res.json({
            success: true,
            message: 'Student removed successfully'
        });
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error removing student'
        });
    }
};

// @desc    Update student reminder message
// @route   PATCH /api/courses/:courseId/students/:studentId/reminder
// @access  Private/Admin/Instructor
export const updateStudentReminder = async (req, res) => {
    try {
        const { reminderMessage } = req.body;

        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        const student = course.students.id(req.params.studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        student.reminderMessage = reminderMessage || '';
        await course.save();

        res.json({
            success: true,
            message: 'Reminder message updated successfully',
            student
        });
    } catch (error) {
        console.error('Update reminder error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating reminder'
        });
    }
};

// @desc    Mark student attendance
// @route   POST /api/courses/:courseId/students/:studentId/attendance
// @access  Private/Admin/Instructor
export const markAttendance = async (req, res) => {
    try {
        const { date, status } = req.body;

        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        const student = course.students.id(req.params.studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Check if attendance already exists for this date
        const existingAttendance = student.attendance.find(
            a => a.date.toDateString() === new Date(date).toDateString()
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            student.attendance.push({
                date: date || new Date(),
                status: status || 'present'
            });
        }

        await course.save();

        res.json({
            success: true,
            message: 'Attendance marked successfully',
            attendance: student.attendance
        });
    } catch (error) {
        console.error('Mark attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error marking attendance'
        });
    }
};