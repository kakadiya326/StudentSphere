let express = require('express')
const { register, login } = require('../controllers/userController')
let router  = express.Router()

// const checkRole = require('../middleware/checkRole')

// userRoute.post('/create-course', verifyToken, checkRole("teacher"), handler)

router.post('/register', register)
router.post('/login', login)

module.exports = router