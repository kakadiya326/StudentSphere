require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const route = require('./index')

const app = express()

mongoose.connect(process.env.DB_URL).then(() => {
    console.log('✅ con is ok');
}).catch((e) => {
    console.log('❌ DB failed');
})
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ "extended": true }))

// Serve uploads directory statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/', route)

app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`)
})