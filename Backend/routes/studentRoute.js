let express = require('express')
const { addStudent, getStudent, updateStudent, deleteStudent, enrollInSubject } = require('../controllers/studentController')
const { getSubjects, mySubjects, updateProgress } = require('../controllers/subjectController')
let router = express.Router()
// /api/student
router.post("/profile", addStudent)
router.get("/profile", getStudent)
router.put("/profile", updateStudent)
router.delete("/profile", deleteStudent)
router.put("/enroll", enrollInSubject)

router.get("/subjects", getSubjects)
router.get("/mysubjects", mySubjects)
router.post("/progress",updateProgress)

module.exports = router