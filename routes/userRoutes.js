// routes/userRoutes.js
const express = require('express');
const { signup, login, getMyInfo } = require('../controllers/userController');
const {protect} = require("../middleware/authMiddleware")
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get("/getMyInfo", protect, getMyInfo)

module.exports = router;
