import nodemailer from 'nodemailer'

export const sendMail = async(to: string, subject: string, htmlContent: string) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT as string),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })
        const mailOptions = {
            from: `"Baking Cute" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html: htmlContent,
        }
        const result = await transporter.sendMail(mailOptions)
        return result
    } catch (err) {
        console.error("❌ Send mail error:", err);
        throw err;
    }
}