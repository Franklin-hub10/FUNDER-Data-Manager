DELIMITER //

CREATE TRIGGER after_insert_colaborador
AFTER INSERT ON colaborador
FOR EACH ROW
BEGIN
    INSERT INTO export_data (tipo_formulario, datos)
    VALUES ('colaborador', JSON_OBJECT(
        'idColaborador', NEW.idColaborador,
        'nombres', NEW.nombres,
        'apellidos', NEW.apellidos,
        'idSede', NEW.idSede,
        'email', NEW.email
    ));
END;
//

DELIMITER ;


DELIMITER //

CREATE TRIGGER after_insert_emprendedor
AFTER INSERT ON emprendedor
FOR EACH ROW
BEGIN
    INSERT INTO export_data (tipo_formulario, datos)
    VALUES ('emprendedor', JSON_OBJECT(
        'idEmprendedor', NEW.idEmprendedor,
        'nombres', NEW.nombres,
        'apellidos', NEW.apellidos,
        'pais', NEW.pais,
        'edad', NEW.edad,
        'idSede', NEW.idSede,
        'generoIdentidad', NEW.generoIdentidad,
        'estadoCivil', NEW.estadoCivil,
        'numeroCargas', NEW.numeroCargas,
        'rolFamiliar', NEW.rolFamiliar,
        'etnia', NEW.etnia,
        'discapacidad', NEW.discapacidad,
        'estatusMigratorio', NEW.estatusMigratorio,
        'direccion', NEW.direccion,
        'telefono1', NEW.telefono1,
        'telefono2', NEW.telefono2,
        'correo', NEW.correo,
        'servicioDeInternet', NEW.servicioDeInternet,
        'celular', NEW.celular,
        'computadora', NEW.computadora,
        'tablet', NEW.tablet,
        'nivelInstitucional', NEW.nivelInstitucional,
        'idColaborador', NEW.idColaborador,
        'tipoNegocio', NEW.tipoNegocio,
        'actividadEconomica', NEW.actividadEconomica,
        'promMensualIngreso', NEW.promMensualIngreso,
        'promMensualGastos', NEW.promMensualGastos,
        'promMensualUtilidad', NEW.promMensualUtilidad,
        'caracteristicaDelNegocio', NEW.caracteristicaDelNegocio,
        'camposAsistenciaTecnica', NEW.camposAsistenciaTecnica,
        'temaCapacitacion', NEW.temaCapacitacion,
        'numeroIdentificacion', NEW.numeroIdentificacion
    ));
END;
//

DELIMITER ;


DELIMITER //

CREATE TRIGGER after_insert_emprendimiento
AFTER INSERT ON emprendimiento
FOR EACH ROW
BEGIN
    INSERT INTO export_data (tipo_formulario, datos)
    VALUES ('emprendimiento', JSON_OBJECT(
        'idEmprendimiento', NEW.idEmprendimiento,
        'nombreComercial', NEW.nombreComercial,
        'razonSocial', NEW.razonSocial,
        'idSede', NEW.idSede,
        'idProdServ', NEW.idProdServ,
        'direccionNegocio', NEW.direccionNegocio,
        'idParroquia', NEW.idParroquia,
        'canton', NEW.canton,
        'ciudad', NEW.ciudad,
        'telefono1', NEW.telefono1,
        'telefono2', NEW.telefono2,
        'correo', NEW.correo,
        'numSocios', NEW.numSocios,
        'numEmpleados', NEW.numEmpleados,
        'antiguedad', NEW.antiguedad,
        'nombreContacto1', NEW.nombreContacto1,
        'telefonoContacto1', NEW.telefonoContacto1,
        'nombreContacto2', NEW.nombreContacto2,
        'telefonoContacto2', NEW.telefonoContacto2,
        'referencia', NEW.referencia,
        'nombreEvaluador', NEW.nombreEvaluador,
        'fechaEvaluacion', NEW.fechaEvaluacion,
        'idEmprendedor', NEW.idEmprendedor,
        'idColaborador', NEW.idColaborador
    ));
END;
//

DELIMITER ;
