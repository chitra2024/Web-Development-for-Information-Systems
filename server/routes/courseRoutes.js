const express = require('express');
const {
    getCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    addTask,
    deleteTask,
    enrollCourse,
    getEnrolledCourses,
    completeCourse,
} = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(getCourses)
    .post(protect, admin, addCourse);

router.route('/:id')
    .get(getCourses) // Ensure this line is added to get a single course if needed
    .put(protect, admin, updateCourse)
    .delete(protect, admin, deleteCourse);

router.route('/:id/tasks')
    .post(protect, admin, addTask);

router.route('/:courseId/tasks/:taskId')
    .delete(protect, admin, deleteTask);

router.route('/:courseId/enroll')
    .post(protect, enrollCourse);

router.route('/enrolled/:userId')
    .get(protect, getEnrolledCourses);

router.route('/:courseId/complete')
    .post(protect, completeCourse);

module.exports = router;
