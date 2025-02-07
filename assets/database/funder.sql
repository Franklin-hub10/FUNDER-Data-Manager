SHOW DATABASES;




-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-08-2024 a las 03:03:45
-- Versión del servidor: 10.4.19-MariaDB
-- Versión de PHP: 8.0.7


create database funder;
USE funder;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `funder`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `canton`
--

CREATE TABLE `canton` (
  `idCanton` int(10) NOT NULL,
  `idProvincia` int(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `colaborador`
--

CREATE TABLE `colaborador` (
  `idColaborador` INT(10) NOT NULL AUTO_INCREMENT,
  `idRol` INT(10) NOT NULL,
  `nombres` VARCHAR(200) NOT NULL,
  `apellidos` VARCHAR(200) NOT NULL,
  `idSede` INT(10) NOT NULL,
  `cargo` VARCHAR(100) NOT NULL,
  `identificacion` VARCHAR(50) NOT NULL UNIQUE, -- Cédula, DNI, pasaporte, etc.
  `email` VARCHAR(100) NOT NULL UNIQUE, -- Email único
  `password` VARCHAR(255) NOT NULL, -- Contraseña encriptada
  `estado` ENUM('activo', 'inactivo') DEFAULT 'activo', -- Estado de usuario
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Registro de creación
  PRIMARY KEY (`idColaborador`),
  FOREIGN KEY (`idRol`) REFERENCES `rol`(`idRol`) ON UPDATE CASCADE,
  FOREIGN KEY (`idSede`) REFERENCES `sede`(`idSede`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE colaborador ADD COLUMN password_temp BOOLEAN DEFAULT TRUE;



-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `datosgestion`
--

CREATE TABLE `datosgestion` (
  `idDatoGestion` int(10) NOT NULL,
  `pregunta` varchar(500) NOT NULL,
  `idTipoGestion` int(10) NOT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `emprendedor`
--

CREATE TABLE `emprendedor` (
  `idEmprendedor` int(10) NOT NULL AUTO_INCREMENT,
  `nombres` varchar(200) NOT NULL,
  `apellidos` varchar(200) NOT NULL,
  `idPais` int(10) NOT NULL,
  `edad` int(5) NOT NULL,
  `idSede` INT(10) NOT NULL,
  `generoIdentidad` varchar(45) NOT NULL,
  `estadoCivil` varchar(45) NOT NULL,
  `numeroCargas` int(5) NOT NULL,
  `rolFamiliar` varchar(10) NOT NULL,
  `etnia` varchar(45) NOT NULL,
  `discapacidad` varchar(50) NOT NULL,
  `estatusMigra` varchar(45),
  `direccion` varchar(200) NOT NULL,
  `telefono1` varchar(20) NOT NULL,
  `telefono2` varchar(20) NOT NULL,
  `correo` varchar(200) NOT NULL,
  `servicioDeInternet` boolean NOT NULL,
  `celular` boolean NOT NULL,
  `computadora` boolean NOT NULL,
  `tablet` boolean NOT NULL,
  `nivelInstitucional` varchar(45) NOT NULL,
  `idColaborador` int(10),
  `tipoNegocio` varchar(200) NOT NULL,
  `actividadEconomica` varchar(200) NOT NULL,
  `promMensualIngreso` double NOT NULL,
  `promMensualGastos` double NOT NULL,
  `promMensualUtilidad` double NOT NULL,
  `caracteristicaDelNegocio` varchar(1000) NOT NULL,
  `camposAsistenciaTecnica` varchar(1000) NOT NULL,
  `temaCapacitacion` varchar(1000) NOT NULL,
  PRIMARY KEY (`idEmprendedor`),
  FOREIGN KEY (`idColaborador`) REFERENCES `colaborador`(`idColaborador`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `emprendimiento`
--

CREATE TABLE `emprendimiento` (
  `idEmprendimiento` INT(10) NOT NULL AUTO_INCREMENT,
  `nombreComercial` VARCHAR(100) NOT NULL,
  `razonSocial` VARCHAR(12) NOT NULL,
  `idSede` INT(10) NOT NULL,
  `idProdServ` INT(10) NOT NULL,
  `direccionNegocio` VARCHAR(200) NOT NULL,
  `idParroquia` INT(10) NOT NULL,
  `canton` VARCHAR(200) NOT NULL,
  `ciudad` VARCHAR(200) NOT NULL,
  `telefono1` VARCHAR(20) NOT NULL,
  `telefono2` VARCHAR(20) NOT NULL,
  `correo` VARCHAR(100) NOT NULL,
  `numSocios` INT(10) NOT NULL,
  `numEmpleados` INT(100) NOT NULL,
  `antiguedad` INT(10) NOT NULL,
  `nombreContacto1` VARCHAR(200) NOT NULL,
  `telefonoContacto1` VARCHAR(20) NOT NULL,
  `nombreContacto2` VARCHAR(200) NOT NULL,
  `telefonoContacto2` VARCHAR(20) NOT NULL,
  `referencia` VARCHAR(200) NOT NULL,
  `nombreEvaluador` VARCHAR(200) NOT NULL,
  `fechaEvaluacion` DATE NOT NULL,
  `idEmprendedor` INT(10) NOT NULL,
  `idColaborador` INT(10) NOT NULL,
  PRIMARY KEY (`idEmprendimiento`),
  FOREIGN KEY (`idEmprendedor`) REFERENCES `emprendedor`(`idEmprendedor`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`idColaborador`) REFERENCES `colaborador`(`idColaborador`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- --------------------------------------------------------

-- --------------------------------------------------------

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `etapamedicion`
--

CREATE TABLE `etapamedicion` (
  `idEtapaMedicion` int(10) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluacion`
--

CREATE TABLE `evaluacion` (
  `idEvaluacion` int(10) NOT NULL,
  `idEmprendimiento` int(10) NOT NULL,
  `idColaborador` int(10) NOT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluacionpregunta`
--

CREATE TABLE `evaluacionpregunta` (
  `idEvalPregunta` int(10) NOT NULL,
  `idEvaluacion` int(10) NOT NULL,
  `idDatoGestion` int(10) NOT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

-- --------------------------------------------------------

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pais`
--

CREATE TABLE `pais` (
  `idPais` int(10) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `estado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `parroquia`
--

CREATE TABLE `parroquia` (
  `idParroquia` int(10) NOT NULL,
  `idCanton` int(10) NOT NULL,
  `idTipoParroquia` int(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntaetapa`
--

CREATE TABLE `preguntaetapa` (
  `idPreguntaEtapa` int(10) NOT NULL,
  `idEtapaMedicion` int(10) NOT NULL,
  `idEvalPregunta` int(10) NOT NULL,
  `valor` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productoservicios`
--

CREATE TABLE `productoservicios` (
  `idProdServ` int(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `idTipo` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `provincia`
--

CREATE TABLE `provincia` (
  `idProvincia` int(10) NOT NULL,
  `idRegion` int(10) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `region`
--

CREATE TABLE `region` (
  `idRegion` int(10) NOT NULL,
  `idPais` int(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `idRol` int(10) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sede`
--

CREATE TABLE `sede` (
  `idSede` int(10) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipogestion`
--

CREATE TABLE `tipogestion` (
  `idTipoGestion` int(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tiponegocio`
--

CREATE TABLE `tiponegocio` (
  `idTipo` int(10) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipoparroquia`
--

CREATE TABLE `tipoparroquia` (
  `idTipoParroquia` int(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `canton`
--
ALTER TABLE `canton`
  ADD PRIMARY KEY (`idCanton`),
  ADD KEY `idProvincia` (`idProvincia`);

--
-- Indices de la tabla `colaborador`
--
ALTER TABLE `colaborador`
  ADD PRIMARY KEY (`idColaborador`),
  ADD KEY `idRol` (`idRol`),
  ADD KEY `idSede` (`idSede`);

--
-- Indices de la tabla `datosgestion`
--
ALTER TABLE `datosgestion`
  ADD PRIMARY KEY (`idDatoGestion`),
  ADD KEY `idTipoGestion` (`idTipoGestion`);

--
-- Indices de la tabla `emprendedor`
--
ALTER TABLE `emprendedor`
  ADD PRIMARY KEY (`idEmprendedor`),
  ADD KEY `idPais` (`idPais`),
  ADD KEY `idGenero` (`idGenero`),
  ADD KEY `idEstadoCivil` (`idEstadoCivil`),
  ADD KEY `idEtnia` (`idEtnia`),
  ADD KEY `idStatusMigra` (`idStatusMigra`),
  ADD KEY `idNivel` (`idNivel`);

--
-- Indices de la tabla `emprendimiento`
--
ALTER TABLE `emprendimiento`
  ADD PRIMARY KEY (`idEmprendimiento`),
  ADD KEY `idSede` (`idSede`),
  ADD KEY `idProdServ` (`idProdServ`),
  ADD KEY `idParroquia` (`idParroquia`);



--
-- Indices de la tabla `etapamedicion`
--
ALTER TABLE `etapamedicion`
  ADD PRIMARY KEY (`idEtapaMedicion`);

--
-- Indices de la tabla `evaluacion`
--
ALTER TABLE `evaluacion`
  ADD PRIMARY KEY (`idEvaluacion`),
  ADD KEY `idEmprendimiento` (`idEmprendimiento`),
  ADD KEY `idColaborador` (`idColaborador`);

--
-- Indices de la tabla `evaluacionpregunta`
--
ALTER TABLE `evaluacionpregunta`
  ADD PRIMARY KEY (`idEvalPregunta`),
  ADD KEY `idEvaluacion` (`idEvaluacion`),
  ADD KEY `idDatoGestion` (`idDatoGestion`);



--
-- Indices de la tabla `pais`
--
ALTER TABLE `pais`
  ADD PRIMARY KEY (`idPais`);

--
-- Indices de la tabla `parroquia`
--
ALTER TABLE `parroquia`
  ADD PRIMARY KEY (`idParroquia`),
  ADD KEY `idCanton` (`idCanton`),
  ADD KEY `idTipoParroquia` (`idTipoParroquia`);

--
-- Indices de la tabla `preguntaetapa`
--
ALTER TABLE `preguntaetapa`
  ADD PRIMARY KEY (`idPreguntaEtapa`),
  ADD KEY `idEtapaMedicion` (`idEtapaMedicion`),
  ADD KEY `idEvalPregunta` (`idEvalPregunta`);

--
-- Indices de la tabla `productoservicios`
--
ALTER TABLE `productoservicios`
  ADD PRIMARY KEY (`idProdServ`),
  ADD KEY `idTipo` (`idTipo`);

--
-- Indices de la tabla `provincia`
--
ALTER TABLE `provincia`
  ADD PRIMARY KEY (`idProvincia`),
  ADD KEY `idRegion` (`idRegion`);

--
-- Indices de la tabla `region`
--
ALTER TABLE `region`
  ADD PRIMARY KEY (`idRegion`),
  ADD KEY `idPais` (`idPais`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`idRol`);

--
-- Indices de la tabla `sede`
--
ALTER TABLE `sede`
  ADD PRIMARY KEY (`idSede`);

--
-- Indices de la tabla `tipogestion`
--
ALTER TABLE `tipogestion`
  ADD PRIMARY KEY (`idTipoGestion`);

--
-- Indices de la tabla `tiponegocio`
--
ALTER TABLE `tiponegocio`
  ADD PRIMARY KEY (`idTipo`);

--
-- Indices de la tabla `tipoparroquia`
--
ALTER TABLE `tipoparroquia`
  ADD PRIMARY KEY (`idTipoParroquia`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `canton`
--
ALTER TABLE `canton`
  MODIFY `idCanton` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `colaborador`
--
ALTER TABLE `colaborador`
  MODIFY `idColaborador` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `datosgestion`
--
ALTER TABLE `datosgestion`
  MODIFY `idDatoGestion` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `emprendedor`
--
ALTER TABLE `emprendedor`
  MODIFY `idEmprendedor` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `emprendimiento`
--
ALTER TABLE `emprendimiento`
  MODIFY `idEmprendimiento` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `etapamedicion`
--
ALTER TABLE `etapamedicion`
  MODIFY `idEtapaMedicion` int(10) NOT NULL AUTO_INCREMENT;


-- AUTO_INCREMENT de la tabla `evaluacion`
--
ALTER TABLE `evaluacion`
  MODIFY `idEvaluacion` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `evaluacionpregunta`
--
ALTER TABLE `evaluacionpregunta`
  MODIFY `idEvalPregunta` int(10) NOT NULL AUTO_INCREMENT;



--
-- AUTO_INCREMENT de la tabla `pais`
--
ALTER TABLE `pais`
  MODIFY `idPais` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `parroquia`
--
ALTER TABLE `parroquia`
  MODIFY `idParroquia` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `preguntaetapa`
--
ALTER TABLE `preguntaetapa`
  MODIFY `idPreguntaEtapa` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productoservicios`
--
ALTER TABLE `productoservicios`
  MODIFY `idProdServ` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `provincia`
--
ALTER TABLE `provincia`
  MODIFY `idProvincia` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `region`
--
ALTER TABLE `region`
  MODIFY `idRegion` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `idRol` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sede`
--
ALTER TABLE `sede`
  MODIFY `idSede` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipogestion`
--
ALTER TABLE `tipogestion`
  MODIFY `idTipoGestion` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tiponegocio`
--
ALTER TABLE `tiponegocio`
  MODIFY `idTipo` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipoparroquia`
--
ALTER TABLE `tipoparroquia`
  MODIFY `idTipoParroquia` int(10) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `canton`
--
ALTER TABLE `canton`
  ADD CONSTRAINT `canton_ibfk_1` FOREIGN KEY (`idProvincia`) REFERENCES `provincia` (`idProvincia`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `colaborador`
--
ALTER TABLE `colaborador`
  ADD CONSTRAINT `colaborador_ibfk_1` FOREIGN KEY (`idSede`) REFERENCES `sede` (`idSede`) ON UPDATE CASCADE,
  ADD CONSTRAINT `colaborador_ibfk_2` FOREIGN KEY (`idRol`) REFERENCES `rol` (`idRol`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `datosgestion`
--
ALTER TABLE `datosgestion`
  ADD CONSTRAINT `datosgestion_ibfk_1` FOREIGN KEY (`idTipoGestion`) REFERENCES `tipogestion` (`idTipoGestion`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `emprendedor`
--
ALTER TABLE `emprendedor`
  ADD CONSTRAINT `emprendedor_ibfk_1` FOREIGN KEY (`idEstadoCivil`) REFERENCES `estadocivil` (`idEstadoCivil`) ON UPDATE CASCADE,
  ADD CONSTRAINT `emprendedor_ibfk_2` FOREIGN KEY (`idPais`) REFERENCES `pais` (`idPais`) ON UPDATE CASCADE,
  ADD CONSTRAINT `emprendedor_ibfk_3` FOREIGN KEY (`idStatusMigra`) REFERENCES `estatusmigra` (`idStatusMigra`) ON UPDATE CASCADE,
  ADD CONSTRAINT `emprendedor_ibfk_4` FOREIGN KEY (`idNivel`) REFERENCES `nivelinstruccion` (`idNivwl`) ON UPDATE CASCADE,
  ADD CONSTRAINT `emprendedor_ibfk_5` FOREIGN KEY (`idEtnia`) REFERENCES `etnia` (`idEtnia`) ON UPDATE CASCADE,
  ADD CONSTRAINT `emprendedor_ibfk_6` FOREIGN KEY (`idGenero`) REFERENCES `genero` (`idGenero`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `emprendimiento`
--
ALTER TABLE `emprendimiento`
  ADD CONSTRAINT `emprendimiento_ibfk_1` FOREIGN KEY (`idSede`) REFERENCES `sede` (`idSede`) ON UPDATE CASCADE,
  ADD CONSTRAINT `emprendimiento_ibfk_2` FOREIGN KEY (`idProdServ`) REFERENCES `productoservicios` (`idProdServ`) ON UPDATE CASCADE,
  ADD CONSTRAINT `emprendimiento_ibfk_3` FOREIGN KEY (`idParroquia`) REFERENCES `parroquia` (`idParroquia`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `evaluacion`
--
ALTER TABLE `evaluacion`
  ADD CONSTRAINT `evaluacion_ibfk_1` FOREIGN KEY (`idColaborador`) REFERENCES `colaborador` (`idColaborador`) ON UPDATE CASCADE,
  ADD CONSTRAINT `evaluacion_ibfk_2` FOREIGN KEY (`idEmprendimiento`) REFERENCES `emprendimiento` (`idEmprendimiento`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `evaluacionpregunta`
--
ALTER TABLE `evaluacionpregunta`
  ADD CONSTRAINT `evaluacionpregunta_ibfk_1` FOREIGN KEY (`idEvaluacion`) REFERENCES `evaluacion` (`idEvaluacion`) ON UPDATE CASCADE,
  ADD CONSTRAINT `evaluacionpregunta_ibfk_2` FOREIGN KEY (`idDatoGestion`) REFERENCES `datosgestion` (`idDatoGestion`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `parroquia`
--
ALTER TABLE `parroquia`
  ADD CONSTRAINT `parroquia_ibfk_1` FOREIGN KEY (`idCanton`) REFERENCES `canton` (`idCanton`) ON UPDATE CASCADE,
  ADD CONSTRAINT `parroquia_ibfk_2` FOREIGN KEY (`idTipoParroquia`) REFERENCES `tipoparroquia` (`idTipoParroquia`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `preguntaetapa`
--
ALTER TABLE `preguntaetapa`
  ADD CONSTRAINT `preguntaetapa_ibfk_1` FOREIGN KEY (`idEtapaMedicion`) REFERENCES `etapamedicion` (`idEtapaMedicion`) ON UPDATE CASCADE,
  ADD CONSTRAINT `preguntaetapa_ibfk_2` FOREIGN KEY (`idEvalPregunta`) REFERENCES `evaluacionpregunta` (`idEvalPregunta`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `productoservicios`
--
ALTER TABLE `productoservicios`
  ADD CONSTRAINT `productoservicios_ibfk_1` FOREIGN KEY (`idTipo`) REFERENCES `tiponegocio` (`idTipo`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `provincia`
--
ALTER TABLE `provincia`
  ADD CONSTRAINT `provincia_ibfk_1` FOREIGN KEY (`idRegion`) REFERENCES `region` (`idRegion`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `region`
--
ALTER TABLE `region`
  ADD CONSTRAINT `region_ibfk_1` FOREIGN KEY (`idPais`) REFERENCES `pais` (`idPais`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;




-- tablas nuevas Franklin --

-- permisos -- 

CREATE TABLE `permiso` (
  `idPermiso` int(10) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`idPermiso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `rol_permiso` (
  `idRol` int(10) NOT NULL,
  `idPermiso` int(10) NOT NULL,
  PRIMARY KEY (`idRol`, `idPermiso`),
  FOREIGN KEY (`idRol`) REFERENCES `rol`(`idRol`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`idPermiso`) REFERENCES `permiso`(`idPermiso`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE vista_permiso (
  idVista INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  url VARCHAR(255) NOT NULL UNIQUE, 
  idPermiso INT NOT NULL,
  FOREIGN KEY (idPermiso) REFERENCES permiso(idPermiso) ON DELETE CASCADE
);
