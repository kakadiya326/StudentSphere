const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    userId: {
        type: String, // reference to User _id
        required: true
    },
    courseIds: [
        {
            type: String // courses enrolled
        }
    ],
    progress: [
        {
            courseId: String,
            completedLessons: Number
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('student', studentSchema)