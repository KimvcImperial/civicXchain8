-- File: civixChain-Database/schema.sql

-- Commitments table for storing government/official commitments
CREATE TABLE commitments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_value DECIMAL,
    current_progress DECIMAL DEFAULT 0,
    deadline DATE,
    status VARCHAR(50) DEFAULT 'active',
    official_name VARCHAR(255),
    official_role VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    validation_score DECIMAL DEFAULT 0,
    last_validation TIMESTAMP
);

-- Environmental data from satellites and APIs
CREATE TABLE environmental_data (
    id SERIAL PRIMARY KEY,
    data_type VARCHAR(100), -- 'air_quality', 'forest_cover', 'water_quality'
    location VARCHAR(255),
    value DECIMAL,
    unit VARCHAR(50),
    source VARCHAR(100), -- 'NASA', 'OpenAQ', 'WorldBank'
    timestamp TIMESTAMP DEFAULT NOW(),
    metadata JSONB
);

-- Validation results from oracle checks
CREATE TABLE validation_results (
    id SERIAL PRIMARY KEY,
    commitment_id INTEGER REFERENCES commitments(id),
    validation_score DECIMAL,
    data_sources JSONB,
    verified BOOLEAN DEFAULT FALSE,
    confidence_level DECIMAL,
    validation_details JSONB,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- User/citizen interactions
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    wallet_address VARCHAR(42) UNIQUE,
    username VARCHAR(100),
    role VARCHAR(50) DEFAULT 'citizen', -- 'citizen', 'official', 'validator'
    created_at TIMESTAMP DEFAULT NOW()
);

-- Comments and public feedback
CREATE TABLE commitment_comments (
    id SERIAL PRIMARY KEY,
    commitment_id INTEGER REFERENCES commitments(id),
    user_id INTEGER REFERENCES users(id),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);