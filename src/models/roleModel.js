const sql = require("../db/pg");

// Get all roles
const getAllRoles = async () => {
    const result = await sql.query(`SELECT * FROM roles ORDER BY id ASC`);
    return result.rows;
}

// Get role by id
const getRoleById = async (id) => {
    const result = await sql.query(`SELECT * FROM roles WHERE id = $1`, [id]);
    return result.rows[0]
}

// Create new role
const createRole = async (roleName, description) => {
    const createdAt = new Date();
    const result = await sql.query(`INSERT INTO roles (role_name, description, created_at) 
        VALUES($1, $, $3) RETURNING id, role_name, descripation`,
        [roleName, description, createdAt]);
    return result.rows[0];
};

module.exports = { getAllRoles, getRoleById, createRole };