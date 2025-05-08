CREATE TABLE IF NOT EXISTS employees (
                           id BIGSERIAL PRIMARY KEY,
                           first_name VARCHAR(100) NOT NULL,
                           last_name  VARCHAR(100) NOT NULL,
                           email      VARCHAR(255) NOT NULL,
                           image_url   VARCHAR(255) NULL,
                           phone      VARCHAR(50),
                           status     VARCHAR(20)  NOT NULL
);
CREATE TABLE IF NOT EXISTS service_employees (
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