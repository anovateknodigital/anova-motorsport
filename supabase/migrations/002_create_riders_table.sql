-- Create riders table
CREATE TABLE IF NOT EXISTS riders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  city VARCHAR NOT NULL,
  team_name VARCHAR NOT NULL,
  birth_place VARCHAR NOT NULL,
  birth_date DATE NOT NULL,
  kis_number VARCHAR,
  kta_number VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_riders_manager_id ON riders(manager_id);
CREATE INDEX idx_riders_kis_number ON riders(kis_number);
CREATE INDEX idx_riders_kta_number ON riders(kta_number);

-- Trigger for riders
CREATE TRIGGER update_riders_updated_at
  BEFORE UPDATE ON riders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
