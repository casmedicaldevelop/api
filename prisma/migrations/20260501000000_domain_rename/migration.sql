-- Domain rename migration
-- users → employees (company staff with JWT login)
-- service_users → users (EPS patients, no login)

-- Step 1: Rename tables
ALTER TABLE "users" RENAME TO "employees";
ALTER TABLE "user_modules" RENAME TO "employee_modules";
ALTER TABLE "service_users" RENAME TO "users";

-- Step 2: Rename columns
ALTER TABLE "employee_modules" RENAME COLUMN "user_id" TO "employee_id";
ALTER TABLE "password_reset_otps" RENAME COLUMN "user_id" TO "employee_id";

-- Step 3: employees PK (constraint) + unique indexes (not constraints — Prisma creates them as indexes)
ALTER TABLE "employees" RENAME CONSTRAINT "users_pkey" TO "employees_pkey";
ALTER INDEX "users_email_key" RENAME TO "employees_email_key";
ALTER INDEX "users_identification_number_key" RENAME TO "employees_identification_number_key";
ALTER INDEX "users_username_key" RENAME TO "employees_username_key";

-- Step 4: employee_modules constraints (all real constraints: PK + FKs)
ALTER TABLE "employee_modules" RENAME CONSTRAINT "user_modules_pkey" TO "employee_modules_pkey";
ALTER TABLE "employee_modules" RENAME CONSTRAINT "user_modules_user_id_fkey" TO "employee_modules_employee_id_fkey";
ALTER TABLE "employee_modules" RENAME CONSTRAINT "user_modules_module_id_fkey" TO "employee_modules_module_id_fkey";

-- Step 5: password_reset_otps FK constraint + regular index
ALTER TABLE "password_reset_otps" RENAME CONSTRAINT "password_reset_otps_user_id_fkey" TO "password_reset_otps_employee_id_fkey";
ALTER INDEX "password_reset_otps_user_id_idx" RENAME TO "password_reset_otps_employee_id_idx";

-- Step 6: users (formerly service_users) — PK constraint + regular indexes
ALTER TABLE "users" RENAME CONSTRAINT "service_users_pkey" TO "users_pkey";
ALTER INDEX "service_users_is_active_idx" RENAME TO "users_is_active_idx";
ALTER INDEX "service_users_name_idx" RENAME TO "users_name_idx";
