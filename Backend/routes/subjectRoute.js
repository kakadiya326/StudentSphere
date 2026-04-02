const express = require("express")
const { createSubject, getSubjects, updateSubject, deleteSubject } = require("../controllers/subjectController")

const router = express.Router()
// /api/teacher/subject
router.post("/", createSubject)
router.get("/", getSubjects)
router.put("/:id", updateSubject)
router.delete("/:id", deleteSubject)

module.exports = router