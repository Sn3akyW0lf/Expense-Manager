const path = require('path');

const express = require('express');

const expenseController = require('../controllers/expense');

const userAuth = require('../middleware/auth');

const router = express.Router();

router.get('/get-expenses', userAuth.authenticate , expenseController.getExpenses);

router.post('/add-expense', userAuth.authenticate , expenseController.postAddExpense);

router.post('/delete-expense', userAuth.authenticate, expenseController.postDeleteExpense);

router.get('/show-leaderboard', userAuth.authenticate, expenseController.getLeaderboard);

module.exports = router;