/*
  # Add Asset Type Column to Laptop Assets Table

  1. Changes
    - Add `asset_type` column to `laptop_assets` table
    - Column stores the type of asset (Laptop, Desktop, Tablet, etc.)
    - Default value: 'Laptop' for backward compatibility with existing records

  2. Important Notes
    - Uses ALTER TABLE with IF NOT EXISTS check to prevent errors
    - Handles existing records by setting default to 'Laptop'
    - Non-nullable column with default value
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'laptop_assets' AND column_name = 'asset_type'
  ) THEN
    ALTER TABLE laptop_assets ADD COLUMN asset_type text NOT NULL DEFAULT 'Laptop';
  END IF;
END $$;
