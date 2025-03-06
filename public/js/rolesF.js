const API_URL = 'http://localhost:3000/roles';
 
document.addEventListener('DOMContentLoaded', () => {
  loadCategoriesCheckboxes();
  loadRoles();
});
 
// ─── CARGA DE CATEGORÍAS COMO BOTONES ─────────────────
async function loadCategoriesCheckboxes() {
  try {
    console.log("Cargando categorías desde la API...");
    const response = await fetch(`${API_URL}/categories`);
    const categories = await response.json();
    console.log("Categorías cargadas:", categories);
 
    const container = document.getElementById('categoriesContainer');
    container.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'flex-wrap', 'gap-3');
    container.innerHTML = '';
 
    categories.forEach(cat => {
      console.log("Procesando categoría:", cat.categoria);
      const div = document.createElement('div');
      div.classList.add('text-center');
 
      const button = document.createElement('button');
      button.type = 'button';
      button.classList.add('btn', 'btn-outline-primary');
      button.textContent = cat.categoria;
 
      button.addEventListener('click', async () => {
        console.log(`Categoría "${cat.categoria}" clickeada.`);
        const isActive = button.classList.contains('btn-success');
        if (isActive) {
          console.log(`Desmarcando categoría "${cat.categoria}"...`);
          button.classList.remove('btn-success');
          button.classList.add('btn-outline-primary');
          removeCategoryBlock(cat.categoria);
        } else {
          console.log(`Marcando categoría "${cat.categoria}"...`);
          button.classList.remove('btn-outline-primary');
          button.classList.add('btn-success');
          addCategoryBlock(cat.categoria);
         
          // Cargar y mostrar las vistas de esta categoría
          const container = document.getElementById(`category-${cat.categoria}-views`);
          if (container) {
            console.log(`Cargando vistas para la categoría "${cat.categoria}"...`);
            await loadViewsCheckboxesForCategory(cat.categoria, container);
          }
        }
      });
 
      div.appendChild(button);
      container.appendChild(div);
    });
  } catch (error) {
    console.error('Error al cargar categorías:', error);
  }
}
 
// ─── BLOQUE DINÁMICO POR CADA CATEGORÍA ─────────────────
function addCategoryBlock(categoria) {
  console.log("Agregando bloque para la categoría:", categoria);
  const container = document.getElementById('selectedCategoriesContainer');
  console.log(`El bloque para la categoría "${categoria}" ya existe.`);
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
  vistasContainer.classList.add('d-flex', 'flex-wrap', 'justify-content-center', 'align-items-center', 'gap-3', 'mb-2');
  block.appendChild(vistasContainer);
  loadViewsCheckboxesForCategory(categoria, vistasContainer);
  console.log(`Contenedor de vistas creado para la categoría "${categoria}".`);
 
  // Contenedor para permisos de vistas seleccionadas
  const permsGlobal = document.createElement('div');
  permsGlobal.id = 'permissionsContainer-' + categoria;
  permsGlobal.classList.add('d-flex', 'flex-wrap', 'gap-2');
  block.appendChild(permsGlobal);
 
  container.appendChild(block);
  console.log(`Bloque para la categoría "${categoria}" agregado al DOM.`);
}
 
function removeCategoryBlock(categoria) {
  const block = document.getElementById('block-' + categoria);
  if (block) block.remove();
}
 
