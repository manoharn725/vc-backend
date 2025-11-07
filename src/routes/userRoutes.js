const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware')
const { fetchUsers, signup, signin, signout, resetPassword, changeUserRole, changeUserAccountStatus } = require('../controllers/userController');

router.get('/', fetchUsers);
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', authenticateToken, signout);
router.put('/reset-password', authenticateToken, resetPassword);

// Role & Status update routes (protected)
router.put('/change-role', authenticateToken, changeUserRole);
router.put('/change-status', authenticateToken, changeUserAccountStatus);

module.exports = router;