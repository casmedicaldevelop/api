-- Rename HealthcareRegime enum values from English to Spanish.
-- (CONTRIBUTORY -> CONTRIBUTIVO, SUBSIDIZED -> SUBSIDIADO)
-- Non-destructive: ALTER TYPE ... RENAME VALUE updates the enum definition
-- in place and any existing rows referencing the old labels reflect the new
-- labels automatically.

ALTER TYPE "HealthcareRegime" RENAME VALUE 'CONTRIBUTORY' TO 'CONTRIBUTIVO';
ALTER TYPE "HealthcareRegime" RENAME VALUE 'SUBSIDIZED' TO 'SUBSIDIADO';
