const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

exports.getLeaderboard = async (req, res, next) => {
    try {
        const users = await User.findAll();
        const expenses = await Expense.findAll();
        const aggExpense = {};
        const userLeader = []

        expenses.forEach((expense) => {
            if (aggExpense[expense.userId]) {
                aggExpense[expense.userId] = aggExpense[expense.userId] + expense.amount;
            } else {
                aggExpense[expense.userId] = expense.amount;
            }
        });

        users.forEach( user => {
            userLeader.push({ name: user.name, totalExp: aggExpense[user.id] || 0 });
        });

        userLeader.sort((a, b) => b.totalExp - a.totalExp);
        console.log(userLeader);
        res.status(200).json(userLeader);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};