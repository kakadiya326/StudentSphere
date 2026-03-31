let express = require('express')
const { getSubjects, enrollInSubject, mySubjects, updateProgress, unenrollFromSubject } = require('../controllers/subjectController')
const { getStudentProfile, updateStudentProfile } = require('../controllers/studentController')

let router = express.Router()
// /api/student
// router.post("/profile", addStudent)
// router.get("/profile", getStudent)
// router.put("/profile", updateStudent)
// router.delete("/profile", deleteStudent)


// router.put("/enroll", enrollInSubject)
// router.get("/subjects", getSubjects)
// router.get("/mysubjects", mySubjects)
// router.post("/progress", updateProgress)


router.get("/subject", getSubjects)
router.put("/enroll", enrollInSubject)
router.get("/mysubjects", mySubjects)
router.post("/progress", updateProgress)
router.put("/unenroll", unenrollFromSubject)
router.get("/profile", getStudentProfile)
router.post("/profile", updateStudentProfile)

module.exports = router