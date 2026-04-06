const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir)
    },
    filename: (req, file, cb) => {
        // Generate unique filename: timestamp-originalname
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.originalname}`
        cb(null, uniqueName)
    }
})

// Configure multer upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allowed file types
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
            'image/gif',
            'text/plain',
            'application/zip',
            'application/x-rar-compressed',
            'video/mp4',
            'video/quicktime'
        ]

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error(`File type ${file.mimetype} not allowed`), false)
        }
    }
})

// Create profilePics directory if it doesn't exist
const profilePicsDir = path.join(__dirname, '../profilePics')
if (!fs.existsSync(profilePicsDir)) {
    fs.mkdirSync(profilePicsDir, { recursive: true })
}

// Configure multer storage for profile pics
const profilePicStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, profilePicsDir)
    },
    filename: (req, file, cb) => {
        // Generate unique filename: timestamp-originalname
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.originalname}`
        cb(null, uniqueName)
    }
})

// Configure multer upload for profile pics
const uploadProfilePic = multer({
    storage: profilePicStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit for profile pics
    },
    fileFilter: (req, file, cb) => {
        // Allowed image types only
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp'
        ]

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error(`File type ${file.mimetype} not allowed. Only images are allowed for profile pictures.`), false)
        }
    }
})

// Middleware for multiple files
const uploadMultiple = upload.array('files', 10) // Max 10 files

module.exports = { upload, uploadMultiple, uploadProfilePic }
