/*
  # Create Laptop Assets Table

  1. New Tables
    - `laptop_assets`
      - `id` (text, primary key) - Unique short identifier for each asset
      - `laptop_details` (text) - Laptop model and details
      - `serial_number` (text) - Laptop serial number
      - `employee_id` (text) - Employee identification number
      - `contact_number` (text) - Employee contact phone number
      - `employee_email` (text) - Employee email address
      - `support_contact` (text) - IT support contact number
      - `company_link` (text) - Company details/support URL
      - `generated_at` (timestamptz) - When the QR code was generated
      - `created_at` (timestamptz) - When the record was created in database

  2. Security
    - Enable RLS on `laptop_assets` table
    - Add policy for public read access (since QR codes need to be scanned by anyone)
    - Add policy for public insert access (no authentication required)

  3. Indexes
    - Index on `serial_number` for faster lookups
    - Index on `employee_id` for reporting purposes

  4. Important Notes
    - No authentication required as this is a public QR code system
    - RLS is enabled but policies allow public access for read and insert
    - Short IDs are used to keep QR codes compact
*/

CREATE TABLE IF NOT EXISTS laptop_assets (
  id text PRIMARY KEY DEFAULT substr(md5(random()::text || clock_timestamp()::text), 1, 10),
  laptop_details text NOT NULL,
  serial_number text NOT NULL,
  employee_id text NOT NULL,
  contact_number text NOT NULL,
  employee_email text NOT NULL,
  support_contact text NOT NULL,
  company_link text NOT NULL,
  generated_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE laptop_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read laptop assets"
  ON laptop_assets
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert laptop assets"
  ON laptop_assets
  FOR INSERT
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_laptop_assets_serial_number 
  ON laptop_assets(serial_number);

CREATE INDEX IF NOT EXISTS idx_laptop_assets_employee_id 
  ON laptop_assets(employee_id);
