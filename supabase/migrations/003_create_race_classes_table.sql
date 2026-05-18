-- Create race_classes table
CREATE TABLE IF NOT EXISTS race_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  class_category VARCHAR NOT NULL CHECK (class_category IN ('main-class', 'supporting-class')),
  class_name VARCHAR NOT NULL,
  registration_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE race_classes ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_race_classes_event_id ON race_classes(event_id);
CREATE INDEX idx_race_classes_category ON race_classes(class_category);
CREATE INDEX idx_race_classes_active ON race_classes(is_active);

-- Trigger for race_classes
CREATE TRIGGER update_race_classes_updated_at
  BEFORE UPDATE ON race_classes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
