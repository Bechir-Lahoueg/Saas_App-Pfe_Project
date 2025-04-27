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
