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


--TABLA SEDE
create table sede(
idSede int auto_increment not null primary key,
nombre varchar(30) not null
);


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
    pais VARCHAR(50) NOT NULL,
    edad INT NULL,
    idSede INT NOT NULL,
    lugar_nacimiento VARCHAR(200) NOT NULL,
    generoIdentidad VARCHAR(45) NOT NULL,
    estadoCivil VARCHAR(45) NOT NULL,
    numeroCargas INT NULL,
    rolFamiliar VARCHAR(10) NULL,
    etnia VARCHAR(45) NULL,
    discapacidad VARCHAR(50) NULL,
    estatusMigratorio VARCHAR(45) DEFAULT NULL,
    direccion VARCHAR(200) NOT NULL,
    telefono1 VARCHAR(20) NOT NULL,
    telefono2 VARCHAR(20) NULL,
    correo VARCHAR(200) NOT NULL,
    servicioDeInternet BOOLEAN NOT NULL,
    celular BOOLEAN NOT NULL,
    computadora BOOLEAN NOT NULL,
    tablet BOOLEAN NOT NULL,
    nivelInstitucional VARCHAR(45) NOT NULL,
    idColaborador INT DEFAULT NULL,
    tipoNegocio VARCHAR(200) NOT NULL,
    actividadEconomica VARCHAR(200) NOT NULL,
    caracteristicaDelNegocio VARCHAR(1000) NOT NULL,
    camposAsistenciaTecnica VARCHAR(1000) NOT NULL,
    temaCapacitacion VARCHAR(1000) NOT NULL,
    numeroIdentificacion VARCHAR(20) NOT NULL
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
    idColaborador INT NULL,
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







///////////////////////////////////////

--PROCESO DE CONVERSIÓN A CSV




-- Tabla para exportar los DATOS
CREATE TABLE export_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_formulario VARCHAR(50),
    idEntidad INT,
    nombres VARCHAR(100),
    apellidos VARCHAR(100),
    nombreSede VARCHAR(30), 
    email VARCHAR(100),
    pais VARCHAR(50),
    edad INT,
    generoIdentidad VARCHAR(50),
    estadoCivil VARCHAR(50),
    numeroCargas INT,
    rolFamiliar VARCHAR(50),
    etnia VARCHAR(50),
    discapacidad VARCHAR(50),
    estatusMigratorio VARCHAR(50),
    direccion VARCHAR(255),
    telefono1 VARCHAR(20),
    telefono2 VARCHAR(20),
    correo VARCHAR(100),
    servicioDeInternet BOOLEAN,
    celular BOOLEAN,
    computadora BOOLEAN,
    tablet BOOLEAN,
    nivelInstitucional VARCHAR(100),
    idColaborador INT,
    tipoNegocio VARCHAR(100),
    actividadEconomica VARCHAR(100),
    promMensualIngreso DECIMAL(10,2),
    promMensualGastos DECIMAL(10,2),
    promMensualUtilidad DECIMAL(10,2),
    caracteristicaDelNegocio TEXT,
    camposAsistenciaTecnica TEXT,
    temaCapacitacion TEXT,
    numeroIdentificacion VARCHAR(50),
    nombreComercial VARCHAR(150),
    razonSocial VARCHAR(150),
    idProdServ INT,
    direccionNegocio VARCHAR(255),
    idParroquia INT,
    canton VARCHAR(100),
    ciudad VARCHAR(100),
    numSocios INT,
    numEmpleados INT,
    antiguedad INT,
    nombreContacto1 VARCHAR(100),
    telefonoContacto1 VARCHAR(20),
    nombreContacto2 VARCHAR(100),
    telefonoContacto2 VARCHAR(20),
    referencia TEXT,
    nombreEvaluador VARCHAR(100),
    fechaEvaluacion DATE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---gestion comercial---

CREATE TABLE preguntas_gestion_Comercial (
    idPregunta_Comercial INT AUTO_INCREMENT PRIMARY KEY,
    pregunta VARCHAR(255) NOT NULL
);

-- Inserción de las preguntas existentes
INSERT INTO preguntas_gestion_Comercial (pregunta) VALUES
('¿Cuenta su negocio con una marca comercial?'),
('¿Dispone de aplicaciones gráficas y de promoción? (tarjetas y etiquetas)'),
('¿Promociona sus productos por redes sociales?'),
('¿Considera que los canales de comercialización que utiliza son los adecuados?'),
('¿Realiza servicio post venta?'),
('¿Existe inversión en publicidad?'),
('¿Sus productos tienen características innovadoras apreciadas por los compradores?'),
('¿Sus productos disponen de una adecuada presentación y protección?'),
('¿Qué temas de capacitación y asistencia técnica considera que se requieren en su negocio?'),




