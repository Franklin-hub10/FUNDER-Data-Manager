DELIMITER //

CREATE TRIGGER after_insert_colaborador
AFTER INSERT ON colaborador
FOR EACH ROW
BEGIN
    DECLARE sedeNombre VARCHAR(30);

    -- Obtener el nombre de la sede
    SELECT nombre INTO sedeNombre FROM sede WHERE idSede = NEW.idSede;

    INSERT INTO export_data (
        tipo_formulario, idEntidad, nombres, apellidos, nombreSede, email, fecha
    ) VALUES (
        'colaborador', NEW.idColaborador, NEW.nombres, NEW.apellidos, sedeNombre, NEW.email, NOW()
    );
END;
//

DELIMITER ;




DELIMITER //

CREATE TRIGGER after_insert_emprendedor
AFTER INSERT ON emprendedor
FOR EACH ROW
BEGIN
    DECLARE sedeNombre VARCHAR(30);

    -- Obtener el nombre de la sede
    SELECT nombre INTO sedeNombre FROM sede WHERE idSede = NEW.idSede;

    INSERT INTO export_data (
        tipo_formulario, idEntidad, nombres, apellidos, pais, edad, nombreSede, generoIdentidad, 
        estadoCivil, numeroCargas, rolFamiliar, etnia, discapacidad, estatusMigratorio, direccion, 
        telefono1, telefono2, correo, servicioDeInternet, celular, computadora, tablet, 
        nivelInstitucional, idColaborador, tipoNegocio, actividadEconomica, promMensualIngreso, 
        promMensualGastos, promMensualUtilidad, caracteristicaDelNegocio, camposAsistenciaTecnica, 
        temaCapacitacion, numeroIdentificacion, fecha
    ) VALUES (
        'emprendedor', NEW.idEmprendedor, NEW.nombres, NEW.apellidos, NEW.pais, NEW.edad, sedeNombre, 
        NEW.generoIdentidad, NEW.estadoCivil, NEW.numeroCargas, NEW.rolFamiliar, NEW.etnia, 
        NEW.discapacidad, NEW.estatusMigratorio, NEW.direccion, NEW.telefono1, NEW.telefono2, 
        NEW.correo, NEW.servicioDeInternet, NEW.celular, NEW.computadora, NEW.tablet, 
        NEW.nivelInstitucional, NEW.idColaborador, NEW.tipoNegocio, NEW.actividadEconomica, 
        NEW.promMensualIngreso, NEW.promMensualGastos, NEW.promMensualUtilidad, NEW.caracteristicaDelNegocio, 
        NEW.camposAsistenciaTecnica, NEW.temaCapacitacion, NEW.numeroIdentificacion, NOW()
    );
END;
//

DELIMITER ;





DELIMITER //

CREATE TRIGGER after_insert_emprendimiento
AFTER INSERT ON emprendimiento
FOR EACH ROW
BEGIN
    DECLARE sedeNombre VARCHAR(30);

    -- Obtener el nombre de la sede
    SELECT nombre INTO sedeNombre FROM sede WHERE idSede = NEW.idSede;

    INSERT INTO export_data (
        tipo_formulario, idEntidad, nombreComercial, razonSocial, nombreSede, idProdServ, direccionNegocio, 
        idParroquia, canton, ciudad, telefono1, telefono2, correo, numSocios, numEmpleados, antiguedad, 
        nombreContacto1, telefonoContacto1, nombreContacto2, telefonoContacto2, referencia, nombreEvaluador, 
        fechaEvaluacion, idColaborador, idEmprendedor, fecha
    ) VALUES (
        'emprendimiento', NEW.idEmprendimiento, NEW.nombreComercial, NEW.razonSocial, sedeNombre, 
        NEW.idProdServ, NEW.direccionNegocio, NEW.idParroquia, NEW.canton, NEW.ciudad, NEW.telefono1, 
        NEW.telefono2, NEW.correo, NEW.numSocios, NEW.numEmpleados, NEW.antiguedad, 
        NEW.nombreContacto1, NEW.telefonoContacto1, NEW.nombreContacto2, NEW.telefonoContacto2, 
        NEW.referencia, NEW.nombreEvaluador, NEW.fechaEvaluacion, NEW.idColaborador, 
        NEW.idEmprendedor, NOW()
    );
END;
//

DELIMITER ;
