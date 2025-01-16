const apiUrl = 'http://localhost:3000/api';

document.getElementById('roleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const roleName = document.getElementById('roleName').value;

    await fetch(`${apiUrl}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: roleName })
    });

    document.getElementById('roleName').value = '';
    fetchRoles();
});

async function fetchRoles() {
    const response = await fetch(`${apiUrl}/roles`);
    const roles = await response.json();
    const tbody = document.querySelector('#rolesTable tbody');
    tbody.innerHTML = '';

    roles.forEach(role => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${role.idRol}</td>
            <td>${role.nombre}</td>
            <td>${role.permisos || 'Sin permisos'}</td>
        `;
        tbody.appendChild(row);
    });
}

fetchRoles();
