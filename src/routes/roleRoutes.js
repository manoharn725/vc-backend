const express = require('express');
const router = express.Router();
const { getRoles, getRole, addRole } = require('../controllers/roleController');

router.get('/', getRoles);
router.get('/:id', getRole);
router.post('/', addRole);

module.exports = router;