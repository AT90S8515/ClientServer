const express = require('express');
const router = express.Router();
const auth = require('./auth');

// Routes
router.use('/auth', auth);

module.exports = router;