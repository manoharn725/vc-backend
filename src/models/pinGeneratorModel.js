const sql = require("../db/pg");

// Create a new PIN entry
const createPin = async (userId, pinCode, expiresAt) => {
    const result = await sql.query(` INSERT INTO pin_generator(user_id, pin_code, expires_at) VALUES($1, $2, $3) RETURNING *`, [userId, pinCode, expiresAt]);
    return result.rows[0]
}

// Get a active PIN for user (not expired, not used)
const getValidPinByCode = async (pinCode) => {
    const now = new Date();
    console.log("12 Checking PIN:", pinCode);
    console.log("13 Current time:", now);
    const result = await sql.query(`SELECT * FROM pin_generator WHERE pin_code = $1 AND used = FALSE AND expires_at > $2 LIMIT 1`, [pinCode, now]);
     console.log("15 Query result:", result.rows);
    return result.rows[0];
}

// Mark PIN as used after successful verification
const markPinUsed = async (pinId) => {
    const result = await sql.query(` UPDATE pin_generator SET used = TRUE WHERE id = $1 RETURNING *`, [pinId]);
    return result.rows[0]
}

// Delete all the expired pins
const deleteExpriedPin = async () => {
    const now = new Date();
    const result = await sql.query(` DELETE FROM pin_generator WHERE expires_at <= $1 AND used = TRUE`, [now]);
    return result.rows[0];
}

module.exports = { createPin, getValidPinByCode, markPinUsed, deleteExpriedPin }