// ─── CARGAR VISTAS COMO BOTONES ─────────────────
async function loadViewsCheckboxesForCategory(categoria, container) {
  try {
    console.log(`Cargando vistas para la categoría "${categoria}"...`);
    const response = await fetch(`${API_URL}/views?categoria=${encodeURIComponent(categoria)}`);
    const views = await response.json();
    console.log(`Vistas cargadas para la categoría "${categoria}":`, views);
 
    container.innerHTML = '';
 
    views.forEach(vista => {
      console.log(`Procesando vista "${vista.nombre}"...`);
      const div = document.createElement('div');
      div.classList.add('vista-item');
 
     
      const button = document.createElement('button');
      button.type = 'button';
      button.classList.add('btn', 'btn-success');
      button.textContent = vista.nombre;
      button.dataset.idVista = vista.idVista;
 
     
      button.addEventListener('click', () => {
        const isActive = button.classList.contains('btn-success');
        if (isActive) {
          // Desmarcar
          button.classList.remove('btn-success');
          button.classList.add('btn-outline-primary');
          console.log(`Vista "${vista.nombre}" desmarcada.`);
        } else {
          // Marcar
          button.classList.remove('btn-outline-primary');
          button.classList.add('btn-success');
          console.log(`Vista "${vista.nombre}" marcada.`);
        }
      });
 
      div.appendChild(button);
      container.appendChild(div);
      console.log(`Vista "${vista.nombre}" agregada al contenedor.`);
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
 
// ___ LIMPIEZA DE CAMPOS_____
function resetCategoryButtons() {
  const buttons = document.querySelectorAll('#categoriesContainer .btn');
  buttons.forEach(button => {
    button.classList.remove('btn-success');
    button.classList.add('btn-outline-primary');
  });
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
 
 //----ACTUALIZAR ROL--------
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
      catDiv.classList.add('mb-2', 'text-center'); // Centrar el contenido
 
      const catTitle = document.createElement('h6');
      catTitle.textContent = cat.categoria;
      catDiv.appendChild(catTitle);
 
      const viewsResponse = await fetch(`${API_URL}/views?categoria=${encodeURIComponent(cat.categoria)}`);
      const views = await viewsResponse.json();
 
      const viewsDiv = document.createElement('div');
      viewsDiv.classList.add('d-flex', 'flex-wrap', 'gap-2', 'justify-content-center'); // Centrado
 
      views.forEach(vista => {
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('btn', 'vista-btn', 'btn-outline-secondary'); // Estilos por defecto
        button.textContent = vista.nombre;
        button.dataset.idVista = vista.idVista;
 
        if (currentVistasIds.includes(vista.idVista)) {
          button.classList.remove('btn-outline-secondary');
          button.classList.add('btn-success');
        }
 
        button.addEventListener('click', () => {
          button.classList.toggle('btn-success');
          button.classList.toggle('btn-outline-secondary');
        });
 
        viewsDiv.appendChild(button);
      });
 
      catDiv.appendChild(viewsDiv);
      modalBody.appendChild(catDiv);
    }
  } catch (err) {
    console.error("Error al cargar vistas para editar:", err);
  }
 
  const saveBtn = document.getElementById('saveViewsButton');
  saveBtn.onclick = async () => {
    const selectedButtons = modalBody.querySelectorAll('.vista-btn.btn-success');
    const selectedViews = Array.from(selectedButtons).map(btn => parseInt(btn.dataset.idVista));
 
    console.log("Vistas seleccionadas:", selectedViews);
 
 
    if (selectedViews.length === 0) {
      alert("Debes seleccionar al menos una vista.");
      return;
    }
 
    try {
      const response = await fetch(`${API_URL}/update-role/${idRol}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vistas: selectedViews })
      });
 
      if (!response.ok) throw new Error("Error al actualizar las vistas");
 
      alert("Vistas actualizadas correctamente");
      modal.hide();
      loadRoles();
    } catch (err) {
      console.error("Error al actualizar vistas:", err);
    }
  };
 
  modal.show();
}
 
 
 
// ─── ENVÍO DEL FORMULARIO PARA CREAR ROL CON LOGS ─────────────────
document.getElementById("createRoleForm").addEventListener("submit", async (e) => {
  e.preventDefault();
 
  console.log("Formulario de creación de rol enviado.");
 
  // Obtener y validar el nombre del rol
  const roleName = document.getElementById("roleName").value.trim();
  if (!roleName) {
    console.log("El nombre del rol es requerido.");
    alert("El nombre del rol es requerido.");
    return;
  }
  console.log("Nombre del rol:", roleName);
 
  //Recopilar las vistas seleccionadas
  const vistas = [];
  const categoryBlocks = document.querySelectorAll('[id^="block-"]');
  console.log(`Número de bloques de categoría encontrados: ${categoryBlocks.length}`);
 
  categoryBlocks.forEach(block => {
    const categoryId = block.id.replace('block-', '');
    console.log(`Procesando bloque para la categoría "${categoryId}"...`);
 
   
    const viewButtons = block.querySelectorAll(`#vistasContainer-${categoryId} .btn-success`);
    console.log(`Número de vistas seleccionadas en la categoría "${categoryId}": ${viewButtons.length}`);
 
    viewButtons.forEach(button => {
      const viewId = parseInt(button.dataset.idVista);
      console.log(`Vista seleccionada: "${button.textContent}" (ID: ${viewId}).`);
 
   
      vistas.push(viewId);
    });
  });
 
  //Validar que se haya seleccionado al menos una vista
  if (vistas.length === 0) {
    console.log("No se seleccionó ninguna vista.");
    alert("Debes seleccionar al menos una vista.");
    return;
  }
  console.log("Vistas seleccionadas:", vistas);
 
  //Preparar los datos para enviar a la API
  const data = {
    nombre: roleName,
    vistas: vistas
  };
  console.log("Datos a enviar a la API:", data);
 
  //Enviar los datos a la API
  try {
    // Verifica los datos que estás enviando a la API
    console.log("Datos que se van a enviar a la API:", data);
 
    // Enviar los datos a la API
    const response = await fetch(`${API_URL}/create-role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
 
    //Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error del servidor:", errorData);
      throw new Error(errorData.message || "Error al crear el rol");
    }
 
    //Procesar la respuesta del servidor
    const result = await response.json();
    console.log("Resultado de la creación:", result);
   
    // Mostrar mensaje de éxito
    alert(result.message || "Rol creado exitosamente.");
 
    //Limpiar el formulario y recargar la lista de roles
    console.log("Limpiando formulario y recargando roles...");
    document.getElementById("createRoleForm").reset();
    document.getElementById('selectedCategoriesContainer').innerHTML = '';
 
    resetCategoryButtons();
    loadRoles();
  } catch (error) {
   
    console.error("Error al crear el rol:", error);
    alert(error.message || "No se pudo crear el rol. Revisa la consola para más detalles.");
  }
})

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