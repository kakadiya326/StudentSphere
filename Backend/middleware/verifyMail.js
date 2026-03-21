const otpModel = require("../models/otpModel");

let verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const record = await otpModel.findOne({ email: email });

        if (!record) return res.json({ "msg": "No OTP found" })

        if (Date.now() > record.expiresAt) {
            await otpModel.deleteOne({ email: email });
            return res.json({ "msg": "OTP expired" });
        }

        if (record.otp !== otp) return res.json({ "msg": "Invalid OTP" })

        await otpModel.deleteOne({ email: email });
        next();

    } catch (error) {
        console.log(error);
        res.json({ "msg": "Error in verifying OTP" })
    }
}

module.exports = verifyOTP;