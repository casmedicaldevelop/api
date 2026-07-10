-- Add Gender enum and users.gender column.
-- Nullable: existing user rows have no value yet.

CREATE TYPE "Gender" AS ENUM ('MASCULINO', 'FEMENINO');

ALTER TABLE "users" ADD COLUMN "gender" "Gender";
