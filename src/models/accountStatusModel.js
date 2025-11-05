const sql = require('../db/pg');

// Get all statuses
const getAllAccountStatuses = async () => {
    const result = sql.query(`SELECT * FROM account_statuses ORDER BY id ASC`);
    return result.rows;
};

// Get status by id
const getAccountStatusById = async (id) => {
    const result = sql.query(`SELECT * FROM acount_statuses WHERE id = $1`, [id]);
    return result.rows[0];
};

// Create new status
const createAccountStatus = async (statusName, statusDescription) => {
    const result = await sql.query(` INSERT INTO account_statues (status_name, status_description)
        VALUES($1, $2) RETURNING id, status_name, description`, [statusName, statusDescription]);
        return result.rows[0];
}

// Update status
const updateAccountStatusById = async (id, statusName) => {
    const result = await sql.query(` UPDATE account_statuses SET status_name = $1 WHERE id = $2 RETURNING id, status_name`,
        [statusName, id]
    );
    return result.rows[0];
};

// Delete status
const deleteAccountStatusById = async (id) => {
    const result = await sql.query(` DELETE FROM account_statuses WHERE id = $1`, [id]);
    return result > 0;
}

module.exports = { getAllAccountStatuses, getAccountStatusById, createAccountStatus, updateAccountStatusById, deleteAccountStatusById };