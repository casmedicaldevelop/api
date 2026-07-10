-- Departamento (ubicación) del usuario; nullable para no afectar usuarios existentes.
ALTER TABLE "users" ADD COLUMN "department" TEXT;
