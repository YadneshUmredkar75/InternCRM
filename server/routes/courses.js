import express from 'express';
import {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseAnalytics
} from '../controllers/courseController.js';

import {
    addStudentToCourse,
    updateStudent,
    deleteStudent,
    updateStudentReminder,
    markAttendance
} from '../controllers/student.controller.js';

const router = express.Router();

// Public routes - no authentication required
router.get('/', getAllCourses);
router.get('/analytics', getCourseAnalytics);
router.get('/:id', getCourseById);
router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

// Student-in-course routes
router.post('/:courseId/students', addStudentToCourse);
router.put('/:courseId/students/:studentId', updateStudent);
router.delete('/:courseId/students/:studentId', deleteStudent);
router.patch('/:courseId/students/:studentId/reminder', updateStudentReminder);
router.post('/:courseId/students/:studentId/attendance', markAttendance);

export default router;