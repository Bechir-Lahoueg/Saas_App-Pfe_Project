CREATE TABLE services (
                          id                          BIGSERIAL PRIMARY KEY,
                          name                        VARCHAR(200) NOT NULL,
                          description                 TEXT,
                          duration                    INTEGER      NOT NULL,
                          price                       INTEGER      NOT NULL,
                          requires_employee_selection BOOLEAN      NOT NULL DEFAULT FALSE,
                          allow_simultaneous          BOOLEAN      NOT NULL DEFAULT FALSE,
                          capacity                    INTEGER      NOT NULL
);
CREATE TABLE service_employees (
                                   service_id  BIGINT NOT NULL,
                                   employee_id BIGINT NOT NULL,
                                   CONSTRAINT pk_service_employees PRIMARY KEY (service_id, employee_id),
                                   CONSTRAINT fk_se_service
                                       FOREIGN KEY (service_id)
                                           REFERENCES services (id)
                                           ON DELETE CASCADE,
                                   CONSTRAINT fk_se_employee
                                       FOREIGN KEY (employee_id)
                                           REFERENCES employees (id)
                                           ON DELETE CASCADE
);