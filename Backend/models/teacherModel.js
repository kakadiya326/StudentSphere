const mongoose = require('mongoose')

const teacherSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    department: {
        type: String,
        required: true
    },
    subjects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subject'
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('teacher', teacherSchema)