-- Add province_id and regency_id columns to riders table
ALTER TABLE riders ADD COLUMN IF NOT EXISTS province_id VARCHAR;
ALTER TABLE riders ADD COLUMN IF NOT EXISTS regency_id VARCHAR;
