CREATE TABLE IF NOT EXISTS reservations (
                              id                    BIGSERIAL PRIMARY KEY,
                              service_id            BIGINT    NOT NULL,
                              employee_id           BIGINT,
                              start_time            TIMESTAMP NOT NULL,
                              end_time              TIMESTAMP NOT NULL,
                              number_of_attendees   INTEGER   NOT NULL,

                              client_first_name     VARCHAR(255),
                              client_last_name      VARCHAR(255),
                              client_email          VARCHAR(255),
                              client_phone_number   VARCHAR(255),

                              confirmation_code     VARCHAR(255) NOT NULL,
                              status                VARCHAR(10)  NOT NULL,
                              created_at            TIMESTAMP    NOT NULL DEFAULT now(),

                              CONSTRAINT fk_res_service   FOREIGN KEY (service_id)  REFERENCES services(id),
                              CONSTRAINT fk_res_employee  FOREIGN KEY (employee_id) REFERENCES employees(id)
);
