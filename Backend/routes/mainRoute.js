let express = require('express')
const userRoute = require('./userRoute')
const adminRoute = require('./adminRoute')

let route = express.Router()

route.use('/api/user', userRoute)
route.use('/api/admin', adminRoute)

module.exports = route