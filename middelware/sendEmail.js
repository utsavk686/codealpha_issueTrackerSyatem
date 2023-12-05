import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "2108ujjwal2108@gmail.com",
        pass: "passcode"
    }
})

export default async function sendEmail(email, subject, message){

    try {
        const info = await transporter.sendMail({
            from: "Issue Tracker System",
            to: email,
            subject: subject,
            text: message
        })
        console.log(`Message sent: ${info.messageId}`)
        return info.messageId;

    } catch (error) {
        console.log(error)
        return false;
    }
}
