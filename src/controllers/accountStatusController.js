const { getAllAccountStatuses, getAccountStatusById, createAccountStatus, updateAccountStatusById, deleteAccountStatusById } = require("../models/accountStatusModel");

// Get all status
const getAccountStatuses = async (req, res, next) => {
    try {
        const accountStatuses = await getAllAccountStatuses();
        res.status(200).json({ success: true, message: "status", accountStatuses: accountStatuses })
    } catch (err) {
        console.error("Status error", err);
        next(err);
    }
}

// Get account status
const getAccountStatus = async (req, res, next) => {
    try {
        const { id } = req.params.id;
        const accountStatus = await getAccountStatusById(id);
        res.status(200).json({ success: true, message: "Get account status", accountStatus: accountStatus });
    } catch (err) {
        console.error("Account Status Error", err);
        next(err);
    }
}

// add new account status
const addAccountStatus = async (req, res, next) => {
    try {
        const { statusName, statusDescription } = req.body;
        const newAccountStatus = await createAccountStatus(statusName, statusDescription);
        res.status(201).json({ success: true, message: "Created new account status", accountStatus: newAccountStatus });
    } catch (err) {
        console.error("Create Account Status Error", err);
        next(err);
    }
}

// update account status
const updateAccountStatus = async (req, res, next) => {
    try {
        const { id } = req.params.id;
        const updateStatus = await updateAccountStatusById(id);
        res.status(200).json({ success: true, message: "Account status updated", accountStatus: updateStatus })
    } catch (err) {
        console.error("Account status update error", err);
        next(err);
    }
}

// delete account status
const deleteAccountStatus = async (req, res, next) => {
    try {
        const { id } = req.params.id;

        const deleteStatus = await deleteAccountStatusById(id);
        res.status(200).json({ success: true, message: "Account status delete", accountStatus: deleteStatus })

    } catch (err) {
        console.error("account status delete error", err);
        next(err);
    }
}

module.exports = { getAccountStatuses, getAccountStatus, addAccountStatus, updateAccountStatus, deleteAccountStatus }