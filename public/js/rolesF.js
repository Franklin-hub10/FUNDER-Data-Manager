const API_URL = 'http://localhost:3000/roles';

document.addEventListener('DOMContentLoaded', () => {
  loadCategoriesCheckboxes();
  loadRoles();
});

// ─── CARGA DE CATEGORÍAS COMO BOTONES ─────────────────
async function loadCategoriesCheckboxes() {
  try {
    const response = await fetch(`${API_URL}/categories`);
    const categories = await response.json();
    const container = document.getElementById('categoriesContainer');
    container.classList.add('d-flex', 'flex-wrap', 'gap-2');
    container.innerHTML = '';
    categories.forEach(cat => {
      const div = document.createElement('div');
      div.classList.add('form-check');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = cat.categoria;
      checkbox.id = 'cat-' + cat.categoria;
      checkbox.classList.add('form-check-input');
      checkbox.addEventListener('change', handleCategoryCheckboxChange);
      const label = document.createElement('label');
      label.htmlFor = checkbox.id;
      label.classList.add('form-check-label', 'btn', 'btn-outline-primary');
      label.textContent = cat.categoria;
      div.appendChild(checkbox);
      div.appendChild(label);
      container.appendChild(div);
    });
  } catch (error) {
    console.error('Error al cargar categorías:', error);
  }
}

function handleCategoryCheckboxChange(e) {
  const label = e.target.nextElementSibling;
  if (e.target.checked) {
    label.classList.remove('btn-outline-primary');
    label.classList.add('btn-success');
    addCategoryBlock(e.target.value);
  } else {
    label.classList.remove('btn-success');
    label.classList.add('btn-outline-primary');
    removeCategoryBlock(e.target.value);
  }
}

// ─── BLOQUE DINÁMICO POR CADA CATEGORÍA ─────────────────
function addCategoryBlock(categoria) {
  console.log("Agregando bloque para la categoría:", categoria);
  const container = document.getElementById('selectedCategoriesContainer');
  if (document.getElementById('block-' + categoria)) return;
  
  const block = document.createElement('div');
  block.id = 'block-' + categoria;
  block.classList.add('card', 'mb-3', 'p-2');
  
  const header = document.createElement('h6');
  header.classList.add('card-title');
  header.textContent = categoria;
  block.appendChild(header);
  
  // Contenedor para vistas (botones)
  const vistasContainer = document.createElement('div');
  vistasContainer.id = 'vistasContainer-' + categoria;
  vistasContainer.classList.add('d-flex', 'flex-wrap', 'gap-2', 'mb-2');
  block.appendChild(vistasContainer);
  loadViewsCheckboxesForCategory(categoria, vistasContainer);
  
  // Contenedor para permisos de vistas seleccionadas
  const permsGlobal = document.createElement('div');
  permsGlobal.id = 'permissionsContainer-' + categoria;
  permsGlobal.classList.add('d-flex', 'flex-wrap', 'gap-2');
  block.appendChild(permsGlobal);
  
  container.appendChild(block);
}

function removeCategoryBlock(categoria) {
  const block = document.getElementById('block-' + categoria);
  if (block) block.remove();
}

// ─── CARGAR VISTAS COMO BOTONES ─────────────────
async function loadViewsCheckboxesForCategory(categoria, container) {
  try {
    const response = await fetch(`${API_URL}/views?categoria=${encodeURIComponent(categoria)}`);
    const views = await response.json();
    container.innerHTML = '';
    views.forEach(vista => {
      const div = document.createElement('div');
      div.classList.add('form-check', 'vista-item');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = vista.idVista;
      checkbox.id = `vista-${categoria}-${vista.idVista}`;
      checkbox.classList.add('form-check-input');
      const label = document.createElement('label');
      label.htmlFor = checkbox.id;
      label.classList.add('form-check-label', 'btn', 'btn-outline-secondary');
      label.textContent = vista.nombre;
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          label.classList.remove('btn-outline-secondary');
          label.classList.add('btn-success');
          addVistaPermissionsContainer(categoria, vista.idVista, vista.nombre);
        } else {
          label.classList.remove('btn-success');
          label.classList.add('btn-outline-secondary');
          removeVistaPermissionsContainer(categoria, vista.idVista);
        }
      });
      div.appendChild(checkbox);
      div.appendChild(label);
      container.appendChild(div);
    });
  } catch (error) {
    console.error('Error al cargar vistas para la categoría:', error);
  }
}

