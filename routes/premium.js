const path = require('path');

const express = require('express');

const premiumController = require('../controllers/premium');

const userAuth = require('../middleware/auth');

const router = express.Router();

router.get('/show-leaderboard', userAuth.authenticate, premiumController.getLeaderboard);

module.exports = router;