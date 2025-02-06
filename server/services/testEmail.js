
const { sendPasswordEmail } = require("../services/emailService"); // Ajusta la ruta según la ubicación real



(async () => {
    const testEmail = "fffdesmond@gmail.com"; // Usa un correo válido para prueba
    const tempPassword = "Test1234";

    const result = await sendPasswordEmail(testEmail, tempPassword);
    console.log("📧 Resultado del envío:", result);
})();
