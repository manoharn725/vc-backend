const bcrypt = require('bcryptjs');
const generateToken = require("../utils/generateToken");
const { createUser, findUserByEmail, updateUserPassword, updateLastLogin, updateLastLogout, getAllUsers } = require('../models/userModel');

const signup = async (req, res, next) => {
    try {
        const { firstName, lastName, phoneNumber, userEmail, createPassword, isAdmin=false } = req.body;

        // 1. Basic validation
        if(!firstName?.trim() || !lastName?.trim() || !phoneNumber?.trim() || !userEmail?.trim() || !createPassword?.trim()){
            return res.status(400).json({success: false, message: "All fields are required"});
        }

        // 2. check if user exists
        const existingUser = await findUserByEmail(userEmail);
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        //3. Has Password
        const hashedPassword = await bcrypt.hash(createPassword, 10);

        // 4. Create User in DB
        const newUser = await createUser(firstName, lastName, phoneNumber, userEmail, hashedPassword, createPassword, isAdmin);

        // 5. Generate token
        const token = generateToken(newUser);

        res.status(201).json({ success: true,  message: 'signup Successful', user: {id: newUser.id, firstName: newUser.first_name, lastName: newUser.last_name, phoneNumber: newUser.phone_number, userEmail:newUser.user_email, isAdmin: newUser.is_admin, createdAt: newUser.created_at },
        token })
    } catch (err) {
        console.error("Signup Error", err)
        next(err);//pass error to middleware
    }
};

const signin = async (req, res, next) => {
    try {
        const { userEmail, userPassword } = req.body;

        // 1. Input validation
        if(!userEmail?.trim() || !userPassword?.trim()){
            return res.status(400).json({success: false, message: "Email and password are required!"});
        }

        // 2. Find user
        const user = await findUserByEmail(userEmail);
        if (!user) {
            return res.status(400).json({ success: false, message: "user not found!" })
        }

        // 3. Compare password
        const isMatch = await bcrypt.compare(userPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "invalid credentials" })
        }

        // 4. Update last login time
        await updateLastLogin(userEmail);

        // 5. Generate token
        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: "login successful",
            user: { id: user.id, firstName: user.first_name, lastName: user.last_name, phoneNumber: user.phone_number, userEmail: user.user_email, role: user.role_id, status:user.status_id, approvedBy: user.approved_by, updatedAt: user.updated_at, lastLogin: user.last_login, lastLogout: user.last_logout },
            token,
        })
    } catch (err) {
        console.error("Signin error", err);
        next(err);//pass error to middleware
    }
}

const signout = async (req, res, next) => {
    console.log('signout request:',req);
    try {
        const userEmail = req.user.email; //From authentication middleware

        await updateLastLogout(userEmail);

        res.status(200).json({
            success: true,
            message: "Logout Successfully",
            logoutTime: new Date()
        })
    } catch (err) {
        console.error("Signout Error", err);
        next(err);//pass error to moddleware
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