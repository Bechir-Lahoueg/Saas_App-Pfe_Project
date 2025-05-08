CREATE TABLE IF NOT EXISTS media (
                       id BIGSERIAL PRIMARY KEY,
                       url VARCHAR(255) NOT NULL,
                       media_type VARCHAR(255) NOT NULL,
                       public_id VARCHAR(255) NOT NULL,
                       resource_type VARCHAR(255),
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);