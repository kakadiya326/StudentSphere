let express = require('express')
const { uploadProfilePic } = require('../middleware/uploadFile')
const { register, login, uploadProfilePic: uploadProfilePicController } = require('../controllers/userController')
const verifyOTP = require('../middleware/verifyMail');
const sendOTP = require('../middleware/sendOTP');
const verifyToken = require('../middleware/auth')
let router  = express.Router()

// const checkRole = require('../middleware/checkRole')

// userRoute.post('/create-course', verifyToken, checkRole("teacher"), handler)

router.post('/sendotp', sendOTP);
router.post('/verifyotp', verifyOTP, (req, res) => res.json({ "success": "OTP verified successfully" }));
router.post('/register', register)
router.post('/login', login)
router.post('/upload-profile-pic', verifyToken, uploadProfilePic.single('profilePic'), uploadProfilePicController)

module.exports = router