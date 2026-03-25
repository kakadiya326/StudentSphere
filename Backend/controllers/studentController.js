let studentModel = require('../models/studentModel');
let { generateEnrollment } = require('../models/genEnroll');
const userModel = require('../models/userModel');

// For student to create their profile
let addStudent = async (req, res) => {
    try {
        let student = await studentModel.findById(req.user.id);
        if (student) {
            return res.json({ "error": "Student profile already exists" })
        }
        let userEnrollment = await generateEnrollment(req.body.department);
        let data = new studentModel({ ...req.body, userId: userEnrollment, _id: req.user.id });
        await data.save();
        res.json({ "success": "Student added successfully" })
    }
    catch (e) {
        console.log(e);
        res.json({ "error": "Error in adding student" })
    }
}

// for student to view their profile
let getStudent = async (req, res) => {
    try {
        let student = await studentModel.findById(req.user.id);
        if (!student) {
            return res.json({ "error": "Student profile not found" })
        }
        res.json({ "success": "Student profile found", "data": student })
    } catch (e) {
        console.log(e);
        res.json({ "error": "Error in fetching student" })
    }
}

// For student to update their profile
let updateStudent = async (req, res) => {
    try {
        let student = await studentModel.findById(req.user.id);
        if (!student) {
            return res.json({ "error": "Student profile not found" })
        }
        await studentModel.findByIdAndUpdate(req.user.id, req.body);
        res.json({ "success": "Student profile updated successfully" });
    } catch (e) {
        console.log(e);
        res.json({ "error": "Error in updating student" });
    }
}

let enrollInSubject = async (req, res) => {
    try {
        const studentId = req.user.id
        const { courseId } = req.body

        let student = await studentModel.findByIdAndUpdate(
            studentId,
            {
                $addToSet: { courseIds: courseId }//to avoid duplicate
            },
            { new: true }
        )
        res.json({ "success": "Enrolled successfully", student })
    } catch (error) {
        console.log(error);
        res.json({ "error": "Something went wrong." })
    }
}

// For student to delete their profile
let deleteStudent = async (req, res) => {
    try {
        let student = await studentModel.findById(req.user.id);
        if (!student) {
            return res.json({ "error": "Student profile not found" })
        }
        await studentModel.findByIdAndDelete(req.user.id);
        res.json({ "success": "Student profile deleted successfully" });
    }
    catch (e) {
        console.log(e);
        res.json({ "error": "Error in deleting student" })
    }
}

// For admin to view all students
let getS = async (req, res) => {
    try {
        let students = await studentModel.find();
        res.json({ "success": "Students fetched successfully", "data": students });
    }
    catch (e) {
        console.log(e);
        res.json({ "error": "Error in fetching students" });
    }
}

// For admin to view student by enrollment number
let getStudentByEnrollment = async (req, res) => {
    try {
        let student = await studentModel.findOne({ userId: req.params.enrollment });
        if (!student) {
            return res.json({ "error": "Student profile not found" })
        }
        res.json({ "success": "Student profile found", "data": student })
    } catch (e) {
        console.log(e);
        res.json({ "error": "Error in fetching student by enrollment" });
    }
}

// For admin to add student profile
let addS = async (req, res) => {
    try {
        let student = await userModel.findOne({ "name": req.body.name, "email": req.body.email });
        if (!student) {
            return res.json({ "error": "User is not registered" });
        }
        let userEnrollment = await generateEnrollment(req.body.department);
        let data = new studentModel({ ...req.body, userId: userEnrollment, _id: student._id });
        await data.save();
        res.json({ "success": "Student added successfully" });
    } catch (e) {
        console.log(e);
        res.json({ "error": "Error in adding student" });
    }
}

// For admin to update student profile
let updateS = async (req, res) => {
    try {
        let student = await studentModel.findOne({ userId: req.params.enrollment });
        if (!student) {
            return res.json({ "error": "Student profile not found" })
        }
        await studentModel.findByIdAndUpdate(student._id, req.body);
        res.json({ "success": "Student profile updated successfully" });
    } catch (e) {
        console.log(e);
        res.json({ "error": "Error in updating student" });
    }
}

// For admin to delete student profile
let deleteS = async (req, res) => {
    try {
        let student = await studentModel.findOne({ userId: req.params.enrollment });
        if (!student) {
            return res.json({ "error": "Student profile not found" })
        }
        await studentModel.findByIdAndDelete(student._id);
        res.json({ "success": "Student profile deleted successfully" });
    } catch (e) {
        console.log(e);
        res.json({ "error": "Error in deleting student" });
    }
}


// Exporting all controller functions
module.exports = {
    // For student
    addStudent, getStudent, updateStudent, deleteStudent, enrollInSubject,

    // For admin
    getS, getStudentByEnrollment, addS, updateS, deleteS
}