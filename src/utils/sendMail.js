const nodeMailer = require("modemailer");

const transport = nodeMailer.createTransport({
    host: "smtp-relay.brevo.com",
    port:587,
    auth: {
        user: process.env.BREVO_USER, // your brevo email/login
        pass: process.env.BREVO_PASS, //SMTP key
    },
});

const sendMail = async (to, subject, text) => {
    try {
        const mailToUser = await transport.sendMail({
            from: `"Support Team" <${process.env.BREVO_USER}>`,
            to,
            subject,
            text,
        });
        console.log("Email sent to:", to);
    } catch(err) {
        console.error("Email send failed:", err);
        next(err);
    }
}

module.exports = sendMail;