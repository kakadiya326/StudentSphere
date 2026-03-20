const Counter = require('../models/counterModel')

const generateEnrollment = async (dept) => {
    let year = new Date().getFullYear().toString().slice(-2)

    let counter = await Counter.findOneAndUpdate(
        { dept },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    )

    let sequence = counter.seq.toString().padStart(5, '0')

    return `${year}LMS${dept}${sequence}`
}