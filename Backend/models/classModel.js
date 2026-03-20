const mongoose = require('mongoose')

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    students: [
        {
            type: String,
            ref: 'user'
        }
    ],
    subjects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subject'
        }
    ],
    classTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('class', classSchema)