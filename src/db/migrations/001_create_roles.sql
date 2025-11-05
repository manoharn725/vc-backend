CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL,
  role_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (role_name, role_description)
VALUES
  ('superadmin', 'Has all access and management rights'),
  ('admin', 'Can manage users and system data'),
  ('staff', 'Regular staff member'),
  ('visitor', 'Guest user with limited access');
