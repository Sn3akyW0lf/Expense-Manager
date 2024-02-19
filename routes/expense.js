const path = require('path');

const express = require('express');

const expenseController = require('../controllers/expense');

const router = express.Router();

router.get('/get-expenses', expenseController.getExpenses);

router.post('/add-expense', expenseController.postAddExpense);

router.post('/delete-expense/:expId', expenseController.postDeleteExpense);

module.exports = router;