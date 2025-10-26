import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.APP_PASS,
  },
});

console.log(process.env.GMAIL);

export async function sendEmail({ to, subject, text }: {
  to: string;
  subject: string;
  text: string;
}) {
  const mailOptions = {
    from: `<${process.env.GMAIL_USER}>`,
    to,
    subject,
    ...(text && { text }),
  };

  try {
    await transporter.sendMail(mailOptions);
    return "Email sent successfully";
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}
