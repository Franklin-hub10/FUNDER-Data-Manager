const API_BASE_URL = 'http://localhost:3000';
const API_ROLES = "http://localhost:3000/emprendimientos"; 



document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formulario"); // Ahora selecciona por ID
    const steps = document.querySelectorAll('.progress-steps .step');
    const line = document.querySelector('.progress-steps .line');

    // Función para actualizar el progreso
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

    // Inicializar con el primer paso activo
    updateProgress(1);

    // Redirigir al hacer clic en un círculo
    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            updateProgress(index);
            switch (index) {
                case 0:
                    window.location.href = 'fichaTecnica.html';
                    break;
                case 1:
                    window.location.href = 'fichaDiagnostico.html';
                    break;
                case 2:
                    window.location.href = 'gestionOrganizacional.html';
                    break;
                case 3:
                    window.location.href = 'gestionProductiva.html';
                    break;
                case 4:
                    window.location.href = 'gestionComercial.html';
                    break;
                case 5:
                    window.location.href = 'gestionFinanciera.html';
                    break;
                default:
                    break;
            }
        });
    });

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
            const gestionSelect = document.getElementById("gestion");
            const selectedPage = gestionSelect.value; // Obtiene la página seleccionada
            window.location.href = `../screens/${selectedPage}`; // Redirige a la página elegida
        }, 1000);
    }
    });
});

const apiUrl = "http://localhost:3000/emprendimientos";  // URL de la API

document.addEventListener("DOMContentLoaded", () => {
    cargarEmprendimientos(); // Cargar la lista de emprendimientos
    document.getElementById("formNuevoEmprendimiento").addEventListener("submit", crearEmprendimiento);  // Manejar la creación
});

// Cargar los emprendimientos desde la API y mostrarlos en la tabla
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

// Mostrar el formulario para agregar un nuevo emprendimiento
function mostrarFormularioEmprendimiento() {
    document.getElementById("formularioEmprendimiento").style.display = "block";
}

// Cerrar el formulario sin guardar
function cerrarFormularioEmprendimiento() {
    document.getElementById("formularioEmprendimiento").style.display = "none";
}

// Crear un nuevo emprendimiento a través de la API
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
        cargarEmprendimientos();  // Recargar los emprendimientos
        cerrarFormularioEmprendimiento();  // Cerrar el formulario
    } catch (error) {
        console.error("Error al crear emprendimiento:", error);
    }
}

// Eliminar un emprendimiento por ID
async function eliminarEmprendimiento(id) {
    if (!confirm("¿Seguro que quieres eliminar este emprendimiento?")) return;
    
    try {
        await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        cargarEmprendimientos();  // Recargar los emprendimientos
    } catch (error) {
        console.error("Error al eliminar emprendimiento:", error);
    }
}

// Editar un emprendimiento por ID
async function editarEmprendimiento(id) {
    const nuevoNombre = prompt("Nuevo nombre comercial:");
    if (!nuevoNombre) return;

    try {
        await fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombreComercial: nuevoNombre })
        });
        cargarEmprendimientos();  // Recargar los emprendimientos
    } catch (error) {
        console.error("Error al editar emprendimiento:", error);
    }
}

