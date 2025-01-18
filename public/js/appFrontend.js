// Obtener usuarios
async function getUsers() {
    const response = await fetch('http://localhost:3000/api/users');
    const users = await response.json();
    console.log(users);
}

// Crear usuario
async function createUser(user) {
    const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });
    const newUser = await response.json();
    console.log(newUser);
}

// Llamadas de ejemplo
getUsers();
createUser({ name: 'John Doe', email: 'john@example.com', password: '123456' });
