const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

exports.getLeaderboard = async (req, res, next) => {
    try {
        const usersExpenses = await User.findAll({
            attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'total_expense']],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['user.id'],
            order: [['total_expense', 'DESC']]
        });

        console.log(usersExpenses);

        res.status(200).json(usersExpenses);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};