const classModel = require("../models/classModel");

let createClass = async (req, res) => {
    try {
        let classObj = await classModel.findOne({ "name": req.body.name })
        if (classObj) {
            return res.json({ "msg": "class already exists" })
        }
        let newClass = new classModel({ ...req.body, classTeacher: req.user._id })
        await newClass.save()
        res.json({ "msg": "class created successfully" })
    } catch (error) {
        console.log(error);
        res.json({ "msg": "error creating class" })
    }
}

let getClasses = async (req, res) => {
    try {
        let classes = await classModel.find().populate({
            path: "classTeacher",
            populate: {
                path: "_id",
                select: "name email"
            }
        }).populate("subjects", "name code")

        res.json({ "msg": "classes fetched successfully", "classes": classes })
    } catch (error) {
        console.log(error);
        res.json({ "msg": "error fetching classes" })
    }
}

let getClassByTeacher = async (req, res) => {
    try {
        let classes = await classModel.find({ "classTeacher": req.user._id }).populate("subjects", "name code")

        res.json({ "msg": "classes fetched successfully", "classes": classes })

    } catch (error) {
        console.log(error);
        res.json({ "msg": "error fetching class of teacher" });
    }
}

let updateClass = async (req, res) => {
    try {
        let classObj = await classModel.findOne({ "_id": req.params.id })
        if (!classObj) return res.json({ "msg": "Class not found" })
        let updClass = await classModel.findOneAndUpdate({ "_id": req.params.id }, { $set: { ...req.body } }, { new: true })
        res.json({ "msg": "class updated successfully", "classes": updClass })
    } catch (error) {
        console.log(error);
        res.json({ "msg": "error updating class" })
    }
}

let deleteClass = async (req, res) => {
    try {
        let classObj = await classModel.findOne({ "_id": req.params.id });
        if (!classObj) return res.json({ "msg": "Class not found" });
        await classModel.findOneAndDelete({ "_id": req.params.id });
        res.json({ "msg": "class deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ "msg": "error deleting class" })
    }
}

module.exports = { createClass, getClasses, getClassByTeacher, updateClass, deleteClass }