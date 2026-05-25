-- Add column to flag patient records whose birth date was approximated from age.
-- The flag enables a future "needs validation" workflow to confirm exact birth dates later.
ALTER TABLE "users"
  ADD COLUMN "birth_date_approximate" BOOLEAN NOT NULL DEFAULT false;
