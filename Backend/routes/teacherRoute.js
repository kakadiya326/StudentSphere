const express = require('express')
const { getProfile, profileUpdate } = require("../controllers/teacherController")
const subjectRoute = require("./subjectRoute")
const lessonRoute = require("./lessonRoute")
const { addAssignmentToLesson, updateAssignment, gradeSubmission } = require('../controllers/lessonController')
let router = express.Router()
// /api/teacher
router.get('/profile', getProfile)
router.put('/profile', profileUpdate)

// Subject CRUD
router.use("/subject", subjectRoute)

// Lesson CRUD
router.use("/lessons", lessonRoute)

// Assignment management
router.post("/:lessonId/assignments", addAssignmentToLesson)
router.put("/:lessonId/assignments/:assignmentIndex", updateAssignment)

// Grading (teacher only)
router.put("/submissions/:submissionId/grade", gradeSubmission)

module.exports = router