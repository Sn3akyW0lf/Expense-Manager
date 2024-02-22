const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

exports.getLeaderboard = async (req, res, next) => {
    try {
        const usersExpenses = await User.findAll({
            attributes: ['id', 'name', 'totalExpense'],
            group: ['user.id'],
            order: [['totalExpense', 'DESC']]
        });

        console.log(usersExpenses);

        res.status(200).json(usersExpenses);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};