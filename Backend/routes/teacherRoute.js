const express = require('express')
const { getProfile, profileUpdate } = require("../controllers/teacherController")
let router = express.Router()

router.get('/', getProfile)
router.put('/', profileUpdate)

module.exports = router