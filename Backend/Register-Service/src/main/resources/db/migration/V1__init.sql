CREATE TABLE notifications (
                               id SERIAL PRIMARY KEY,
                               title VARCHAR(255),
                               message TEXT,
                               "read" BOOLEAN,
                               sending_date TIMESTAMP
);
