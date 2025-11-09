const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware')
const { fetchUsers, signup, signin, signout, forgotPassword, resetPassword, changeUserRole, changeUserAccountStatus } = require('../controllers/userController');

router.get('/', fetchUsers);
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', authenticateToken, signout);
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

// Role & Status update routes (protected)
router.put('/change-role', authenticateToken, changeUserRole);
router.put('/change-status', authenticateToken, changeUserAccountStatus);

module.exports = router;