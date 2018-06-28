const express = require('express');
const controller = require('./controller');
const router = express.Router();

// Configure route methods
router.route('/login').post(controller.login);
router.route('/register').post(controller.register);

module.exports = router;
