// routes/accountRoutes.js
const express = require('express');
const { createAccount, getAccountDetails, updateAccount } = require('../controllers/accountController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Update account (e.g., deposit, withdraw)
router.patch('/banking', protect, updateAccount);

module.exports = router;
