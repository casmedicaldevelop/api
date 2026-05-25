-- Split User.name into firstName, secondName, firstSurname, secondSurname
-- Safe only on empty users table (development environment)

DROP INDEX IF EXISTS "users_name_idx";
ALTER TABLE "users" DROP COLUMN "name";
ALTER TABLE "users" ADD COLUMN "first_name" TEXT NOT NULL DEFAULT '';
ALTER TABLE "users" ADD COLUMN "second_name" TEXT;
ALTER TABLE "users" ADD COLUMN "first_surname" TEXT NOT NULL DEFAULT '';
ALTER TABLE "users" ADD COLUMN "second_surname" TEXT;
ALTER TABLE "users" ALTER COLUMN "first_name" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "first_surname" DROP DEFAULT;
CREATE INDEX "users_first_surname_idx" ON "users"("first_surname");
CREATE INDEX "users_first_name_idx" ON "users"("first_name");
