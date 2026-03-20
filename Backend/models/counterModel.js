const mongoose = require('mongoose')

const counterSchema = new mongoose.Schema({
    dept: String,
    seq: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('counter', counterSchema)