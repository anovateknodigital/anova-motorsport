-- Drop the unique constraint that prevents a rider from registering for the same class multiple times
-- This is necessary to support the "multiple starts" feature where a rider can buy multiple tickets/starts for the same class.

DROP INDEX IF EXISTS idx_unique_rider_class;
