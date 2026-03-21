let express = require('express')
const { addStudent, getStudent, updateStudent, deleteStudent } = require('../controllers/studentController')
let router = express.Router()

router.post("/profile", addStudent)
router.get("/profile", getStudent)
router.put("/profile", updateStudent)
router.delete("/profile", deleteStudent)

module.exports = router