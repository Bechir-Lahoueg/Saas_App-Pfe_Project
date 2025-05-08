CREATE TABLE working_days (
                              id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                              day_of_week VARCHAR(20),
                              active BOOLEAN
);

CREATE TABLE working_day_time_slots (
                                        working_day_id BIGINT NOT NULL,
                                        start_time TIME,
                                        end_time TIME,
                                        CONSTRAINT fk_working_day FOREIGN KEY (working_day_id) REFERENCES working_days(id) ON DELETE CASCADE
);

-- Insert default working days
INSERT INTO working_days (day_of_week, active)
VALUES
    ('MONDAY', TRUE),
    ('TUESDAY', TRUE),
    ('WEDNESDAY', TRUE),
    ('THURSDAY', TRUE),
    ('FRIDAY', TRUE),
    ('SATURDAY', TRUE),
    ('SUNDAY', FALSE);

-- Insert default time slots for active days
INSERT INTO working_day_time_slots (working_day_id, start_time, end_time)
SELECT id, TIME '09:00', TIME '17:00'
FROM working_days
WHERE active = TRUE;
