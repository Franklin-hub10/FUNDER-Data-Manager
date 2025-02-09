const API_BASE_URL = 'http://localhost:3000';
const API_ROLES = "http://localhost:3000/emprendimientos"; 



document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formulario");
    const steps = document.querySelectorAll('.progress-steps .step');
    const line = document.querySelector('.progress-steps .line');

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
        line.style.width = `${(currentStep / (steps.length - 1)) * 100}%`;
    }

    updateProgress(1);

    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            updateProgress(index);
            const pages = [
                'fichaTecnica.html',
                'fichaDiagnostico.html',
                'gestionOrganizacional.html',
                'gestionProductiva.html',
                'gestionComercial.html',
                'gestionFinanciera.html'
            ];
            if (pages[index]) window.location.href = pages[index];
        });
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        let valid = true;
        const mensajesErrores = [];

        const requiredFields = [
            "nombreComercial", "razonSocial", "idSede", "idProdServ", "direccionNegocio", 
            "ciudad", "canton", "idParroquia", "nombreContacto1", "nombreContacto2", 
            "referencia", "nombreEvaluador"
        ];

        requiredFields.forEach(id => {
            const field = document.getElementById(id);
            if (!field || field.value.trim() === "") {
                mensajesErrores.push(`El campo '${id}' es obligatorio.`);
                valid = false;
            }
        });

        const telefono1 = document.getElementById("telefono1").value.trim();
        const telefono2 = document.getElementById("telefono2").value.trim();
        if (!/^[0-9]{10}$/.test(telefono1)) mensajesErrores.push("El 'Teléfono 1' debe tener 10 dígitos.");
        if (!/^[0-9]{10}$/.test(telefono2)) mensajesErrores.push("El 'Teléfono 2' debe tener 10 dígitos.");
        
        const email = document.getElementById("correo").value.trim();
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) mensajesErrores.push("Correo electrónico inválido.");

        const numericFields = [
            { id: "numSocios", label: "Número de socios" },
            { id: "numEmpleados", label: "Número de empleados" },
            { id: "antiguedad", label: "Antigüedad" }
        ];
        numericFields.forEach(field => {
            const value = document.getElementById(field.id).value.trim();
            if (isNaN(value) || value <= 0) mensajesErrores.push(`${field.label} debe ser mayor a 0.`);
        });

        const fechaEvaluacion = document.getElementById("fechaEvaluacion").value.trim();
        if (!fechaEvaluacion) mensajesErrores.push("Fecha de evaluación es obligatoria.");

        if (mensajesErrores.length > 0) {
            alert(`Errores:\n\n${mensajesErrores.join("\n")}`);
        } else {
            alert("Formulario guardado con éxito.");
            setTimeout(() => window.location.href = '../screens/gestionOrganizacional.html', 1000);
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

