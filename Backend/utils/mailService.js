const nodemailer = require('nodemailer');
const getEmailTemplate = require('../utils/emailTamplate');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.ADMIN_MAIL,
        pass: process.env.ADMIN_PASSWORD,
    },
});

let sendOTPEmail = async (to, otp) => {
    try {
        if (!process.env.ADMIN_MAIL || !process.env.ADMIN_PASSWORD) {
            console.error('Mail service not configured: ADMIN_MAIL or ADMIN_PASSWORD is missing.');
            return false;
        }

        const mailOptions = {
            from: `"Kakadiya Chiranj" <${process.env.ADMIN_MAIL}>`,
            to: to,
            subject: "Email Verification",
            html: getEmailTemplate(otp),
        }

        let info = await transporter.sendMail(mailOptions);
        console.log('Mail send result:', info);

        if (Array.isArray(info.accepted) && info.accepted.length > 0 && (!info.rejected || info.rejected.length === 0)) {
            return true;
        }

        console.error('OTP email not accepted:', info);
        return false;
    }
    catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
}

module.exports = sendOTPEmail