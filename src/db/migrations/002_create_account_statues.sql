CREATE TABLE account_statuses (
    id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL,
    status_description TEXT
);

-- Insert default account_statuses
INSERT INTO account_statuses (status_name, status_description)
VALUES
  ('pending', 'Account awaiting approval'),
  ('active', 'Account account is active'),
  ('inactive', 'Account account is disabled');
