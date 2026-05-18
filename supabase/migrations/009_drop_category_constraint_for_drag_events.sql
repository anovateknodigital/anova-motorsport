-- Drop the check constraint and NOT NULL requirement on the category column
-- This allows drag events to have an empty or null category.

ALTER TABLE rider_class_registrations DROP CONSTRAINT IF EXISTS rider_class_registrations_category_check;
ALTER TABLE rider_class_registrations ALTER COLUMN category DROP NOT NULL;