CREATE TABLE respuestas_gestion_Comercial (
    idRespuesta_Comercial INT AUTO_INCREMENT PRIMARY KEY,
    idEmprendimiento INT NOT NULL,
    idEmprendedor INT NOT NULL,
    idColaborador INT NOT NULL,
    idPregunta_Comercial INT NOT NULL, 
    diagnostico VARCHAR(255),
    intermedia VARCHAR(255),
    final VARCHAR(255),
    mejora VARCHAR(255),
    status VARCHAR(100),
    recursos VARCHAR(100),
    redesSociales VARCHAR(100),
    observaciones TEXT,
    tecnico_responsable VARCHAR(100) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- Claves Foráneas para establecer relaciones

    FOREIGN KEY (idEmprendimiento) REFERENCES emprendimiento(idEmprendimiento) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idEmprendedor) REFERENCES emprendedor(idEmprendedor) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idColaborador) REFERENCES colaborador(idColaborador) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idPregunta_Comercial) REFERENCES preguntas_gestion_Comercial(idPregunta_Comercial) ON DELETE CASCADE ON UPDATE CASCADE
);



---gestion Financiera--

CREATE TABLE preguntas_gestion_Financiera (
    idPregunta_Financiera INT AUTO_INCREMENT PRIMARY KEY,
    pregunta VARCHAR(255) NOT NULL
);

-- Inserción de las preguntas existentes
INSERT INTO preguntas_gestion_Financiera (pregunta) VALUES
('¿Existen registros contables de su negocio?'),
('¿Tiene RUC a su nombre o de su negocio?'),
('¿Realiza declaraciones al SRI (RISE)?'),
('¿Está al día en sus declaraciones con el SRI?'),
('¿Dispone de fuentes de financiamiento?'),
('¿Ha sido sujeto de crédito?'),
('¿Conoce el costo de sus productos o servicios?'),
('¿Conoce exactamente cuáles son sus ingresos por producto al mes?'),
('¿Conoce cuál es la utilidad por producto al mes?'),
('¿Cuál es la utilidad del producto que más vende al mes?'),
('¿Cuál es el ingreso total al mes?'),
('¿Cuál es la utilidad total al mes?'),
('¿De cuánto es el gasto total al mes?');



CREATE TABLE respuestas_gestion_Financiera (
    idRespuesta_Financiera INT AUTO_INCREMENT PRIMARY KEY,
    idEmprendimiento INT NOT NULL,
    idEmprendedor INT NOT NULL,
    idColaborador INT NOT NULL,
    idPregunta_Financiera INT NOT NULL, 
    diagnostico VARCHAR(255),
    intermedia VARCHAR(255),
    final VARCHAR(255),
    mejora VARCHAR(255),
    status VARCHAR(100),
    diagnostico_valor DECIMAL(10,2) NULL,
    intermedia_valor DECIMAL(10,2) NULL,
    final_valor DECIMAL(10,2) NULL,
    mejora_valor DECIMAL(10,2) NULL,
    status_valor DECIMAL(10,2) NULL,
    observaciones TEXT,
    tecnico_responsable VARCHAR(100) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- Claves Foráneas para establecer relaciones

    FOREIGN KEY (idEmprendimiento) REFERENCES emprendimiento(idEmprendimiento) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idEmprendedor) REFERENCES emprendedor(idEmprendedor) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idColaborador) REFERENCES colaborador(idColaborador) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idPregunta_Financiera) REFERENCES preguntas_gestion_Financiera(idPregunta_Financiera) ON DELETE CASCADE ON UPDATE CASCADE
);



----Gestion Organizacional-----

CREATE TABLE preguntas_gestion_organizacional (
    idPregunta_Organizacional INT AUTO_INCREMENT PRIMARY KEY,
    pregunta VARCHAR(255) NOT NULL
);

-- Inserción de las preguntas existentes
INSERT INTO preguntas_gestion_organizacional (pregunta) VALUES
('¿Cuenta con un local propio?'),
('¿Dispone de un plan de negocios?'),
('¿El negocio cuenta con personería jurídica?'),
('¿El negocio cuenta con una estructura de funcionamiento?'),
('¿El personal se encuentra afiliado al IESS?'),
('¿Ha capacitado a sus empleados en este último año?'),
('¿Su familia está asegurada al seguro social?'),
('¿Tiene socios en su negocio?'),
('¿Usted está afiliado al seguro social?');



CREATE TABLE respuestas_gestion_organizacional (
    idRespuesta_Organizacional INT AUTO_INCREMENT PRIMARY KEY,
    idEmprendimiento INT NOT NULL,
    idEmprendedor INT NOT NULL,
    idColaborador INT NOT NULL,
    idPregunta_Organizacional INT NOT NULL, 
    diagnostico VARCHAR(255),
    intermedia VARCHAR(255),
    final VARCHAR(255),
    mejora VARCHAR(255),
    status VARCHAR(100),
    observaciones TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- Claves Foráneas para establecer relaciones

    FOREIGN KEY (idEmprendimiento) REFERENCES emprendimiento(idEmprendimiento) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idEmprendedor) REFERENCES emprendedor(idEmprendedor) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idColaborador) REFERENCES colaborador(idColaborador) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idPregunta_Organizacional) REFERENCES preguntas_gestion_organizacional(idPregunta_Organizacional) ON DELETE CASCADE ON UPDATE CASCADE
);



