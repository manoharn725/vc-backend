const sql = require("../db/pg");

// Create a new PIN entry or Update PIN
const upsertPin = async (userId, pinCode, expiresAt) => {
    const result = await sql.query(`
        INSERT INTO pin_generator(user_id, pin_code, expires_at) 
        VALUES($1, $2, $3)
        ON CONFLICT(user_id)
        DO UPDATE SET pin_code = EXCLUDED.pin_code, expires_at = EXCLUDED.expires_at, used = FALSE, created_at = CURRENT_TIMESTAMP 
        RETURNING *;
        `, [userId, pinCode, expiresAt]);
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

// Delete PIN by userId (used when email send fails) & after reset password
const deletePinByUserId = async (userId) => {
    const result = sql.query(`DELETE FROM pin_generator WHERE user_id = $1`, [userId]);
}

module.exports = { upsertPin, getValidPinByCode, markPinUsed, deletePinByUserId }