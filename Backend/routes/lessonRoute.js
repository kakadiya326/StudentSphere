const express = require("express")
const { createLesson, getLessonsBySubject, getLesson, updateLesson, deleteLesson, reorderLessons } = require("../controllers/lessonController")
const { uploadMultiple } = require("../middleware/uploadFile")
const multer = require('multer')

const storage = multer.memoryStorage() // or diskStorage
const upload = multer({ storage })

const router = express.Router()
// /api/teacher/lesson

// Lesson CRUD
router.post("/", upload.none(), createLesson)
router.get("/subject/:subjectId", getLessonsBySubject)
router.get("/:id", getLesson)
router.put("/:id", updateLesson)
router.delete("/:id", deleteLesson)
router.put("/reorder", reorderLessons)

module.exports = router