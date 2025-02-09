-- 📌 CREACIÓN DE LA BASE DE DATOS
CREATE DATABASE funder;
USE funder;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- 📌 TABLAS PRINCIPALES
CREATE TABLE rol (
    idRol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE permiso (
    idPermiso INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE rol_permiso (
    idRol INT NOT NULL,
    idPermiso INT NOT NULL,
    PRIMARY KEY (idRol, idPermiso),
    FOREIGN KEY (idRol) REFERENCES rol(idRol) ON DELETE CASCADE,
    FOREIGN KEY (idPermiso) REFERENCES permiso(idPermiso) ON DELETE CASCADE
);

CREATE TABLE vista (
    idVista INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL UNIQUE, 
    categoria VARCHAR(50) NOT NULL
);

CREATE TABLE vista_permiso (
    idVista INT NOT NULL,
    idPermiso INT NOT NULL,
    PRIMARY KEY (idVista, idPermiso),
    FOREIGN KEY (idVista) REFERENCES vista(idVista) ON DELETE CASCADE,
    FOREIGN KEY (idPermiso) REFERENCES permiso(idPermiso) ON DELETE CASCADE
);

CREATE TABLE rol_vista (
    idRol INT NOT NULL,
    idVista INT NOT NULL,
    acciones VARCHAR(255) NOT NULL,
    PRIMARY KEY (idRol, idVista),
    FOREIGN KEY (idRol) REFERENCES rol(idRol) ON DELETE CASCADE,
    FOREIGN KEY (idVista) REFERENCES vista(idVista) ON DELETE CASCADE
);

ALTER TABLE rol ADD COLUMN idVista INT NULL;


-- 📌 TABLAS DE USUARIOS
CREATE TABLE colaborador (
    idColaborador INT AUTO_INCREMENT PRIMARY KEY,
    idRol INT NOT NULL,
    nombres VARCHAR(200) NOT NULL,
    apellidos VARCHAR(200) NOT NULL,
    idSede INT NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    identificacion VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idRol) REFERENCES rol(idRol) ON UPDATE CASCADE,
    FOREIGN KEY (idSede) REFERENCES sede(idSede) ON UPDATE CASCADE
);
ALTER TABLE colaborador ADD COLUMN password_temp BOOLEAN DEFAULT TRUE;



-- 📌 TABLAS DE NEGOCIOS Y EMPRENDIMIENTOS
CREATE TABLE emprendedor (
    idEmprendedor INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(200) NOT NULL,
    apellidos VARCHAR(200) NOT NULL,
    idPais INT NOT NULL,
    edad INT NOT NULL,
    idSede INT NOT NULL,
    generoIdentidad VARCHAR(45) NOT NULL,
    estadoCivil VARCHAR(45) NOT NULL,
    numeroCargas INT NOT NULL,
    rolFamiliar VARCHAR(10) NOT NULL,
    etnia VARCHAR(45) NOT NULL,
    discapacidad VARCHAR(50) NOT NULL,
    estatusMigra VARCHAR(45),
    direccion VARCHAR(200) NOT NULL,
    telefono1 VARCHAR(20) NOT NULL,
    telefono2 VARCHAR(20) NOT NULL,
    correo VARCHAR(200) NOT NULL,
    servicioDeInternet BOOLEAN NOT NULL,
    celular BOOLEAN NOT NULL,
    computadora BOOLEAN NOT NULL,
    tablet BOOLEAN NOT NULL,
    nivelInstitucional VARCHAR(45) NOT NULL,
    idColaborador INT,
    tipoNegocio VARCHAR(200) NOT NULL,
    actividadEconomica VARCHAR(200) NOT NULL,
    promMensualIngreso DOUBLE NOT NULL,
    promMensualGastos DOUBLE NOT NULL,
    promMensualUtilidad DOUBLE NOT NULL,
    caracteristicaDelNegocio VARCHAR(1000) NOT NULL,
    camposAsistenciaTecnica VARCHAR(1000) NOT NULL,
    temaCapacitacion VARCHAR(1000) NOT NULL,
    FOREIGN KEY (idColaborador) REFERENCES colaborador(idColaborador) ON DELETE SET NULL
);

CREATE TABLE emprendimiento (
    idEmprendimiento INT AUTO_INCREMENT PRIMARY KEY,
    nombreComercial VARCHAR(100) NOT NULL,
    razonSocial VARCHAR(12) NOT NULL,
    idSede INT NOT NULL,
    idProdServ INT NOT NULL,
    direccionNegocio VARCHAR(200) NOT NULL,
    idParroquia INT NOT NULL,
    canton VARCHAR(200) NOT NULL,
    ciudad VARCHAR(200) NOT NULL,
    telefono1 VARCHAR(20) NOT NULL,
    telefono2 VARCHAR(20) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    numSocios INT NOT NULL,
    numEmpleados INT NOT NULL,
    antiguedad INT NOT NULL,
    nombreContacto1 VARCHAR(200) NOT NULL,
    telefonoContacto1 VARCHAR(20) NOT NULL,
    nombreContacto2 VARCHAR(200) NOT NULL,
    telefonoContacto2 VARCHAR(20) NOT NULL,
    referencia VARCHAR(200) NOT NULL,
    nombreEvaluador VARCHAR(200) NOT NULL,
    fechaEvaluacion DATE NOT NULL,
    idEmprendedor INT NOT NULL,
    idColaborador INT NOT NULL,
    FOREIGN KEY (idEmprendedor) REFERENCES emprendedor(idEmprendedor) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idColaborador) REFERENCES colaborador(idColaborador) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 📌 TABLAS DE SEGURIDAD
CREATE TABLE intentos_recuperacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restablecer_password (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    token VARCHAR(255) NOT NULL,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usado BOOLEAN DEFAULT FALSE
);

-- 📌 DATOS INICIALES
INSERT INTO permiso (nombre) VALUES
('Ver Página'),
('Crear Registro'),
('Editar Registro'),
('Eliminar Registro'),
('Descargar Información');

INSERT INTO vista (nombre, url, categoria) VALUES
('Inicio', 'index.html', 'Inicio'),
('Restablecer Contraseña', 'restablecerPassword.html', 'Inicio'),
('Home', 'home.html', 'Home'),
('Ficha Técnica', 'fichaTecnica.html', 'Gestión'),
('Gestión Comercial', 'gestionComercial.html', 'Gestión'),
('Gestión Financiera', 'gestionFinanciera.html', 'Gestión'),
('Gestión Organizacional', 'gestionOrganizacional.html', 'Gestión'),
('Gestión Productiva', 'gestionProductiva.html', 'Gestión'),
('Ficha Diagnóstico', 'fichaDiagnostico.html', 'Gestión'),
('Roles', 'roles.html', 'Manager'),
('Usuarios', 'Usuarios.html', 'Manager'),
('Dashboard', 'dashboard.html', 'Analítica');
