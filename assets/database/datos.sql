-- Tabla ESTADOCIVIL
INSERT INTO estadocivil VALUES 
(1, 'Casado'),
(2, 'Soltero'),
(3, 'Divorciado'),
(4, 'Viudo');

SELECT * FROM estadocivil;

-- Tabla GENERO
INSERT INTO genero VALUES 
(1, 'Masculino'),
(2, 'Femenino'),
(3, 'LGTBIQ+');

SELECT * FROM genero;

-- Tabla ESTATUSMIGRA
INSERT INTO estatusmigra VALUES 
(1, 'Refugiado'),
(2, 'Migrante'),
(3, 'Asilado'),
(4, 'Solicitante de Refugio');

SELECT * FROM estatusmigra;

-- Tabla NIVELINSTRUCCION
INSERT INTO nivelinstruccion VALUES 
(1, 'Primaria'),
(2, 'Bachiller'),
(3, 'Tecnológico'),
(4, 'Superior'),
(5, 'Ninguna');

SELECT * FROM nivelinstruccion;

-- Tabla ETNIA
INSERT INTO etnia VALUES 
(1, 'Blanco'),
(2, 'Mestizo'),
(3, 'Afrodescendiente'),
(4, 'Indígena');

SELECT * FROM etnia;




INSERT INTO permiso (nombre) VALUES
  ('Crear'),
  ('Leer'),
  ('Actualizar'),
  ('Eliminar');









INSERT INTO vista (nombre, url, categoria) VALUES 
('Página de Inicio', 'index.html', 'Inicio'),
('Recuperación de Contraseña', 'restablecerPassword.html', 'Inicio'),
('Cambio de Contraseña', 'cambiarPassword.html', 'Inicio'),
('Home', 'home.html', 'Home'),
('Ficha Técnica', 'fichaTecnica.html', 'Gestion'),
('Gestión Comercial', 'gestionComercial.html', 'Gestion'),
('Gestión Financiera', 'gestionFinanciera.html', 'Gestion'),
('Gestión Organizacional', 'gestionOrganizacional.html', 'Gestion'),
('Gestión Productiva', 'gestionProductiva.html', 'Gestion'),
('Ficha Diagnóstico', 'fichaDiagnostico.html', 'Gestion'),
('Roles', 'roles.html', 'Manager'),
('Usuarios', 'Usuarios.html', 'Manager'),
('Dashboard', 'dashboard.html', 'Analytica');


INSERT INTO vista_permiso (idVista, idPermiso) VALUES 
-- Acceso libre (Inicio)
((SELECT idVista FROM vista WHERE url = 'index.html'), (SELECT idPermiso FROM permiso WHERE nombre = 'acceso_publico')),
((SELECT idVista FROM vista WHERE url = 'restablecerPassword.html'), (SELECT idPermiso FROM permiso WHERE nombre = 'acceso_publico')),
((SELECT idVista FROM vista WHERE url = 'cambiarPassword.html'), (SELECT idPermiso FROM permiso WHERE nombre = 'acceso_publico')),

-- Home (Acceso total para desarrolladores)
((SELECT idVista FROM vista WHERE url = 'home.html'), (SELECT idPermiso FROM permiso WHERE nombre = 'ver_home')),

-- Gestión (CRUD completo para Desarrolladores)
((SELECT idVista FROM vista WHERE url = 'fichaTecnica.html'), (SELECT idPermiso FROM permiso WHERE nombre = 'gestion_completa')),
((SELECT idVista FROM vista WHERE url = 'gestionComercial.html'), (SELECT idPermiso FROM permiso WHERE nombre = 'gestion_completa')),
((SELECT idVista FROM vista WHERE url = 'gestionFinanciera.html'), (SELECT idPermiso FROM permiso WHERE nombre = 'gestion_completa')),
((SELECT idVista FROM vista WHERE url = 'gestionOrganizacional.html'), (SELECT idPermiso FROM permiso WHERE nombre = 'gestion_completa')),
((SELECT idVista FROM vista WHERE url = 'gestionProductiva.html'), (SELECT idPermiso FROM permiso WHERE nombre = 'gestion_completa')),
((SELECT idVista FROM vista WHERE url = 'fichaDiagnostico.html'), (SELECT idPermiso FROM permiso WHERE nombre = 'gestion_completa')),

-- Manager (Gestión de Usuarios y Roles)
((SELECT idVista FROM vista WHERE url = 'roles.html'), (SELECT idPermiso FROM permiso WHERE nombre = 'gestionar_roles')),
((SELECT idVista FROM vista WHERE url = 'Usuarios.html'), (SELECT idPermiso FROM permiso WHERE nombre = 'gestionar_usuarios')),

-- Analytica (Dashboard con permisos de visualización y descarga)
((SELECT idVista FROM vista WHERE url = 'dashboard.html'), (SELECT idPermiso FROM permiso WHERE nombre = 'ver_dashboard')),
((SELECT idVista FROM vista WHERE url = 'dashboard.html'), (SELECT idPermiso FROM permiso WHERE nombre = 'descargar_reportes'));


INSERT INTO rol_vista (idRol, idVista, acciones) VALUES 
((SELECT idRol FROM rol WHERE nombre = 'Desarrollador'), (SELECT idVista FROM vista WHERE url = 'home.html'), 'ver,editar,crear,eliminar'),
((SELECT idRol FROM rol WHERE nombre = 'Desarrollador'), (SELECT idVista FROM vista WHERE url = 'fichaTecnica.html'), 'ver,editar,crear,eliminar'),
((SELECT idRol FROM rol WHERE nombre = 'Desarrollador'), (SELECT idVista FROM vista WHERE url = 'gestionComercial.html'), 'ver,editar,crear,eliminar'),
((SELECT idRol FROM rol WHERE nombre = 'Desarrollador'), (SELECT idVista FROM vista WHERE url = 'gestionFinanciera.html'), 'ver,editar,crear,eliminar'),
((SELECT idRol FROM rol WHERE nombre = 'Desarrollador'), (SELECT idVista FROM vista WHERE url = 'gestionOrganizacional.html'), 'ver,editar,crear,eliminar'),
((SELECT idRol FROM rol WHERE nombre = 'Desarrollador'), (SELECT idVista FROM vista WHERE url = 'gestionProductiva.html'), 'ver,editar,crear,eliminar'),
((SELECT idRol FROM rol WHERE nombre = 'Desarrollador'), (SELECT idVista FROM vista WHERE url = 'fichaDiagnostico.html'), 'ver,editar,crear,eliminar'),
((SELECT idRol FROM rol WHERE nombre = 'Manager'), (SELECT idVista FROM vista WHERE url = 'roles.html'), 'ver,editar,crear,eliminar'),
((SELECT idRol FROM rol WHERE nombre = 'Manager'), (SELECT idVista FROM vista WHERE url = 'Usuarios.html'), 'ver,editar,crear,eliminar'),
((SELECT idRol FROM rol WHERE nombre = 'Analytica'), (SELECT idVista FROM vista WHERE url = 'dashboard.html'), 'ver,descargar');





