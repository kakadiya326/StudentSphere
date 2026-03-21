let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

let register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        let user = await userModel.findOne({ email })
        if (user) {
            return res.json({ "msg": "User already exists" })
        } else {
            // let pwdHash = await bcrypt.hash(password, 10)
            let data = new userModel(req.body)
            await data.save()
            res.json({ "msg": "Registered successfully!!" })
        }
    } catch (e) {
        console.log(e);
        res.json({ "msg": "Error in registration" })
    }
}

let login = async (req, res) => {
    try {
        const { email, password } = req.body
        let user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ "msg": "User not found" })
        }
        // let isMatch = await bcrypt.compare(password, user.password)
        // if (!isMatch) {
        //     return res.json({ "msg": "password incorrect" })
        // }
        if (password != user.password) {
            return res.json({ "msg": "password incorrect" })
        }
        let token = await jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1d" })
        res.json({ "msg": "Login msg", "udata": { ...user._doc, "password": "" }, token })
    } catch (e) {
        console.log(e);
        res.json({ "msg": "Error in login" })
    }
}

module.exports = { register, login }