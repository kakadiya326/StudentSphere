let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

let register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        let user = await userModel.findOne({ email })
        if (user) {
            return res.json({ "error": "User already exists" })
        } else {
            // let pwdHash = await bcrypt.hash(password, 10)
            let data = new userModel(req.body)
            await data.save()
            res.json({ "success": "Registered successfully!!" })
        }
    } catch (e) {
        console.log(e);
        res.json({ "error": "Error in registration" })
    }
}

let login = async (req, res) => {
    try {
        const { email, password } = req.body
        let user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ "error": "User not found" })
        }
        // let isMatch = await bcrypt.compare(password, user.password)
        // if (!isMatch) {
        //     return res.json({ "error": "password incorrect" })
        // }
        if (password != user.password) {
            return res.json({ "error": "password incorrect" })
        }
        let token = await jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1d" })
        res.json({ "success": "Login success", "udata": { ...user._doc, "password": "" }, token })
    } catch (e) {
        console.log(e);
        res.json({ "error": "" })
    }
}

module.exports = { register, login }