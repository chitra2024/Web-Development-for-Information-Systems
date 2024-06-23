const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

const courseSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        durationType: {
            type: String,
            required: true,
            enum: ['hours', 'days'],
        },
        difficulty: {
            type: String,
            required: true,
            enum: ['beginner', 'intermediate', 'expert'],
        },
        tasks: [taskSchema],
        enabled: {
            type: Boolean,
            required: true,
            default: true,
        }
    },
    {
        timestamps: true,
    }
);

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
