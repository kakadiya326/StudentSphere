let checkRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.json({ "msg": "Access denied" })
        }
        next()
    }
}

module.exports = checkRole