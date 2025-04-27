CREATE TABLE employees (
                           id BIGSERIAL PRIMARY KEY,
                           first_name VARCHAR(100) NOT NULL,
                           last_name  VARCHAR(100) NOT NULL,
                           email      VARCHAR(255) NOT NULL,
                           phone      VARCHAR(50),
                           status     VARCHAR(20)  NOT NULL
);
