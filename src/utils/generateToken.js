const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.user_email, isAdmin: user.is_admin },
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // token valid for 1 day
    )
}

module.exports = generateToken;