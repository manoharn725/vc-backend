const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware')
const { signup, signin, signout, resetPassword, fetchUsers } = require('../controllers/userController');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', authenticateToken, signout);
router.put('/reset-password', authenticateToken, resetPassword);
router.get('/', fetchUsers);

module.exports = router;