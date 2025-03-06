const API_BASE_URL = 'http://localhost:3000';
const API_ROLES = "http://localhost:3000/roles/roles";
const API_USUARIOS = `${API_BASE_URL}/usuarios`;
const API_SEDES = `${API_BASE_URL}/sedes`;
 
document.addEventListener('DOMContentLoaded', async () => {
    console.log("📌 Documento cargado. Iniciando carga de datos...");
    await loadRoles();
    await loadSedes();
    await loadColaboradores();
 
    document.getElementById("create-user-form").addEventListener("submit", createColaborador);
});
 
// 🔹 Cargar Roles
async function loadRoles() {
    try {
        const response = await fetch(API_ROLES);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`);
 
        const roles = await response.json();
        console.log("✅ Roles obtenidos:", roles);
       
        const selectElement = document.getElementById('idRol');
        if (!selectElement) throw new Error("Elemento select idRol no encontrado");
       
        selectElement.innerHTML = '<option value="">Seleccione un rol</option>';
        roles.forEach(role => {
            const option = document.createElement("option");
            option.value = role.idRol;
            option.textContent = role.rol;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error("❌ Error al cargar roles:", error);
    }
}
 
// 🔹 Cargar Sedes
async function loadSedes() {
    try {
        const response = await fetch(API_SEDES);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`);
 
        const sedes = await response.json();
        console.log("✅ Sedes obtenidas:", sedes);
 
        const selectElement = document.getElementById('idSede');
        if (!selectElement) throw new Error("Elemento select idSede no encontrado");
       
        selectElement.innerHTML = '<option value="">Seleccione una sede</option>';
        sedes.forEach(sede => {
            const option = document.createElement("option");
            option.value = sede.idSede;
            option.textContent = sede.nombre;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error("❌ Error al cargar sedes:", error);
    }
}
 
// 🔹 Cargar Colaboradores
async function loadColaboradores() {
    try {
        const response = await fetch(`${API_USUARIOS}/colaboradores`);
        if (!response.ok) throw new Error("Error al obtener colaboradores");
 
        const colaboradores = await response.json();
        console.log("🔹 Colaboradores obtenidos:", colaboradores);
 
        const tableBody = document.getElementById("colaboradores-table-body");
        if (!tableBody) throw new Error("Elemento 'colaboradores-table-body' no encontrado");
 
        tableBody.innerHTML = colaboradores.map(colaborador => `
            <tr id="row-${colaborador.idColaborador}">
                <td ondblclick="editCell(${colaborador.idColaborador}, 'nombres', '${colaborador.nombres}')">${colaborador.nombres} <i class="bi bi-pencil edit-icon" onclick="editCell(${colaborador.idColaborador}, 'nombres', '${colaborador.nombres}')"></i></td>
                <td ondblclick="editCell(${colaborador.idColaborador}, 'apellidos', '${colaborador.apellidos}')">${colaborador.apellidos} <i class="bi bi-pencil edit-icon" onclick="editCell(${colaborador.idColaborador}, 'apellidos', '${colaborador.apellidos}')"></i></td>
                <td>${colaborador.identificacion}</td>
                <td ondblclick="editCell(${colaborador.idColaborador}, 'email', '${colaborador.email}')">${colaborador.email} <i class="bi bi-pencil edit-icon" onclick="editCell(${colaborador.idColaborador}, 'email', '${colaborador.email}')"></i></td>
                <td ondblclick="editCell(${colaborador.idColaborador}, 'usuario', '${colaborador.usuario}')">${colaborador.usuario} <i class="bi bi-pencil edit-icon" onclick="editCell(${colaborador.idColaborador}, 'usuario', '${colaborador.usuario}')"></i></td>
                <td ondblclick="editCell(${colaborador.idColaborador}, 'cargo', '${colaborador.cargo}')">${colaborador.cargo} <i class="bi bi-pencil edit-icon" onclick="editCell(${colaborador.idColaborador}, 'cargo', '${colaborador.cargo}')"></i></td>
                <td ondblclick="editDropdown(${colaborador.idColaborador}, 'idRol', '${colaborador.idRol}', 'roles')">${colaborador.rol} <i class="bi bi-pencil edit-icon" onclick="editDropdown(${colaborador.idColaborador}, 'idRol', '${colaborador.idRol}', 'roles')"></i></td>
                <td ondblclick="editDropdown(${colaborador.idColaborador}, 'idSede', '${colaborador.idSede}', 'sedes')">${colaborador.sede} <i class="bi bi-pencil edit-icon" onclick="editDropdown(${colaborador.idColaborador}, 'idSede', '${colaborador.idSede}', 'sedes')"></i></td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteColaborador(${colaborador.idColaborador})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error("❌ Error al cargar colaboradores:", error);
    }
}
 
// 🔹 Crear Colaborador
async function createColaborador(event) {
    event.preventDefault();
 
    const data = {
        nombres: document.getElementById("nombres").value,
        apellidos: document.getElementById("apellidos").value,
        identificacion: document.getElementById("identificacion").value,
        email: document.getElementById("email").value,
        usuario: document.getElementById("usuario").value,
        idRol: document.getElementById("idRol").value,
        idSede: document.getElementById("idSede").value,
        cargo: document.getElementById("cargo").value,
        password: document.getElementById("password").value
    };
 
    console.log("🔍 Datos enviados al backend:", data);
 
    try {
        const response = await fetch(`${API_USUARIOS}/createColaborador`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
 
        const result = await response.json();
        console.log("✅ Respuesta del backend:", result);
 
        if (!response.ok) throw new Error(result.message || "Error desconocido");
 
        alert("✅ Colaborador creado exitosamente.");
        await loadColaboradores();
    } catch (error) {
        console.error("❌ Error al crear colaborador:", error);
        alert(`❌ ${error.message}`);
    }
}
 
// 🔹 Editar Colaborador
async function editColaborador(id) {
    console.log(`✏️ Editando colaborador con ID: ${id}`);
 
    try {
        const response = await fetch(`${API_USUARIOS}/colaborador/${id}`);
        if (!response.ok) throw new Error("Error al obtener datos del colaborador");
 
        const colaborador = await response.json();
        console.log("📝 Datos del colaborador a editar:", colaborador);
 
        document.getElementById("nombres").value = colaborador.nombres;
        document.getElementById("apellidos").value = colaborador.apellidos;
        document.getElementById("identificacion").value = colaborador.identificacion;
        document.getElementById("email").value = colaborador.email;
        document.getElementById("usuario").value = colaborador.usuario;
        document.getElementById("cargo").value = colaborador.cargo;
        document.getElementById("idRol").value = colaborador.idRol;
        document.getElementById("idSede").value = colaborador.idSede;
 
        document.getElementById("create-user-form").setAttribute("data-editing-id", id);
    } catch (error) {
        console.error("❌ Error al obtener datos del colaborador:", error);
        alert("Error al obtener datos del colaborador.");
    }
}
 
window.editColaborador = editColaborador;
 
 // Obtener el id del colaborador logueado desde el localStorage
document.addEventListener("DOMContentLoaded", () => {
    const idColaborador = localStorage.getItem("idColaborador");
   
    if (!idColaborador) {
        console.warn("⚠️ No se encontró idColaborador en localStorage. Asegúrate de estar logueado.");
        return;
    }
   
    console.log("✅ idColaborador del usuario logueado:", idColaborador);
   
    // Asignar el idColaborador a un campo oculto si existe en el formulario
    const idColaboradorField = document.getElementById("idColaborador");
    if (idColaboradorField) {
        idColaboradorField.value = idColaborador;
    }
  });