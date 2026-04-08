-- =====================================================
-- Script: 01-create-databases.sql
-- Descripción: Crear bases de datos para TuEmpleo
-- =====================================================

-- Crear base de datos para Keycloak
CREATE DATABASE keycloak_db;

-- Crear base de datos para la aplicación TuEmpleo
CREATE DATABASE tuempleo_db;

-- Conectar a keycloak_db para granting privileges
\c keycloak_db
GRANT ALL PRIVILEGES ON DATABASE keycloak_db TO postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;

-- Conectar a tuempleo_db para granting privileges
\c tuempleo_db
GRANT ALL PRIVILEGES ON DATABASE tuempleo_db TO postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;

SELECT 'Bases de datos creadas y privilegios asignados correctamente' as mensaje;

-- Verificar bases de datos creadas
SELECT datname FROM pg_database WHERE datname IN ('keycloak_db', 'tuempleo_db');