const teacherModel = require("../models/teacherModel")

let getProfile = async (req, res) => {
    try {
        let teacher = await teacherModel.findOne({ _id: req.user._id })
        if (!teacher) return res.json({ "msg": "Teacher not found" })
        res.json({ "msg": "Profile fetched successfully", teacher })

    } catch (error) {
        console.log(error);
        res.json({ "msg": "Error fetching profile" })
    }

}

let profileUpdate = async (req, res) => {
    try {
        let teacher = await teacherModel.findOneAndUpdate(
            { _id: req.user._id },
            { $set: req.body },
            { new: true }
        )
        res.json({ "msg": "Profile updated successfully", teacher })
    } catch (error) {
        console.log(error);
        res.json({ "msg": "Error updating profile" })
    }
}

let getAllTeacher = async (req, res) => {
    try {
        let teachers = await teacherModel.find()
        if (!teachers) return res.json({ "msg": "Teachers not found" })
        res.json({ "msg": "Teacher fetched successfully", teachers })
    } catch (error) {
        console.log(error);
        res.json({ "msg": "Error fetching teachers" })
    }
}

// axios.post('/api/teacher/search', { search: inputValue })
let searchTeachers = async (req, res) => {
    try {
        const { search } = req.body // one input

        let teachers = await teacherModel.aggregate([
            // Join user
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },

            // Join subjects
            {
                $lookup: {
                    from: "subjects",
                    localField: "subjects",
                    foreignField: "_id",
                    as: "subjects"
                }
            },

            // 🔥 Search logic
            {
                $match: search ? {
                    $or: [
                        { "user.name": { $regex: search, $options: "i" } },
                        { "user.email": { $regex: search, $options: "i" } },
                        { "department": { $regex: search, $options: "i" } },
                        { "subjects.name": { $regex: search, $options: "i" } }
                    ]
                } : {}
            },

            // Clean output
            {
                $project: {
                    name: "$user.name",
                    email: "$user.email",
                    department: 1,
                    subjects: "$subjects.name"
                }
            }
        ])

        res.json({ "msg": "Searched teachers", teachers })

    } catch (e) {
        console.log(e)
        res.json({ "msg": "Search failed" })
    }
}

let deleteTeacher = async (req, res) => {
    try {
        let teacher = await teacherModel.findByIdAndDelete({ _id: req.user._id })
        if (!teacher) return res.json({ "msg": "Teacher not found" })
        res.json({ "msg": "Teacher deleted successfully", teacher })
    } catch (error) {
        console.log(error);
        res.json({ "msg": "Error deleting teacher" })
    }
}

module.exports = { profileUpdate, getProfile, getAllTeacher, searchTeachers, deleteTeacher }