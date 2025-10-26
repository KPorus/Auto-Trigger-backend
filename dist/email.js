"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL,
        pass: process.env.APP_PASS,
    },
});
// console.log(process.env.GMAIL);
async function sendEmail({ to, subject, text }) {
    const mailOptions = {
        from: `<${process.env.GMAIL_USER}>`,
        to,
        subject,
        ...(text && { text }),
    };
    try {
        await transporter.sendMail(mailOptions);
        return "Email sent successfully";
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
}
