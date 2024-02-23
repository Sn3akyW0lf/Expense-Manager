const path = require('path');

const express = require('express');

const passwordController = require('../controllers/password');

const userAuth = require('../middleware/auth');

const router = express.Router();

router.post('/forgot-password', passwordController.forgotPassword);

router.get('/reset-password/:reqId', passwordController.resetPassword);

router.post('/update-password/:reqId', passwordController.updatePassword);

module.exports = router;