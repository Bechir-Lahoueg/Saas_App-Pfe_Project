CREATE TABLE reservations (
                              id                  BIGSERIAL PRIMARY KEY,
                              service_id          BIGINT    NOT NULL,
                              employee_id         BIGINT,
                              start_time          TIMESTAMP NOT NULL,
                              end_time          TIMESTAMP NOT NULL ,
                              number_of_attendees INTEGER   NOT NULL,
                              CONSTRAINT fk_res_service  FOREIGN KEY (service_id)  REFERENCES services(id),
                              CONSTRAINT fk_res_employee FOREIGN KEY (employee_id) REFERENCES employees(id)
);
