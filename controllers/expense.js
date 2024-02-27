const Expense = require('../models/expense');
const ExpenseServices = require('../services/expenseServices');
const S3Services = require('../services/S3services');

const sequelize = require('../util/database');
const AWS = require('aws-sdk');
require('dotenv').config();

let ITEMS_PER_PAGE = 10;

exports.getExpenses = async (req, res, next) => {
    try {
        console.log(req.query);
        
        const page = req.query.page || 1;
        ITEMS_PER_PAGE = req.query.rowsize;

        // console.log(req.user.id);
        const data = await req.user.getExpenses({
            offset: (page - 1) * ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE
        });;
        
        let totalItems;
        const total = await req.user.countExpenses();
        totalItems = total;

        return res.status(201).json({
            allExpDetails: data,
            currentPage: parseInt(page),
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            nextPage: parseInt(page) + 1,
            hasPreviousPage: page > 1,
            previousPage: parseInt(page) - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            // userData: user
        });
    } catch (err) {
        console.log(err);
    }
};

exports.postAddExpense = async (req, res, next) => {
    const trans = await sequelize.transaction();
    
    try {
        // console.log(req.body);

        const { amount, description, category } = req.body;

        const data = await req.user.createExpense({
            amount: amount,
            category: category,
            description: description
        }, {
            transaction: trans
        });

        let currExp = parseFloat(req.user.totalExpense) + parseFloat(amount);

        console.log(currExp);

        await req.user.update({
            totalExpense: currExp
        }, {
            transaction: trans
        });

        await trans.commit();

        return res.status(201).json({
            newExpDetail: data
        });

    } catch (err) {
        await trans.rollback();
        console.log(err);
    }
};

exports.postDeleteExpense = async (req, res, next) => {
    const trans = await sequelize.transaction();      
    
    try {
        console.log(req.body);
        const expense = await req.user.getExpenses({
            attributes: [
                'id',
                'amount',
                'userId'
            ],
            where: {
                id: req.body.id
            }
        });

        let newExp = parseFloat(req.user.totalExpense) - parseFloat(expense[0].amount);

        console.log(newExp);
        
        await req.user.update({
            totalExpense: newExp
        }, {
            transaction: trans
        });

        await req.user.removeExpense(expense, {
            transaction :trans
        });

        await trans.commit();

        return res.status(204).json({ success: true, message: 'Deleted Successfully' });

    } catch (err) {
        await trans.rollback();
        console.log(err);
    }
};

exports.getDownload = async (req, res, next) => {
    try {
        const expenses = await ExpenseServices.getExpenses(req);

        // console.log(expenses);

        const strExpense = JSON.stringify(expenses);

        const userId = req.user.id;

        const fileName = `Expenses${userId}/${new Date()}.txt`;

        const fileURL = await S3Services.uploadToS3(strExpense, fileName);

        console.log(fileURL);

        res.status(200).json({ fileURL, success: true });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, fileURL: '' });
    }
};

