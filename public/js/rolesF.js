const API_URL = 'http://localhost:3000/roles';

// Cuando el documento está listo
document.addEventListener('DOMContentLoaded', () => {
    loadPermissions();
    loadRoles();
    setupPermissionSelection();
});

// Configurar la selección de permisos
function setupPermissionSelection() {
    const permissionsContainer = document.getElementById('permissionsCheckboxes');
    permissionsContainer.addEventListener('change', (event) => {
        if (event.target.classList.contains('form-check-input')) {
            const permissionItem = event.target.closest('.form-check');
            if (event.target.checked) {
                permissionItem.classList.add('selected');
            } else {
                permissionItem.classList.remove('selected');
            }
        }
    });
}

// Cargar permisos disponibles
async function loadPermissions() {
    try {
        const response = await fetch(`${API_URL}/permissions`);
        const permissions = await response.json();
        const container = document.getElementById('permissionsCheckboxes');
        container.innerHTML = ''; // Limpia cualquier contenido previo

        permissions.forEach(permission => {
            const checkbox = `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="permission-${permission.idPermiso}" value="${permission.idPermiso}" style="display: none;">
                    <label class="form-check-label" for="permission-${permission.idPermiso}" class="permission-label">
                        ${permission.nombre}
                    </label>
                </div>`;
            container.innerHTML += checkbox;
        });
    } catch (error) {
        console.error('Error al cargar permisos:', error);
    }
}

async function loadRoles() {
    try {
        const response = await fetch(`${API_URL}/roles`);
        const roles = await response.json();

        const table = document.getElementById('rolesTable');
        table.innerHTML = ''; // Limpia la tabla antes de renderizar

        roles.forEach(role => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', role.idRol);

            // Celda de nombre del rol
            const nameCell = document.createElement('td');
            nameCell.textContent = role.rol;

            // Ícono de lápiz para editar el nombre del rol
            const editNameIcon = document.createElement('i');
            editNameIcon.classList.add('bi', 'bi-pencil', 'edit-icon');
            editNameIcon.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = role.rol;
                input.addEventListener('blur', async () => {
                    await updateRoleName(role.idRol, input.value);
                    loadRoles();
                });
                nameCell.innerHTML = '';
                nameCell.appendChild(input);
                input.focus();
            });
            nameCell.appendChild(editNameIcon); // Añadir el ícono de lápiz a la celda de nombre
            row.appendChild(nameCell);

            // Celda de permisos
            const permissionsCell = document.createElement('td');
            permissionsCell.textContent = role.permisos || 'Sin permisos';

            // Ícono de lápiz para editar los permisos
            const editPermissionsIcon = document.createElement('i');
            editPermissionsIcon.classList.add('bi', 'bi-pencil', 'edit-icon');
            editPermissionsIcon.addEventListener('click', () => {
                openPermissionsModal(role.idRol, role.permisos);
            });
            permissionsCell.appendChild(editPermissionsIcon); // Añadir el ícono de lápiz a la celda de permisos
            row.appendChild(permissionsCell);

            // Celda de acciones (solo el botón de eliminar)
            const actionsCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
            deleteButton.addEventListener('click', () => deleteRole(role.idRol));
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);

            table.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar roles:', error);
    }
}

// Actualizar el nombre del rol
async function updateRoleName(idRol, newName) {
    try {
        const response = await fetch(`${API_URL}/update-role/${idRol}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rol: newName }),
        });
        if (!response.ok) throw new Error('Error al actualizar el nombre del rol');
        alert('Nombre del rol actualizado');
    } catch (error) {
        console.error('Error al actualizar el nombre del rol:', error);
    }
}

// Abrir el modal para editar permisos
async function openPermissionsModal(idRol, currentPermissions) {
    const modal = new bootstrap.Modal(document.getElementById('permissionsModal'));
    const modalBody = document.getElementById('permissionsModalBody');
    const saveButton = document.getElementById('savePermissionsButton');

    // Cargar todos los permisos
    const response = await fetch(`${API_URL}/permissions`);
    const allPermissions = await response.json();

    // Renderizar checkboxes en el modal
    modalBody.innerHTML = '';
    allPermissions.forEach(permission => {
        const isChecked = currentPermissions && currentPermissions.split(',').includes(permission.nombre);
        const checkbox = `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="modal-permission-${permission.idPermiso}" value="${permission.idPermiso}" ${isChecked ? 'checked' : ''}>
                <label class="form-check-label" for="modal-permission-${permission.idPermiso}">${permission.nombre}</label>
            </div>`;
        modalBody.innerHTML += checkbox;
    });

    // Guardar cambios al hacer clic en el botón "Guardar"
    saveButton.onclick = async () => {
        const selectedPermissions = Array.from(
            modalBody.querySelectorAll('input:checked')
        ).map(checkbox => parseInt(checkbox.value));

        await updatePermissions(idRol, selectedPermissions);
        modal.hide();
        loadRoles();
    };

    modal.show(); // Mostrar modal
}

// Actualizar los permisos de un rol
async function updatePermissions(idRol, permissions) {
    try {
        const response = await fetch(`${API_URL}/assign-permissions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idRol, permisos: permissions }),
        });
        if (!response.ok) throw new Error('Error al actualizar los permisos');
        alert('Permisos actualizados correctamente');
    } catch (error) {
        console.error('Error al actualizar los permisos:', error);
    }
}

// Eliminar un rol
async function deleteRole(idRol) {
    console.log("ID del rol a eliminar:", idRol);
    if (!confirm('¿Estás seguro de eliminar este rol?')) return;

    try {
        const response = await fetch(`${API_URL}/delete-role/${idRol}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar el rol');
        alert('Rol eliminado correctamente');
        loadRoles();
    } catch (error) {
        console.error('Error al eliminar el rol:', error);
    }
}

document.getElementById("createRoleForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Recoger el nombre del rol y los permisos seleccionados
    const roleName = document.getElementById("roleName").value.trim();
    const selectedPermissions = Array.from(
        document.querySelectorAll("#permissionsCheckboxes .form-check-input:checked")
    ).map(checkbox => parseInt(checkbox.value)); // Convertir valores a números

    console.log("Datos enviados al backend:", { nombre: roleName, permisos: selectedPermissions });

    try {
        // Enviar datos al backend para crear el rol
        const response = await fetch(`${API_URL}/create-role`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: roleName, permisos: selectedPermissions }),
        });

        if (!response.ok) throw new Error("Error al crear el rol");

        const data = await response.json();
        console.log("Respuesta del backend:", data);

        alert("Rol creado correctamente");
        document.getElementById("createRoleForm").reset(); // Limpiar el formulario

        // Desmarcar todas las casillas de verificación
        const checkboxes = document.querySelectorAll("#permissionsCheckboxes .form-check-input");
        checkboxes.forEach(checkbox => {
            checkbox.checked = false; // Desmarcar cada checkbox
            const permissionItem = checkbox.closest('.form-check');
            permissionItem.classList.remove('selected'); // Remover la clase 'selected' si está presente
        });

        loadRoles(); // Recargar los roles para mostrar el nuevo
    } catch (error) {
        console.error("Error al crear el rol:", error);
        alert("No se pudo crear el rol. Revisa la consola para más detalles.");
    }
});

// Agregar el código para el toggle de la barra lateral
const toggleSidebarButton = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');
const content = document.getElementById('content');

toggleSidebarButton.addEventListener('click', function () {
    sidebar.classList.toggle('collapsed');
    content.classList.toggle('expanded');
});