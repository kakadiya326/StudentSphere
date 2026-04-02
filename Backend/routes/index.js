let express = require('express')
const userRoute = require('./userRoute')
const studentRoute = require('./studentRoute')
const teacherRoute = require('./teacherRoute')
const checkRole = require('../middleware/checkRole')
const verifyToken = require('../middleware/auth')

let route = express.Router()

route.use('/api/auth', userRoute)
route.use('/api/student', verifyToken, checkRole('student'), studentRoute)
route.use('/api/teacher', verifyToken, checkRole('teacher'), teacherRoute)

module.exports = route