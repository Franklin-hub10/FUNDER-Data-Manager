document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (!token) {
        alert("Token no válido.");
        window.location.href = "/public/screens/index.html";
        return;
    }

    const form = document.getElementById('resetPasswordForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const newPassword = document.getElementById("newPassword").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        if (newPassword !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, nuevaPassword: newPassword }),
            });

            const result = await response.json();

            if (response.ok) {
                alert("✅ Contraseña actualizada correctamente. Ahora puedes iniciar sesión.");
                window.location.href = "/public/screens/index.html";
            } else {
                alert(`❌ ${result.message}`);
            }
        } catch (error) {
            console.error("❌ Error al cambiar contraseña:", error);
            alert("Error en el servidor.");
        }
    });
});
