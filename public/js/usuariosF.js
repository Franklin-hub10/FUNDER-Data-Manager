const API_URL = 'http://localhost:3000/roles';

// Cuando el documento está listo
document.addEventListener('DOMContentLoaded', () => {
    console.log("Documento cargado. Iniciando la función para cargar roles...");
    loadRoles();
    loadSedes();
});

export async function loadRoles() {
    const selectId = 'miSelect'; // ID del <select> en el HTML
    console.log(`Intentando cargar roles desde la API: ${API_URL}`);

    try {
        // Realizar la solicitud a la API
        const response = await fetch(`${API_URL}/roles`);

        console.log(`Respuesta recibida: ${response.status} ${response.statusText}`);
        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            console.error(`Error en la solicitud: ${response.status}`);
            throw new Error(`Error al obtener roles: ${response.statusText}`);
        }

        const roles = await response.json();
        console.log("Datos obtenidos de la API:", roles);

        // Validar que roles sea un arreglo
        if (!Array.isArray(roles)) {
            console.error("La respuesta no es un arreglo válido:", roles);
            throw new Error("Formato incorrecto en la respuesta de la API.");
        }

        // Seleccionar el elemento <select>
        const selectElement = document.getElementById(selectId);

        if (!selectElement) {
            console.error(`No se encontró el elemento <select> con ID "${selectId}" en el DOM.`);
            throw new Error(`Elemento <select> no encontrado.`);
        }

        console.log("Limpiando opciones actuales en el <select>.");
        // Limpiar las opciones actuales
        selectElement.innerHTML = '<option value="">Seleccione un rol</option>';

        // Agregar cada rol como opción
        roles.forEach((role, index) => {
            console.log(`Agregando rol [${index}]: ID=${role.idRol}, Nombre=${role.rol}`);
            const option = document.createElement("option");
            option.value = role.idRol; // Usar el ID del rol
            option.textContent = role.rol; // Usar el nombre del rol
            selectElement.appendChild(option);
        });

        console.log("Roles cargados exitosamente en el <select>.");

    } catch (error) {
        console.error("Error al cargar roles:", error.message);
        alert(`No se pudieron cargar los roles. Detalles: ${error.message}`);
    }
}

async function createColaborador(data) {
    try {
        const response = await fetch('http://localhost:3000/create-colaborador', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Colaborador creado exitosamente:', result);
        } else {
            console.error('Error al crear colaborador:', result.message);
        }
    } catch (error) {
        console.error('Error al enviar solicitud:', error);
    }
}

// Cargar sedes
export async function loadSedes() {
    const selectId = 'create-idSede'; // ID del <select> en el HTML
    console.log(`Intentando cargar sedes desde la API: ${API_URL}/sedes`);

    try {
        // Realizar la solicitud a la API
        const response = await fetch(`${API_URL}/sedes`);

        console.log(`Respuesta recibida: ${response.status} ${response.statusText}`);
        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            console.error(`Error en la solicitud: ${response.status}`);
            throw new Error(`Error al obtener sedes: ${response.statusText}`);
        }

        const sedes = await response.json();
        console.log("Datos obtenidos de la API:", sedes);

        // Validar que sedes sea un arreglo
        if (!Array.isArray(sedes)) {
            console.error("La respuesta no es un arreglo válido:", sedes);
            throw new Error("Formato incorrecto en la respuesta de la API.");
        }

        // Seleccionar el elemento <select>
        const selectElement = document.getElementById(selectId);

        if (!selectElement) {
            console.error(`No se encontró el elemento <select> con ID "${selectId}" en el DOM.`);
            throw new Error(`Elemento <select> no encontrado.`);
        }

        console.log("Limpiando opciones actuales en el <select>.");
        // Limpiar las opciones actuales
        selectElement.innerHTML = '<option value="">Seleccione una sede</option>';

        // Agregar cada sede como opción
        sedes.forEach((sede, index) => {
            console.log(`Agregando sede [${index}]: ID=${sede.idSede}, Nombre=${sede.sede}`);
            const option = document.createElement("option");
            option.value = sede.idSede; // Usar el ID de la sede
            option.textContent = sede.sede; // Usar el nombre de la sede
            selectElement.appendChild(option);
        });

        console.log("Sedes cargadas exitosamente en el <select>.");

    } catch (error) {
        console.error("Error al cargar sedes:", error.message);
        alert(`No se pudieron cargar las sedes. Detalles: ${error.message}`);
    }
}


// Crear colaborador
document.getElementById('create-user-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombres = document.getElementById('create-nombres').value;
    const apellidos = document.getElementById('create-apellidos').value;
    const cedula = document.getElementById('create-cedula').value;
    const fechaNacimiento = document.getElementById('create-fechaNacimiento').value;
    const cargo = document.getElementById('create-cargo').value;
    const idRol = document.getElementById('miSelect').value;
    const idSede = document.getElementById('create-idSede').value;

    if (!idRol || !idSede) {
        alert('Por favor, seleccione un rol y una sede.');
        return;
    }

    const data = {
        nombres,
        apellidos,
        cedula,
        fechaNacimiento,
        cargo,
        idRol,
        idSede
    };

    try {
        const response = await fetch(`${API_URL}/create-colaborador`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Colaborador creado con éxito');
            console.log(result);
        } else {
            alert('Error al crear colaborador');
            console.error(result);
        }
    } catch (error) {
        console.error('Error al enviar solicitud:', error);
        alert('Hubo un problema al crear el colaborador.');
    }
});
