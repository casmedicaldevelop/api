-- Healthcare regime classification for Colombian patients
-- (CONTRIBUTORY = régimen contributivo, SUBSIDIZED = régimen subsidiado).
-- Nullable: existing patient records keep no value until updated.
CREATE TYPE "HealthcareRegime" AS ENUM ('CONTRIBUTORY', 'SUBSIDIZED');

ALTER TABLE "users"
  ADD COLUMN "healthcare_regime" "HealthcareRegime";
