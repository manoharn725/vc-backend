const sql = require("../db/pg");

// Get all user
const getAllUsers = async () => {
  const result = await sql.query(`SELECT * FROM users ORDER BY id DESC`);
  return result.rows;
};

// Create a new user(signup)
const createUser = async (firstName, lastName, phoneNumber, userEmail, hashedPassword, createPassword) => {
    const createdAt = new Date()
  const result = await sql.query(
    `INSERT INTO users (first_name, last_name, phone_number, user_email, password_hash, password, created_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, first_name, last_name, phone_number, user_email, created_at`,
    [firstName, lastName, phoneNumber, userEmail, hashedPassword, createPassword, createdAt]
  );
  return result.rows[0];
};

// Find user by email (for signup check & login)
const findUserByEmail = async (userEmail) => {
  const result = await sql.query(`SELECT * FROM users WHERE user_email = $1`,[userEmail]);
  return result.rows[0];
};

// Find a user by id
const findUserById = async (id) => {
  const result = await sql.query(` SELECT * FROM users WHERE id = $1`, [id]);
  return result.rows[0];
}

// Update user Password
const updateUserPassword = async (userEmail, hashedPassword, newPassword) => {
    const updatedAt = new Date()
    const result = await sql.query(
        `UPDATE users SET password_hash = $1, updated_at = $2, password = $3
        WHERE user_email = $4
        RETURNING *`,
        [hashedPassword, updatedAt, newPassword, userEmail]
    );
    return result.rows[0];
}

// Update last login time
const updateLastLogin =  async (userEmail) => {
  const lastLogin = new Date();
  const result = await sql.query(
    `UPDATE users SET last_login = $1 WHERE user_email = $2
    RETURNING id, first_name, last_name, user_email, last_login, last_logout`, [lastLogin, userEmail]
  );
  return result.rows[0]
}

// Update last logout time
const updateLastLogout = async(userEmail) => {
  const lastLogout = new Date();
  const result = await sql.query(
    `UPDATE users SET last_logout = $1 WHERE user_email = $2
    RETURNING *`, [lastLogout, userEmail]
  );
  return result.rows[0];
}

// Update user role
const updateUserRole = async (userId, newRoleId, roleApprovedBy) => {
  const roleApprovedAt = new Date();
  const result = await sql.query(` UPDATE users SET role_id = $1 , role_approved_by = $2, role_approved_at = $3 WHERE id = $4 RETURNING *`, [newRoleId, roleApprovedBy, roleApprovedAt, userId]);
  return result.rows[0];
}

// Update user account status
const updateUserAccountStatus = async (userId, newAccountStatusId, accountStatusApprovedBy) => {
  const accountStatusApprovedAt = new Date();
  const result = await sql.query(` UPDATE users SET account_status_id = $1, account_status_approved_by = $2, account_status_approved_at = $3 WHERE id = $4 RETURNING *`, [newAccountStatusId, accountStatusApprovedBy, accountStatusApprovedAt, userId]);
  return result.rows[0];
}

module.exports = { getAllUsers, createUser, findUserByEmail, findUserById, updateUserPassword, updateLastLogin, updateLastLogout, updateUserRole, updateUserAccountStatus };
