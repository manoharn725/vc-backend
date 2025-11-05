const { getAllRoles, getRoleById, createRole } = require("../models/roleModel");

const getRoles = async (req, res, next) => {
    try {
        const roles = await getAllRoles();
        res.status(200).json({ success: true, message: "Get all roles", roles: roles })
    } catch (err) {
        console.error("Get all roles Error", err);
        next(err);
    }
};

const getRole = async (req, res, next) => {
    try {
        const { id } = req.params.id;

        const role = await getRoleById(id);
        res.status(200).json({ success: true, message: "Get a role", role: role })
    } catch (err) {
        console.error("Get a role error", err);
        next(err);
    }
};

const addRole = async (req, res, next) => {
    try {
        const { roleName, roleDescription } = req.body;

        const newRole = await createRole(roleName, roleDescription);
        res.status(201).json({ success: true, message: "New role created", newRole: newRole });
    } catch (err) {
        console.error("Create role error", err);
        next(err);
    }
}

module.exports = { getRoles, getRole, addRole };