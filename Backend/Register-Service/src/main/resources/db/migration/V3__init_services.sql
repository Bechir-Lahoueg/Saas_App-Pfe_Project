CREATE TABLE IF NOT EXISTS services (
                          id                          BIGSERIAL PRIMARY KEY,
                          name                        VARCHAR(200) NOT NULL,
                          description                 TEXT,
                          duration                    INTEGER      NOT NULL,
                          price                       INTEGER      NOT NULL,
                          requires_employee_selection BOOLEAN      NOT NULL DEFAULT FALSE,
                          allow_simultaneous          BOOLEAN      NOT NULL DEFAULT FALSE,
                          capacity                    INTEGER      NOT NULL
);
