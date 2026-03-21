const subjectModel = require("../models/subjectModel");
const teacherModel = require("../models/teacherModel");

let createSubject = async (req, res) => {
    try {
        let subject = await subjectModel.findOne({ "code": req.body.code })
        if (subject) {
            return res.json({ "msg": "Subject with this code already exists" })
        }
        subject = new subjectModel({ ...req.body, teacherId: req.user._id })
        await subject.save()
        // await subject.populate("teacherId", "name email")
        await teacherModel.findOneAndUpdate({ _id: req.user._id }, { $push: { subjects: subject._id } })
        res.json({ "msg": "Subject created successfully", subject })

    } catch (error) {
        console.log(error);
        res.json({ "msg": "Error creating subject" })
    }
}

let getSubjects = async (req, res) => {
    try {
        let subjects = await subjectModel.find().populate({
            path: "teacherId",
            populate: {
                path: "_id",
                select: "name email"
            }
        })
        res.json({ "msg": "Subjects retrieved successfully", subjects })
    } catch (error) {
        console.log(error);
        res.json({ "msg": "Error retrieving subjects" })
    }
}

let updateSubject = async (req, res) => {
    try {
        let subject = await subjectModel.findOneAndUpdate({ _id: req.params.id }, { ...req.body }, { new: true })
        res.json({ "msg": "Subject updated successfully", subject });
    } catch (error) {
        console.log(error);
        res.json({ "msg": "Error updating subject" })
    }
}

let deleteSubject = async (req, res) => {
    try {
        let subject = await subjectModel.findOneAndDelete({ _id: req.params.id })
        res.json({ "msg": "Subject deleted successfully", subject });
    } catch (error) {
        console.log(error);
        res.json({ "msg": "Error deleting subject" })
    }
}

let getMySubjects = async (req, res) => {
    try {
        let subjects = await subjectModel.find({ teacherId: req.user._id })
        if (subjects.length === 0) return res.json({ "msg": "NO subjects assigned to you yet" })
        res.json({ "msg": "Subjects retrieved successfully", subjects })

    } catch (error) {
        console.log(error);
        res.json({ "msg": "Error getting subject of logged-in teacher" })
    }
}

module.exports = { createSubject, getSubjects, updateSubject, deleteSubject, getMySubjects }