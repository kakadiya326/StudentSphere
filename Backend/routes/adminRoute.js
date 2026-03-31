let express = require('express')
const subjectRoute = require("../routes/subjectRoute")
const teacherRoute = require("../routes/teacherRoute")
let router = express.Router()

router.use("/subject", subjectRoute)
router.use("/teacher", teacherRoute)


module.exports = router 