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