// ─── CARGAR PERMISOS PARA UNA VISTA ─────────────────
async function addVistaPermissionsContainer(categoria, idVista, vistaNombre) {
  const containerId = `perms-${categoria}-${idVista}`;
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.classList.add('d-flex', 'flex-wrap', 'gap-1', 'border', 'p-1');
    const title = document.createElement('small');
    title.textContent = vistaNombre;
    title.classList.add('fw-bold', 'me-2');
    container.appendChild(title);
    const permsGlobal = document.getElementById('permissionsContainer-' + categoria);
    permsGlobal.appendChild(container);
  }
  try {
    const response = await fetch(`${API_URL}/view-permissions/${idVista}`);
    const permissions = await response.json();
    container.innerHTML = `<small class="fw-bold me-2">${vistaNombre}</small>`;
    permissions.forEach(permission => {
      const div = document.createElement('div');
      div.classList.add('form-check');
      div.innerHTML = `
        <input class="form-check-input" type="checkbox" id="perm-${idVista}-${permission.idPermiso}" value="${permission.idPermiso}" checked>
        <label class="form-check-label" for="perm-${idVista}-${permission.idPermiso}">${permission.nombre}</label>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error('Error al cargar permisos para la vista:', error);
  }
}

function removeVistaPermissionsContainer(categoria, idVista) {
  const containerId = `perms-${categoria}-${idVista}`;
  const container = document.getElementById(containerId);
  if (container) container.remove();
}

// ─── MANEJO DE ROLES EXISTENTES ─────────────────
async function loadRoles() {
  try {
    const response = await fetch(`${API_URL}/roles`);
    const roles = await response.json();
    if (!Array.isArray(roles)) {
      console.error('La respuesta no es un arreglo:', roles);
      return;
    }
    const table = document.getElementById('rolesTable');
    table.innerHTML = '';
    roles.forEach(role => {
      const row = document.createElement('tr');
      row.setAttribute('data-id', role.idRol);
      
      // Nombre del rol con edición inline
      const nameCell = document.createElement('td');
      nameCell.textContent = role.rol;
      const editNameIcon = document.createElement('i');
      editNameIcon.classList.add('bi', 'bi-pencil', 'ms-2', 'edit-icon');
      editNameIcon.style.cursor = 'pointer';
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
      nameCell.appendChild(editNameIcon);
      row.appendChild(nameCell);
      
      // Vistas asignadas con edición de vistas
      const vistasCell = document.createElement('td');
      vistasCell.textContent = role.vistas || 'No asignadas';
      const editViewsIcon = document.createElement('i');
      editViewsIcon.classList.add('bi', 'bi-pencil', 'ms-2', 'edit-icon');
      editViewsIcon.style.cursor = 'pointer';
      editViewsIcon.addEventListener('click', () => {
        openViewsModal(role.idRol, role.vistasIds);
      });
      vistasCell.appendChild(editViewsIcon);
      row.appendChild(vistasCell);
      
      // Permisos asignados con edición modal
      const permsCell = document.createElement('td');
      permsCell.textContent = role.permisos || 'Sin permisos';
      const editPermsIcon = document.createElement('i');
      editPermsIcon.classList.add('bi', 'bi-pencil', 'ms-2', 'edit-icon');
      editPermsIcon.style.cursor = 'pointer';
      editPermsIcon.addEventListener('click', () => {
        openPermissionsModal(role.idRol, role.permisos);
      });
      permsCell.appendChild(editPermsIcon);
      row.appendChild(permsCell);
      
      // Acciones: Eliminar rol
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

async function openPermissionsModal(idRol, currentPermissions) {
  const modal = new bootstrap.Modal(document.getElementById('permissionsModal'));
  const modalBody = document.getElementById('permissionsModalBody');
  const saveButton = document.getElementById('savePermissionsButton');
  const response = await fetch(`${API_URL}/permissions`);
  const allPermissions = await response.json();
  modalBody.innerHTML = '';
  const selectedPermissions = currentPermissions ? currentPermissions.split(',').map(s => s.trim()) : [];
  allPermissions.forEach(permission => {
    const isChecked = selectedPermissions.includes(permission.nombre);
    const checkbox = `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="modal-permission-${permission.idPermiso}" value="${permission.idPermiso}" ${isChecked ? 'checked' : ''}>
        <label class="form-check-label" for="modal-permission-${permission.idPermiso}">${permission.nombre}</label>
      </div>`;
    modalBody.innerHTML += checkbox;
  });
  saveButton.onclick = async () => {
    const selected = Array.from(modalBody.querySelectorAll('input:checked')).map(cb => parseInt(cb.value));
    await updatePermissions(idRol, selected);
    modal.hide();
    loadRoles();
  };
  modal.show();
}

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

async function deleteRole(idRol) {
  if (!confirm('¿Estás seguro de eliminar este rol?')) return;
  try {
    const response = await fetch(`${API_URL}/delete-role/${idRol}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar el rol');
    alert('Rol eliminado correctamente');
    loadRoles();
  } catch (error) {
    console.error('Error al eliminar el rol:', error);
  }
}

// ─── MODAL PARA EDITAR VISTAS ─────────────────
async function openViewsModal(idRol, currentVistasIdsString) {
  const currentVistasIds = currentVistasIdsString
    ? currentVistasIdsString.split(',').map(s => parseInt(s.trim()))
    : [];
  const modal = new bootstrap.Modal(document.getElementById('viewsModal'));
  const modalBody = document.getElementById('viewsModalBody');
  modalBody.innerHTML = '';
  try {
    const catResponse = await fetch(`${API_URL}/categories`);
    const categories = await catResponse.json();
    for (const cat of categories) {
      const catDiv = document.createElement('div');
      catDiv.classList.add('mb-2');
      const catTitle = document.createElement('h6');
      catTitle.textContent = cat.categoria;
      catDiv.appendChild(catTitle);
      const viewsResponse = await fetch(`${API_URL}/views?categoria=${encodeURIComponent(cat.categoria)}`);
      const views = await viewsResponse.json();
      const viewsDiv = document.createElement('div');
      viewsDiv.classList.add('d-flex', 'flex-wrap', 'gap-2');
      views.forEach(vista => {
        const viewDiv = document.createElement('div');
        viewDiv.classList.add('form-check', 'vista-item');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = vista.idVista;
        checkbox.id = `edit-vista-${cat.categoria}-${vista.idVista}`;
        checkbox.classList.add('form-check-input');
        if (currentVistasIds.includes(vista.idVista)) {
          checkbox.checked = true;
        }
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.classList.add('form-check-label', 'btn', 'btn-outline-secondary');
        label.textContent = vista.nombre;
        checkbox.addEventListener('change', (e) => {
          if(e.target.checked) {
            label.classList.remove('btn-outline-secondary');
            label.classList.add('btn-success');
          } else {
            label.classList.remove('btn-success');
            label.classList.add('btn-outline-secondary');
          }
        });
        viewDiv.appendChild(checkbox);
        viewDiv.appendChild(label);
        viewsDiv.appendChild(viewDiv);
      });
      catDiv.appendChild(viewsDiv);
      modalBody.appendChild(catDiv);
    }
  } catch(err) {
    console.error("Error al cargar vistas para editar:", err);
  }
  const saveBtn = document.getElementById('saveViewsButton');
  saveBtn.onclick = async () => {
    const selectedCheckboxes = modalBody.querySelectorAll('input[type="checkbox"]:checked');
    const selectedViews = Array.from(selectedCheckboxes).map(cb => ({
      idVista: parseInt(cb.value),
      permisos: [] // Aquí podrías agregar lógica para permisos por defecto si lo deseas
    }));
    if(selectedViews.length === 0) {
      alert("Debes seleccionar al menos una vista.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/update-role/${idRol}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vistas: selectedViews })
      });
      if(!response.ok) throw new Error("Error al actualizar las vistas");
      alert("Vistas actualizadas correctamente");
      modal.hide();
      loadRoles();
    } catch(err) {
      console.error("Error al actualizar vistas:", err);
    }
  };
  modal.show();
}

