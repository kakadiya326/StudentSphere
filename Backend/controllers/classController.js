const classModel = require("../models/classModel");

let createClass = async (req, res) => {
    try {
        let classObj = await classModel.findOne({ "name": req.body.name })
        if (classObj) {
            return res.json({ "error": "Class already exists" })
        }
        let newClass = new classModel({ ...req.body, classTeacher: req.user.id })
        await newClass.save()
        res.json({ "success": "Class created successfully" })
    } catch (error) {
        console.log(error);
        res.json({ "error": "Error creating class" })
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

        res.json({ "success": "Classes fetched successfully", "classes": classes })
    } catch (error) {
        console.log(error);
        res.json({ "error": "error fetching classes" })
    }
}

let getClassByTeacher = async (req, res) => {
    try {
        let classes = await classModel.find({ "classTeacher": req.user.id }).populate("subjects", "name code")

        res.json({ "success": "Classes fetched successfully", "classes": classes })

    } catch (error) {
        console.log(error);
        res.json({ "error": "error fetching class of teacher" });
    }
}

let updateClass = async (req, res) => {
    try {
        let classObj = await classModel.findOne({ "_id": req.params.id })
        if (!classObj) return res.json({ "error": "Class not found" })
        let updClass = await classModel.findOneAndUpdate({ "_id": req.params.id }, { $set: { ...req.body } }, { new: true })
        res.json({ "success": "class updated successfully", "classes": updClass })
    } catch (error) {
        console.log(error);
        res.json({ "error": "error updating class" })
    }
}

let deleteClass = async (req, res) => {
    try {
        let classObj = await classModel.findOne({ "_id": req.params.id });

        if (!classObj) return res.json({ "error": "Class not found" });

        await classModel.findOneAndDelete({ "_id": req.params.id });
        res.json({ "success": "class deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ "error": "Error deleting class" })
    }
}

module.exports = { createClass, getClasses, getClassByTeacher, updateClass, deleteClass }