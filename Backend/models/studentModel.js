const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    enrollment: {
        type: String, // reference to generated automatic
        required: true
    },
    courseIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subject"
        }
    ],
    progress: [
        {
            courseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "subject"
            },
            completedLessons: {
                type: Number,
                default: 0
            }
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('student', studentSchema)