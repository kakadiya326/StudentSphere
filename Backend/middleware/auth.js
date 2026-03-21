const jwt = require('jsonwebtoken')

let verifyToken = (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            return res.json({ error: "No token provided" })
        }

        let decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded
        next()
    } catch (e) {
        return res.json({ error: "Invalid token" })
    }
}

module.exports = verifyToken