import express from 'express';
import Student from '../models/student.model.js'

const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: students,
            total: students.length
        });
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching students'
        });
    }
});

// Search students
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const students = await Student.searchStudents(q);

        res.json({
            success: true,
            data: students,
            total: students.length
        });
    } catch (error) {
        console.error('Search students error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error searching students'
        });
    }
});

// Get student by ID
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Get student error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching student'
        });
    }
});

// Create new student
router.post('/', async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            selectedCourse,
            courseName,
            totalFees,
            paidFees
        } = req.body;

        // Check if student with email already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: 'Student with this email already exists'
            });
        }

        const student = new Student({
            name,
            email,
            phone,
            selectedCourse,
            courseName,
            totalFees: parseInt(totalFees),
            paidFees: parseInt(paidFees || 0)
        });

        await student.save();

        res.status(201).json({
            success: true,
            message: 'Student added successfully',
            data: student
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
});

// Update student
router.put('/:id', async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            selectedCourse,
            courseName,
            totalFees,
            paidFees,
            status
        } = req.body;

        // Check for duplicate email (excluding current student)
        const duplicateStudent = await Student.findOne({
            email,
            _id: { $ne: req.params.id }
        });

        if (duplicateStudent) {
            return res.status(400).json({
                success: false,
                message: 'Another student with this email already exists'
            });
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            {
                name,
                email,
                phone,
                selectedCourse,
                courseName,
                totalFees: parseInt(totalFees),
                paidFees: parseInt(paidFees || 0),
                status
            },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.json({
            success: true,
            message: 'Student updated successfully',
            data: student
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
});

// Delete student
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting student'
        });
    }
});

export default router;