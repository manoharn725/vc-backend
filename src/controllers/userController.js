const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const generateToken = require("../utils/generateToken");
const { getAllUsers, createUser, findUserByEmail, findUserById, updateUserPassword, updateLastLogin, updateLastLogout, updateUserRole, updateUserAccountStatus } = require('../models/userModel');
const { createPin, getValidPinByCode, markPinUsed, deleteExpriedPin } = require("../models/pinGeneratorModel");
const sendMail = require("../utils/sendMail");

const fetchUsers = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.status(200).json({ message: 'get All Users Data', users: users })
    } catch (err) {
        next(err);//pass error to middleware
    }
}

const signup = async (req, res, next) => {
    try {
        const { firstName, lastName, phoneNumber, userEmail, createPassword } = req.body;

        // 1. Basic validation
        if (!firstName?.trim() || !lastName?.trim() || !phoneNumber?.trim() || !userEmail?.trim() || !createPassword?.trim()) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // 2. check if user exists
        const existingUser = await findUserByEmail(userEmail);
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        //3. Has Password
        const hashedPassword = await bcrypt.hash(createPassword, 10);

        // 4. Create User in DB
        const newUser = await createUser(firstName, lastName, phoneNumber, userEmail, hashedPassword, createPassword);

        // 5. Generate token
        const token = generateToken(newUser);

        res.status(201).json({
            success: true, message: 'signup Successful', user: { id: newUser.id, firstName: newUser.first_name, lastName: newUser.last_name, phoneNumber: newUser.phone_number, userEmail: newUser.user_email, createdAt: newUser.created_at },
            token
        })
    } catch (err) {
        console.error("Signup Error", err)
        next(err);//pass error to middleware
    }
};

const signin = async (req, res, next) => {
    try {
        const { userEmail, userPassword } = req.body;

        // 1. Input validation
        if (!userEmail?.trim() || !userPassword?.trim()) {
            return res.status(400).json({ success: false, message: "Email and password are required!" });
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
            user: { id: user.id, firstName: user.first_name, lastName: user.last_name, phoneNumber: user.phone_number, userEmail: user.user_email, role: user.role_id, status: user.status_id, approvedBy: user.approved_by, updatedAt: user.updated_at, lastLogin: user.last_login, lastLogout: user.last_logout },
            token,
        })
    } catch (err) {
        console.error("Signin error", err);
        next(err);//pass error to middleware
    }
}

const signout = async (req, res, next) => {
    console.log('signout request:', req);
    try {
        const userEmail = req.user.email || req.user.user_email; //From authentication middleware

        await updateLastLogout(userEmail);

        res.status(200).json({
            success: true,
            message: "Logout Successfully",
            logoutTime: new Date()
        })
    } catch (err) {
        console.error("Signout Error:", err);
        next(err);//pass error to moddleware
    }
}

// Forgot Password -> Generate PIN + send mail
const forgotPassword = async (req, res, next) => {
    try {

        const { userEmail } = req.body;
        console.log("userEmail:", userEmail)
        const user = await findUserByEmail(userEmail);
        console.log("user:", user)

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" })
        }

        // Generate random 6-digit PIN
        const pinCode = crypto.randomInt(100000, 999999).toString();
        console.log("pincode:", pinCode)

        // Expire in 10 minutes
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        console.log("expiresAt:", expiresAt);
        console.log("userDetailes:", user);

        const generatedPin = await createPin(user.id, pinCode, expiresAt);

        const text = `Your 6-digit password reset code is: ${generatedPin.pin_code}\n\n This Code will expires in 10 minutes.`;
        await sendMail(userEmail, "Password Reset Code", text);

        res.status(200).json({ success: true, message: "reset code pin sent to your email!" });
    } catch (err) {
        console.error("forgot password error:", err);
        next(err);
    }

}

// Verify pin + Reset password
const resetPassword = async (req, res, next) => {
    try {
        const { verificationCode, newPassword } = req.body;
        console.log("pincode:", verificationCode, "newPassword", newPassword);

        // 1. Find a valid PIN to get user
        const validPin = await getValidPinByCode(verificationCode);
        console.log("line151 validPin:", validPin);

        if(!validPin){
            return res.status(404).json({success: false, message:"Invalid or expired PIN!"});
        }

        // 2. Find the user linked with the PIN
        const user = await findUserById(validPin.user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // 3. Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await updateUserPassword(user.user_email, hashedPassword, newPassword);

        // 4. Mark PIN as used(so it can't be reused);
        const usedPin = await markPinUsed(validPin.id);

        // 5. Delete If PIN is used
        if(usedPin){
            console.log("deleting:", usedPin);
          await deleteExpriedPin();
        }
        console.log("response:")
        res.status(200).json({ message: "Password updated successful", user: updatedUser })
    } catch (err) {
        next(err)
    }
}

// Update user role
const changeUserRole = async (req, res, next) => {
    try {
        const { userId, newRoleId } = req.body;
        const adminId = req?.user?.id; //assuming you have JWT middleware(roleapprovedBy)

        if (!userId || !newRoleId || !adminId) {
            return res.status(400).json({ success: false, message: "Moissing required fields!" });
        }

        const updateUser = await updateUserRole(userId, newRoleId, adminId);
        res.status(200).json({ success: true, message: "user role updated successfully!", user: updateUser });
    } catch (err) {
        console.error("change user role error", err);
        next(err);
    }
}

// Update usser account status
const changeUserAccountStatus = async (req, res, next) => {
    try {
        const { userId, newAccountStatusId } = req.body;
        const adminId = req?.user?.id; //assuming you have JWT middleware(accountStatusApprovedBy)

        if (!userId || !newAccountStatusId || !adminId) {
            return res.status(200).json({ success: false, message: "Missing required fields!" });
        }

        const updateUser = await updateUserAccountStatus(userId, newAccountStatusId, adminId);
        res.status(200).json({ success: true, message: "user status updated successfully", user: updateUser });
    } catch (err) {
        console.error("change user account status error", err);
        next(err);
    }
}

module.exports = { fetchUsers, signup, signin, signout, forgotPassword, resetPassword, changeUserRole, changeUserAccountStatus };