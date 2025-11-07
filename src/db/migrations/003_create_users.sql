CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    -- personal details
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
    user_email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15),

    -- authentication
    password TEXT NOT NULL,
    password_hash TEXT NOT NULL,

    -- role, status, approvals
    role_id INTEGER REFERENCES roles(id) DEFAULT 4,        -- visitor
    account_status_id INTEGER REFERENCES account_statuses(id) DEFAULT 1,   -- pending

    -- Approval tracking
    role_approved_by INT REFERENCES users(id),
    role_approved_at TIMESTAMP,
    account_status_approved_by INT REFERENCES users(id),
    account_status_approved_at TIMESTAMP,

    -- timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    last_login TIMESTAMP,
    last_logout TIMESTAMP
);


-- Insert dummy user data
INSERT INTO users (
    first_name, 
    last_name, 
    user_email, 
    phone_number,
    password, 
    password_hash, 
    role_id, 
    account_status_id, 
    role_approved_by,
    role_approved_at,
    account_status_approved_by,
    account_status_approved_at,
    created_at, 
    updated_at, 
    last_login, 
    last_logout
) VALUES
('Nandan', 'Ninganna', 'nandan@gmail.com', '9900990099', 
 'nandan123', '$2b$10$L8pVEzqs6wtPXuwdJVkIUeyFHtCSy9D8rrkZKhxpYnAQbAs4KrTK.', 
 4, 1, 2, NULL, 2, NULL,
 '2025-09-13 22:39:24.534', '2025-09-23 23:52:38.674', '2025-09-29 01:08:27.985', '2025-09-26 11:16:40.344'),

('Manohar', 'Ninganna', 'manohar@gmail.com', '9900424322', 
 'manohar123', '$2b$10$8DB6HbKMhS7BmwZN6h6D/OriC.hhNq79i5U8lEdSCFfeU4MjHCVsq', 
 4, 1, NULL, NULL, 2, NULL,
 '2025-09-23 23:53:36.438', NULL, '2025-11-05 00:23:16.874', '2025-11-05 00:23:35.915'),

('Vijay', NULL, 'vijay@gmail.com', NULL, 
 'vijay123', '$2b$10$vuO8M1vPf0Z0fIs.fn8LZedcCO5.hIFZvTebtwqJk3ESe9DG1jK/u', 
 4, 1, NULL, NULL, 2, NULL,
 '2025-09-23 23:53:56.498', NULL, '2025-10-26 00:49:17.616', '2025-10-26 00:49:22.435'),

('Saravanan', NULL, 'saravanan@gmail.com', NULL, 
 'saravanan123', '$2b$10$s2MrLx3aImjvRKu5H7cdde4Et8YckINwwO1syJ1CqugHKI1Rdx46u', 
 4, 1, NULL, NULL, 2, NULL,
 '2025-09-23 23:54:27.333', NULL, '2025-09-29 01:05:34.716', NULL);