// ─── ENVÍO DEL FORMULARIO PARA CREAR ROL CON LOGS ─────────────────
document.getElementById("createRoleForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const roleName = document.getElementById("roleName").value.trim();
  console.log("Nombre del rol:", roleName);
  if (!roleName) {
    alert("El nombre del rol es requerido.");
    return;
  }
  
  const blocks = document.querySelectorAll('.category-block');
  console.log("Cantidad de bloques de categoría:", blocks.length);
  const vistas = [];
  
  blocks.forEach(block => {
    const categoria = block.id.replace('block-', '');
    console.log("Procesando bloque para la categoría:", categoria);
    const vistaCheckboxes = block.querySelectorAll(`#vistasContainer-${categoria} input[type="checkbox"]`);
    console.log(`Cantidad de vistas en ${categoria}:`, vistaCheckboxes.length);
    vistaCheckboxes.forEach(cb => {
      if (cb.checked) {
        const idVista = parseInt(cb.value);
        console.log(`Vista marcada en ${categoria} -> idVista:`, idVista);
        const permsContainer = block.querySelector(`#perms-${categoria}-${idVista}`);
        let perms = [];
        if (permsContainer) {
          perms = Array.from(permsContainer.querySelectorAll('input[type="checkbox"]:checked'))
                  .map(cb => parseInt(cb.value));
          console.log(`Permisos seleccionados para vista ${idVista} en ${categoria}:`, perms);
        } else {
          console.warn(`No se encontró contenedor de permisos para vista ${idVista} en ${categoria}`);
        }
        vistas.push({ idVista, permisos });
      }
    });
  });
  
  console.log("Array de vistas recolectadas:", vistas);
  if (vistas.length === 0) {
    alert("Debes seleccionar al menos una vista y sus permisos.");
    return;
  }
  
  const data = { nombre: roleName, vistas: vistas };
  console.log("Datos a enviar:", data);
  
  try {
    const response = await fetch(`${API_URL}/create-role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    console.log("Respuesta del servidor:", response);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error del servidor:", errorData);
      throw new Error("Error al crear el rol");
    }
    const result = await response.json();
    console.log("Resultado de la creación:", result);
    alert(result.message);
    document.getElementById("createRoleForm").reset();
    document.getElementById('selectedCategoriesContainer').innerHTML = '';
    loadRoles();
  } catch (error) {
    console.error("Error al crear el rol:", error);
    alert("No se pudo crear el rol. Revisa la consola para más detalles.");
  }
});
