const nodemailer = require('nodemailer');
require("dotenv").config();

const USER_NAME = process.env.BREVO_USER;
const USER_PASS = process.env.BREVO_PASS;

const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port:465, //587,//465
    secure: true,
    auth: {
        user: USER_NAME, // your brevo email/login
        pass: USER_PASS, //SMTP key
    },
});

// // ✅ Verify SMTP connection before sending
// transport.verify((error, success) => {
//   if (error) {
//     console.error("❌ SMTP Connection Error:", error);
//   } else {
//     console.log("✅ SMTP Server is ready to send emails!");
//   }
// });

const sendMail = async (to, subject, text) => {
    try {
        const mailToUser = await transport.sendMail({
            from: `"Support Team" <norelay@company.com>`,
            to,
            subject,
            text,
        });
        console.log("Email sent to:", to);
        return mailToUser;
    } catch(err) {
        console.error("Email send failed:", err);
         throw err;
    }
}

module.exports = sendMail;