const API_BASE_URL = 'http://localhost:3000';
const API_ROLES = "http://localhost:3000/emprendimientos";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formulario"); // Ahora selecciona por ID
    const steps = document.querySelectorAll('.progress-steps .step');
    const line = document.querySelector('.progress-steps .line');
    // Se asume que el select de gestión existe en la página
    const gestionSelect = document.getElementById("gestion");
    const downloadBtn = document.getElementById("downloadBtn");

    if (downloadBtn) {
        downloadBtn.addEventListener("click", function () {
            window.location.href = "http://localhost:3000/export/download";
        });
    }

    // Función para actualizar el progreso (barra de avance)
    function updateProgress(currentStep) {
        steps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
        const progressWidth = (currentStep / (steps.length - 1)) * 100;
        line.style.width = `${progressWidth}%`;
    }

    // Inicializar con el primer paso activo (por ejemplo, en Ficha Diagnóstico)
    updateProgress(1);

    // Función para actualizar el label del paso 2 (índice 2) con la opción seleccionada en "gestion"
    function updateGestionStepLabel() {
        if (gestionSelect) {
            const selectedText = gestionSelect.options[gestionSelect.selectedIndex].text;
            // Se asume que el paso dinámico es el tercero (índice 2)
            const dynamicStepLabel = steps[2].querySelector('.label');
            if (dynamicStepLabel) {
                dynamicStepLabel.textContent = selectedText;
            }
        }
    }
    // Actualizar el label al cargar y cada vez que se cambie el select
    updateGestionStepLabel();
    if (gestionSelect) {
        gestionSelect.addEventListener("change", updateGestionStepLabel);
    }

    // Agregar un único event listener para la redirección de cada paso
    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            updateProgress(index);
            if (index === 0) {
                window.location.href = '/public/screens/fichaTecnica.html';
            } else if (index === 1) {
                window.location.href = '/public/screens/fichaDiagnostico.html';
            } else if (index === 2) {
                // Paso 2: redirección dinámica según el select "gestion"
                if (gestionSelect) {
                    window.location.href = gestionSelect.value;
                } else {
                    window.location.href = '/public/screens/gestionOrganizacional.html';
                }
            } else if (index === 3) {
                window.location.href = '/public/screens/gestionProductiva.html';
            } else if (index === 4) {
                window.location.href = '/public/screens/gestionComercial.html';
            } else if (index === 5) {
                window.location.href = '/public/screens/gestionFinanciera.html';
            }
        });
    });

    // Event listener para el envío del formulario
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevenir el envío del formulario inicialmente
        let valid = true;
        const mensajesErrores = [];

        // Validar campos de texto requeridos
        const requiredTextFields = [
            "nombre_comercial",
            "razon_social",
            "sede",
            "productos_servicios",
            "direccion",
            "ciudad",
            "canton",
            "parroquia",
            "contacto1",
            "contacto2",
            "referencia",
            "tecnico"
        ];
        requiredTextFields.forEach((id) => {
            const field = document.getElementById(id);
            if (!field || field.value.trim() === "") {
                mensajesErrores.push(`El campo '${id}' es obligatorio.`);
                valid = false;
            }
        });

        // Validar números de teléfono (10 dígitos)
        const telefono1 = document.getElementById("telefono1").value.trim();
        const telefono2 = document.getElementById("telefono2").value.trim();
        if (!/^\d{10}$/.test(telefono1)) {
            mensajesErrores.push("El 'Teléfono 1' debe contener exactamente 10 dígitos.");
            valid = false;
        }
        if (!/^\d{10}$/.test(telefono2)) {
            mensajesErrores.push("El 'Teléfono 2' debe contener exactamente 10 dígitos.");
            valid = false;
        }

        // Validar correo electrónico
        const email = document.getElementById("email").value.trim();
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            mensajesErrores.push("El campo 'Email' debe contener una dirección de correo válida.");
            valid = false;
        }

        // Validar números requeridos (socios, empleados, antigüedad)
        const requiredNumberFields = [
            { id: "num_socios", label: "Número de socios" },
            { id: "num_empleados", label: "Número de empleados" },
            { id: "antiguedad", label: "Antigüedad de la empresa" }
        ];
        requiredNumberFields.forEach((field) => {
            const value = document.getElementById(field.id).value.trim();
            if (value === "" || isNaN(value) || value <= 0) {
                mensajesErrores.push(`El campo '${field.label}' debe ser un número mayor a 0.`);
                valid = false;
            }
        });

        // Validar fecha de evaluación
        const fechaEvaluacion = document.getElementById("fecha_evaluacion").value.trim();
        if (fechaEvaluacion === "") {
            mensajesErrores.push("El campo 'Fecha de la evaluación' es obligatorio.");
            valid = false;
        }

        // Mostrar errores o redirigir
        if (!valid) {
            alert(`Errores encontrados:\n\n${mensajesErrores.join("\n")}`);
        } else {
            alert("Formulario guardado con éxito.");
            setTimeout(() => {
                // Redirección usando el select "gestion"
                const gestionSelect = document.getElementById("gestion");
                const selectedPage = gestionSelect.value;
                window.location.href = `../screens/${selectedPage}`;
            }, 1000);
        }
    });
});

// Resto del código para cargar, crear, editar y eliminar emprendimientos
const apiUrl = "http://localhost:3000/emprendimientos";  // URL de la API

document.addEventListener("DOMContentLoaded", () => {
    cargarEmprendimientos(); // Cargar la lista de emprendimientos
    document.getElementById("formNuevoEmprendimiento").addEventListener("submit", crearEmprendimiento);
});

async function cargarEmprendimientos() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const tableBody = document.getElementById("tablaEmprendimientos").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = "";
        data.forEach((emp) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${emp.idEmprendimiento}</td>
                <td>${emp.nombreComercial}</td>
                <td>${emp.ciudad}</td>
                <td>
                    <button onclick="editarEmprendimiento(${emp.idEmprendimiento})">✏️</button>
                    <button onclick="eliminarEmprendimiento(${emp.idEmprendimiento})">🗑️</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error al cargar emprendimientos:", error);
    }
}

function mostrarFormularioEmprendimiento() {
    document.getElementById("formularioEmprendimiento").style.display = "block";
}

function cerrarFormularioEmprendimiento() {
    document.getElementById("formularioEmprendimiento").style.display = "none";
}

async function crearEmprendimiento(event) {
    event.preventDefault();
    const nombreComercial = document.getElementById("nombreComercial").value;
    const ciudad = document.getElementById("ciudad").value;
    const nuevoEmp = { nombreComercial, ciudad };
    try {
        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoEmp)
        });
        cargarEmprendimientos();
        cerrarFormularioEmprendimiento();
    } catch (error) {
        console.error("Error al crear emprendimiento:", error);
    }
}

async function eliminarEmprendimiento(id) {
    if (!confirm("¿Seguro que quieres eliminar este emprendimiento?")) return;
    try {
        await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        cargarEmprendimientos();
    } catch (error) {
        console.error("Error al eliminar emprendimiento:", error);
    }
}

async function editarEmprendimiento(id) {
    const nuevoNombre = prompt("Nuevo nombre comercial:");
    if (!nuevoNombre) return;
    try {
        await fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombreComercial: nuevoNombre })
        });
        cargarEmprendimientos();
    } catch (error) {
        console.error("Error al editar emprendimiento:", error);
    }
}
