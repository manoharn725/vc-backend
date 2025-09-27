const bcrypt = require('bcryptjs');
const generateToken = require("../utils/generateToken");
const { createUser, findUserByEmail, updateUserPassword, updateLastLogin, updateLastLogout, getAllUsers } = require('../models/userModel');

const signup = async (req, res, next) => {
    try {
        const { userName, userEmail, userPassword, isAdmin } = req.body;

        // 1. check if user exists
        const existingUser = await findUserByEmail(userEmail);
        if (existingUser) {
            return res.status(400).json({ error: "user already exists" })
        }

        //2. Has Password
        const hashedPassword = await bcrypt.hash(userPassword, 10);

        // 3.Save User
        const newUser = await createUser(userName, userEmail, hashedPassword, userPassword, isAdmin);
        res.status(201).json({ message: 'signup Successful', user: newUser })
    } catch (err) {
        next(err);//pass error to middleware
    }
};

const signin = async (req, res, next) => {
    try {
        const { userEmail, userPassword } = req.body;

        // 1. Find user
        const user = await findUserByEmail(userEmail);
        if (!user) {
            return res.status(400).json({ err: "user not found!" })
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(userPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ err: "invalid credentials" })
        }

        // 3. Update last login time
        await updateLastLogin(userEmail);

        // 4. Generate token
        const token = generateToken(user);

        res.status(200).json({
            message: "login successful",
            user: { id: user.id, userName: user.user_name, userEmail: user.user_email, isAdmin: user.is_admin, lastLogin: user.last_login, lastLogout: user.last_logout },
            token
        })
    } catch (err) {
        console.log(err);
        next(err);////pass error to middleware
    }
}

const signout = async (req, res, next) => {
    try {
        const userEmail = req.user.email; //From authentication middleware

        await updateLastLogout(userEmail);

        res.status(200).json({
            message: "Logout Successfully",
            logoutTime: new Date()
        })
    } catch (err) {
        console.log(err);
        next(err);
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { userEmail, oldPassword, newPassword } = req.body;

        // 1. Check if user exists
        const user = await findUserByEmail(userEmail);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // 2. Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: "Old password is incorrect" });
        }

        // 3. Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await updateUserPassword(userEmail, hashedPassword, newPassword);
        res.status(200).json({ message: "Password updated successful", user: updatedUser })
    } catch (err) {
        next(err)
    }
}

const fetchUsers = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.status(200).json({ message: 'get All Users Data', users: users })
    } catch (err) {
        next(err);//pass error to middleware
    }
}

module.exports = { signup, signin, signout, resetPassword, fetchUsers };