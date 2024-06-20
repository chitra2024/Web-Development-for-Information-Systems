const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const User = require('../models/User');

// Get all courses
const getCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({});
    res.json(courses);
});

// Add new course
const addCourse = asyncHandler(async (req, res) => {
    const { title, description, category, duration, durationType, difficulty, tasks } = req.body;
    const course = new Course({
        title,
        description,
        category,
        duration,
        durationType,
        difficulty,
        tasks: tasks || [],
        enabled: true,
    });
    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
});

// Update a course
const updateCourse = asyncHandler(async (req, res) => {
    const { title, description, category, duration, durationType, difficulty, tasks, enabled } = req.body;

    const course = await Course.findById(req.params.id);

    if (course) {
        course.title = title || course.title;
        course.description = description || course.description;
        course.category = category || course.category;
        course.duration = duration || course.duration;
        course.durationType = durationType || course.durationType;
        course.difficulty = difficulty || course.difficulty;
        course.tasks = tasks.length > 0 ? tasks : course.tasks;
        course.enabled = enabled !== undefined ? enabled : course.enabled;

        try {
            const updatedCourse = await course.save();
            res.json(updatedCourse);
        } catch (error) {
            res.status(400).json({ message: 'Failed to update course', error });
        }
    } else {
        res.status(404);
        throw new Error('Course not found');
    }
});

// Delete a course
const deleteCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (course) {
        await course.deleteOne(); // Use deleteOne instead of remove
        res.json({ message: 'Course removed' });
    } else {
        res.status(404);
        throw new Error('Course not found');
    }
});

// Add a task to a course
const addTask = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (course) {
        const task = {
            title: req.body.title,
            description: req.body.description,
        };
        course.tasks.push(task);
        const updatedCourse = await course.save();
        res.status(201).json(updatedCourse);
    } else {
        res.status(404);
        throw new Error('Course not found');
    }
});

// Delete a task from a course
const deleteTask = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.courseId);
    if (course) {
        course.tasks = course.tasks.filter((task) => task._id.toString() !== req.params.taskId);
        const updatedCourse = await course.save();
        res.json(updatedCourse);
    } else {
        res.status(404);
        throw new Error('Course not found');
    }
});

// Enroll in a course
const enrollCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.courseId);
    const user = await User.findById(req.user._id);

    if (course && user) {
        if (!user.enrolledCourses.some(ec => ec.course.toString() === course._id.toString())) {
            user.enrolledCourses.push({ course: course._id });
            await user.save();
            res.status(201).json({ message: 'Enrolled successfully' });
        } else {
            res.status(400).json({ message: 'Already enrolled' });
        }
    } else {
        res.status(404).json({ message: 'Course or user not found' });
    }
});

// Get enrolled courses for a user
const getEnrolledCourses = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId).populate('enrolledCourses.course');
    if (user) {
        res.json(user.enrolledCourses);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Mark a course as complete
const completeCourse = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        const enrolledCourse = user.enrolledCourses.find(ec => ec.course.toString() === req.params.courseId);
        if (enrolledCourse) {
            enrolledCourse.completed = true;
            await user.save();
            res.json({ message: 'Course marked as completed' });
        } else {
            res.status(404).json({ message: 'Enrollment not found' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = {
    getCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    addTask,
    deleteTask,
    enrollCourse,
    getEnrolledCourses,
    completeCourse,
};
