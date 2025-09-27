const sql = require("../db/pg");

// Create a new user(signup)
const createUser = async (userName, userEmail, hashedPassword, userPassword, isAdmin=false) => {
    const createdAt = new Date()
  const result = await sql.query(
    `INSERT INTO users (user_name, user_email, password_hash, password, is_admin, created_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, user_name, user_email, is_admin, created_at`,
    [userName, userEmail, hashedPassword, userPassword, isAdmin, createdAt]
  );
  return result.rows[0];
};

// Find user by email (for signup check & login)
const findUserByEmail = async (userEmail) => {
  const result = await sql.query(
    `SELECT * FROM users WHERE user_email = $1`,
    [userEmail]
  );
  return result.rows[0];
};

// Update user Password
const updateUserPassword = async (userEmail, hashedPassword, newPassword) => {
    const updatedAt = new Date()
    const result = await sql.query(
        `UPDATE users SET password_hash = $1, updated_at = $2, password = $3
        WHERE user_email = $4
        RETURNING id, user_name, user_email, is_admin, created_at, updated_at`,
        [hashedPassword, updatedAt, newPassword, userEmail]
    );
    return result.rows[0];
}

//Update last login time
const updateLastLogin =  async (userEmail) => {
  const lastLogin = new Date();
  const result = await sql.query(
    `UPDATE users SET last_login = $1 WHERE user_email = $2
    RETURNING id, user_name, user_email, last_login, last_logout`, [lastLogin, userEmail]
  )
}

//Update last logout time
const updateLastLogout = async(userEmail) => {
  const lastLogout = new Date();
  const result = sql.query(
    `UPDATE users SET last_logout = $1 WHERE user_email = $2
    RETURNING id, user_name, user_email, last_login, last_logout`, [lastLogout, userEmail]
  )
}

// Get all user
const getAllUsers = async () => {
  const result = await sql.query(`SELECT * FROM users ORDER BY id DESC`);
  return result.rows;
};

module.exports = { createUser, findUserByEmail, updateUserPassword, updateLastLogin, updateLastLogout, getAllUsers };
