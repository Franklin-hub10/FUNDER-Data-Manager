document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('changePasswordForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const newPassword = document.getElementById("newPassword").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const idColaborador = sessionStorage.getItem("tempUserId");

        if (!idColaborador) {
            alert("No se encontró el usuario. Intente iniciar sesión nuevamente.");
            window.location.href = "/public/screens/index.html";
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/auth/cambiar-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idColaborador, nuevaPassword: newPassword }),
            });

            const result = await response.json();

            if (response.ok) {
                alert("✅ Contraseña actualizada correctamente. Ahora puedes iniciar sesión.");
                sessionStorage.clear();
                window.location.href = "/public/screens/index.html";
            } else {
                alert(`❌ ${result.message}`);
            }
        } catch (error) {
            console.error("❌ Error al cambiar contraseña:", error);
            alert("Error en el servidor, intenta más tarde.");
        }
    });
});
