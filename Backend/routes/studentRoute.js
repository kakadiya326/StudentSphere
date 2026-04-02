let express = require('express')
const { getSubjects, enrollInSubject, mySubjects, updateProgress, unenrollFromSubject } = require('../controllers/subjectController')
const { getStudentProfile, updateStudentProfile } = require('../controllers/studentController')
const { submitAssignment, getStudentSubmissions, getAllStudentSubmissions, getSubmissionsForLesson, gradeSubmission, markLessonComplete, getLessonsBySubject } = require('../controllers/lessonController')
const { uploadMultiple } = require('../middleware/uploadFile')

let router = express.Router()

// /api/student

router.get("/subject", getSubjects)
router.put("/enroll", enrollInSubject)
router.get("/mysubjects", mySubjects)
router.post("/progress", updateProgress)
router.put("/unenroll", unenrollFromSubject)
router.get("/profile", getStudentProfile)
router.post("/profile", updateStudentProfile)

// Lessons
router.get("/lessons/subject/:subjectId", getLessonsBySubject)

// Student submissions with file upload
router.post("/submit", uploadMultiple, submitAssignment)
router.get("/:lessonId/submissions/student", getStudentSubmissions)
router.get("/submissions/all", getAllStudentSubmissions)
router.get("/:lessonId/submissions", getSubmissionsForLesson)
// teacher grading moved to /api/teacher for role consistency
router.post("/complete", markLessonComplete)

module.exports = router