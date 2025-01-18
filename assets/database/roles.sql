-- Crear rol de administrador con acceso total
CREATE ROLE IF NOT EXISTS 'admin_role';

-- Asignar todos los permisos al rol de administrador
GRANT ALL PRIVILEGES ON *.* TO 'admin_role' WITH GRANT OPTION;

-- Crear un usuario predeterminado y asignarle el rol de administrador
CREATE USER IF NOT EXISTS 'admin_user'@'localhost' IDENTIFIED BY 'admin_password';
GRANT 'admin_role' TO 'admin_user'@'localhost';

-- Aplicar el rol de administrador automáticamente al inicio de sesión
SET DEFAULT ROLE 'admin_role' FOR 'admin_user'@'localhost';

-- Verificar que el rol y los permisos fueron aplicados correctamente
SHOW GRANTS FOR 'admin_user'@'localhost';
