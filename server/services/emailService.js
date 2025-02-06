require("dotenv").config();
const nodemailer = require("nodemailer");

// 📌 DEBUG: Verificar si las credenciales están cargando
console.log("📌 EMAIL_USER:", process.env.EMAIL_USER);
console.log("📌 EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "OK" : "FALTA");

// Configuración de transporte SMTP para Gmail
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // ⚡ 465 para SSL, 587 para TLS
    secure: true, // true para 465, false para 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

async function sendPasswordEmail(toEmail, tempPassword) {
    try {
        const mailOptions = {
            from: `"Soporte Técnico" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: "🔑 Tu contraseña temporal",
            text: `Hola,\n\nTu nueva contraseña temporal es: ${tempPassword}\n\nPor favor, cámbiala al iniciar sesión.`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Correo enviado a ${toEmail}`);
        return { success: true };
    } catch (error) {
        console.error("❌ Error al enviar correo:", error.message || error);
        return { success: false, message: "Error al enviar correo" };
    }
}

module.exports = { sendPasswordEmail };
