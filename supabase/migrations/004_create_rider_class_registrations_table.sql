-- Create rider_class_registrations table
CREATE TABLE IF NOT EXISTS rider_class_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id UUID NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES race_classes(id) ON DELETE CASCADE,
  category VARCHAR NOT NULL CHECK (category IN ('expert', 'novice', 'rookie', 'beginner')),
  motorcycle_brand VARCHAR NOT NULL,
  frame_number VARCHAR NOT NULL,
  engine_number VARCHAR NOT NULL,
  registration_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  payment_status VARCHAR NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE rider_class_registrations ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_rider_class_registrations_rider_id ON rider_class_registrations(rider_id);
CREATE INDEX idx_rider_class_registrations_class_id ON rider_class_registrations(class_id);
CREATE INDEX idx_rider_class_registrations_payment ON rider_class_registrations(payment_status);

-- Add constraint: rider can only register once per class
CREATE UNIQUE INDEX idx_unique_rider_class ON rider_class_registrations(rider_id, class_id);
