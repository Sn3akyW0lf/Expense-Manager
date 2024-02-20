const Expense = require('../models/expense');

exports.getExpenses = async (req, res, next) => {
    try {
        console.log(req.user.id);
        const data = await req.user.getExpenses();

        console.log(data);

        return res.status(201).json({
            allExpDetails: data
        });
    } catch (err) {
        console.log(err);
    }
};

exports.postAddExpense = async (req, res, next) => {
    try {
        // console.log(req.body);

        const body = req.body;
        const amount = body.expense;
        const description = body.exp_desc;
        const category = body.exp_type;

        const data = await req.user.createExpense({
            amount: amount,
            category: category,
            description: description
        });

        return res.status(201).json({
            newExpDetail: data
        });

    } catch (err) {
        console.log(err);
    }
};

exports.postDeleteExpense = async (req, res, next) => {
    try {
        console.log(req.body);
        let expense = await req.user.getExpenses({
            where: {
                id: req.body.id
            }
        });
        console.log(expense);
        await req.user.removeExpense(expense);
        console.log('Success deleting Record');

        return res.status(201).json({ success: true, message: 'Expense Succefully Deleted' })
    } catch (err) {
        console.log(err);
    }
}