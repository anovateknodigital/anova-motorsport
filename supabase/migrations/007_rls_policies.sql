-- RLS Policies for riders
-- Managers can view their own riders
CREATE POLICY "Managers can view their own riders"
  ON riders FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE id = riders.manager_id
  ));

-- Managers can insert their own riders
CREATE POLICY "Managers can insert their own riders"
  ON riders FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT id FROM profiles WHERE id = riders.manager_id
  ));

-- Managers can update their own riders
CREATE POLICY "Managers can update their own riders"
  ON riders FOR UPDATE
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE id = riders.manager_id
  ));

-- Managers can delete their own riders
CREATE POLICY "Managers can delete their own riders"
  ON riders FOR DELETE
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE id = riders.manager_id
  ));

-- RLS Policies for rider_class_registrations
-- Managers can view their own rider class registrations
CREATE POLICY "Managers can view their own rider class registrations"
  ON rider_class_registrations FOR SELECT
  USING (auth.uid() IN (
    SELECT p.id FROM profiles p
    JOIN riders r ON r.manager_id = p.id
    WHERE r.id = rider_class_registrations.rider_id
  ));

-- Managers can insert their own rider class registrations
CREATE POLICY "Managers can insert their own rider class registrations"
  ON rider_class_registrations FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT p.id FROM profiles p
    JOIN riders r ON r.manager_id = p.id
    WHERE r.id = rider_class_registrations.rider_id
  ));

-- Managers can update their own rider class registrations
CREATE POLICY "Managers can update their own rider class registrations"
  ON rider_class_registrations FOR UPDATE
  USING (auth.uid() IN (
    SELECT p.id FROM profiles p
    JOIN riders r ON r.manager_id = p.id
    WHERE r.id = rider_class_registrations.rider_id
  ));

-- Managers can delete their own rider class registrations
CREATE POLICY "Managers can delete their own rider class registrations"
  ON rider_class_registrations FOR DELETE
  USING (auth.uid() IN (
    SELECT p.id FROM profiles p
    JOIN riders r ON r.manager_id = p.id
    WHERE r.id = rider_class_registrations.rider_id
  ));

-- RLS Policies for race_classes (public read, admin write)
CREATE POLICY "Anyone can view race classes"
  ON race_classes FOR SELECT
  USING (true);

-- Only authenticated users can manage race classes (admin only via dashboard)
CREATE POLICY "Authenticated users can insert race classes"
  ON race_classes FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update race classes"
  ON race_classes FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete race classes"
  ON race_classes FOR DELETE
  USING (auth.uid() IS NOT NULL);
