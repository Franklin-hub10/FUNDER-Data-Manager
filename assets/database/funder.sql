-- Configuración inicial de MySQL
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Base de datos: `funder`
-- Creación de tablas principales

CREATE TABLE `rol` (
  `idRol` int(10) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`idRol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `permiso` (
  `idPermiso` int(10) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`idPermiso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `rol_permiso` (
  `idRol` int(10) NOT NULL,
  `idPermiso` int(10) NOT NULL,
  PRIMARY KEY (`idRol`, `idPermiso`),
  FOREIGN KEY (`idRol`) REFERENCES `rol` (`idRol`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`idPermiso`) REFERENCES `permiso` (`idPermiso`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `colaborador` (
  `idColaborador` int(10) NOT NULL AUTO_INCREMENT,
  `idRol` int(10) NOT NULL,
  `nombres` varchar(200) NOT NULL,
  `apellidos` varchar(200) NOT NULL,
  `idSede` int(10) NOT NULL,
  `cargo` varchar(100) NOT NULL,
  PRIMARY KEY (`idColaborador`),
  FOREIGN KEY (`idRol`) REFERENCES `rol` (`idRol`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Otras tablas existentes de la base de datos

CREATE TABLE `canton` (
  `idCanton` int(10) NOT NULL AUTO_INCREMENT,
  `idProvincia` int(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `estado` varchar(20) NOT NULL,
  PRIMARY KEY (`idCanton`),
  FOREIGN KEY (`idProvincia`) REFERENCES `provincia` (`idProvincia`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `provincia` (
  `idProvincia` int(10) NOT NULL AUTO_INCREMENT,
  `idRegion` int(10) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `estado` varchar(20) NOT NULL,
  PRIMARY KEY (`idProvincia`),
  FOREIGN KEY (`idRegion`) REFERENCES `region` (`idRegion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `region` (
  `idRegion` int(10) NOT NULL AUTO_INCREMENT,
  `idPais` int(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `estado` varchar(20) NOT NULL,
  PRIMARY KEY (`idRegion`),
  FOREIGN KEY (`idPais`) REFERENCES `pais` (`idPais`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `pais` (
  `idPais` int(10) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `estado` varchar(50) NOT NULL,
  PRIMARY KEY (`idPais`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `estadocivil` (
  `idEstadoCivil` int(10) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`idEstadoCivil`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `emprendedor` (
  `idEmprendedor` int(10) NOT NULL AUTO_INCREMENT,
  `nombres` varchar(200) NOT NULL,
  `apellidos` varchar(200) NOT NULL,
  `idPais` int(10) NOT NULL,
  `edad` int(5) NOT NULL,
  `idGenero` int(10) NOT NULL,
  `idEstadoCivil` int(10) NOT NULL,
  `numeroCargas` int(5) NOT NULL,
  `cabezaHogar` varchar(10) NOT NULL,
  `idEtnia` int(10) NOT NULL,
  `discapacidad` varchar(50) NOT NULL,
  `idStatusMigra` int(10) NOT NULL,
  `direccion` varchar(200) NOT NULL,
  `telefono1` varchar(20) NOT NULL,
  `telefono2` varchar(20) NOT NULL,
  `correo` varchar(200) NOT NULL,
  `disponeInternet` varchar(5) NOT NULL,
  `disponeEquipo` varchar(5) NOT NULL,
  `idNivel` int(10) NOT NULL,
  PRIMARY KEY (`idEmprendedor`),
  FOREIGN KEY (`idPais`) REFERENCES `pais` (`idPais`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`idEstadoCivil`) REFERENCES `estadocivil` (`idEstadoCivil`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insertar datos iniciales

INSERT INTO `roles` (`nombre`) VALUES
('Administrador'),
('Usuario');

INSERT INTO `permiso` (`nombre`) VALUES
('CREAR_USUARIO'),
('EDITAR_USUARIO'),
('BORRAR_USUARIO');

INSERT INTO `rol_permiso` (`idRol`, `idPermiso`) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
