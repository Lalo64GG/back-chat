
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const sendEmail = async (email: string, token: string, userName: string) => {
    try {
        const transporter = nodemailer.createTransport({
            host : process.env.EMAIL_HOST,
            port : parseInt(process.env.EMAIL_PORT || '25'),
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS 
            }
        });
        
        const resetLink = `${process.env.FRONTEND_URL}/password-reset/${token}`;
        const htmlContent = fs.readFileSync(
            path.join(__dirname, "../../templates/email/reset_password.html"),
            "utf8"
        ).replace("{{resetLink}}", resetLink)
        .replace("{{userName}}", userName);

        await transporter.sendMail({
            from: `"Soporte" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Restablecimiento de contraseña",
            html: htmlContent
        });

        console.log(`Correo enviado a: ${email}`);
    } catch (error) {
        console.error("Error enviando el correo: ", error);
    }
};

export default sendEmail;