---Gestion Productiva

CREATE TABLE preguntas_gestion_productiva (
    idPregunta_Productiva INT AUTO_INCREMENT PRIMARY KEY,
    pregunta VARCHAR(255) NOT NULL
);


INSERT INTO preguntas_gestion_productiva (pregunta) VALUES
('¿Conoce su cadena productiva / procesos?'),
('¿Dispone de información documentada (inventario, fichas) sobre sus productos?'),
('¿Dispone de equipos o maquinarias para la elaboración de sus productos?'),
('¿Conoce y aplica las medidas de bioseguridad adecuadas a sus productos y/o servicios?'),
('¿Dispone de equipos o maquinarias necesarios para la elaboración de sus productos?'),
('¿Dispone de una adecuada infraestructura para su gestión? (taller, bodegas)'),
('¿Dispone de computador y acceso a internet en su negocio?'),
('¿Dispone de un plan de emergencia y seguridad?'),
('¿Tiene identificado proveedores con precios de venta adecuados?');
('Subtotal:');




CREATE TABLE respuestas_gestion_productiva (
    idRespuesta_Productiva INT AUTO_INCREMENT PRIMARY KEY,
    idEmprendimiento INT NOT NULL,
    idEmprendedor INT NOT NULL,
    idColaborador INT NOT NULL,
    idPregunta_Productiva INT NOT NULL, 
    diagnostico VARCHAR(255),
    intermedia VARCHAR(255),
    final VARCHAR(255),
    mejora VARCHAR(255),
    status VARCHAR(100),
    observaciones TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- Claves Foráneas para las relaciones
    FOREIGN KEY (idEmprendimiento) REFERENCES emprendimiento(idEmprendimiento) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idEmprendedor) REFERENCES emprendedor(idEmprendedor) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idColaborador) REFERENCES colaborador(idColaborador) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idPregunta_Productiva) REFERENCES preguntas_gestion_productiva(idPregunta_Productiva) ON DELETE CASCADE ON UPDATE CASCADE
);

---  consulta para verificar las respuestas de gestion Organizacional y validar con los id de emprendedor emprendimiento y colaborador
SELECT 
    r.idRespuesta_Organizacional, 
    e.nombreComercial AS Emprendimiento, 
    CONCAT(en.nombres, ' ', en.apellidos) AS Emprendedor, 
    CONCAT(c.nombres, ' ', c.apellidos) AS Colaborador, 
    p.pregunta, 
    r.diagnostico, 
    r.intermedia, 
    r.final, 
    r.mejora, 
    r.status, 
    r.observaciones
FROM respuestas_gestion_organizacional r
JOIN emprendimiento e ON r.idEmprendimiento =
e.idEmprendimiento
JOIN emprendedor en ON r.idEmprendedor = en.idEmprendedor
JOIN colaborador c ON r.idColaborador = c.idColaborador
JOIN preguntas_gestion_organizacional p ON r.idPregunta_Organizacional = p.idPregunta_Organizacional;







---Gestion Productiva

CREATE TABLE preguntas_gestion_productiva (
    idPregunta_Productiva INT AUTO_INCREMENT PRIMARY KEY,
    pregunta VARCHAR(255) NOT NULL
);


INSERT INTO preguntas_gestion_productiva (pregunta) VALUES
('¿Conoce su cadena productiva / procesos?'),
('¿Dispone de información documentada (inventario, fichas) sobre sus productos?'),
('¿Dispone de equipos o maquinarias para la elaboración de sus productos?'),
('¿Conoce y aplica las medidas de bioseguridad adecuadas a sus productos y/o servicios?'),
('¿Dispone de equipos o maquinarias necesarios para la elaboración de sus productos?'),
('¿Dispone de una adecuada infraestructura para su gestión? (taller, bodegas)'),
('¿Dispone de computador y acceso a internet en su negocio?'),
('¿Dispone de un plan de emergencia y seguridad?'),
('¿Tiene identificado proveedores con precios de venta adecuados?');




CREATE TABLE respuestas_gestion_productiva (
    idRespuesta_Productiva INT AUTO_INCREMENT PRIMARY KEY,
    idEmprendimiento INT NOT NULL,
    idEmprendedor INT NOT NULL,
    idColaborador INT NOT NULL,
    idPregunta_Productiva INT NOT NULL, 
    diagnostico VARCHAR(255),
    intermedia VARCHAR(255),
    final VARCHAR(255),
    mejora VARCHAR(255),
    status VARCHAR(100),
    observaciones TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- Claves Foráneas para las relaciones
    FOREIGN KEY (idEmprendimiento) REFERENCES emprendimiento(idEmprendimiento) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idEmprendedor) REFERENCES emprendedor(idEmprendedor) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idColaborador) REFERENCES colaborador(idColaborador) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idPregunta_Productiva) REFERENCES preguntas_gestion_productiva(idPregunta_Productiva) ON DELETE CASCADE ON UPDATE CASCADE
);
