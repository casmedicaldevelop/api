-- Rename Role enum values from English to Spanish.
-- (ADMIN -> ADMINISTRADOR, USER -> AUXILIAR)
-- Non-destructive: ALTER TYPE ... RENAME VALUE updates the enum definition
-- in place and existing rows referencing the old labels automatically reflect
-- the new labels.
-- Also realigns the default for employees.role to the new spelling so future
-- inserts without an explicit role land on 'AUXILIAR'.

ALTER TYPE "Role" RENAME VALUE 'ADMIN' TO 'ADMINISTRADOR';
ALTER TYPE "Role" RENAME VALUE 'USER' TO 'AUXILIAR';

ALTER TABLE "employees" ALTER COLUMN "role" SET DEFAULT 'AUXILIAR';
