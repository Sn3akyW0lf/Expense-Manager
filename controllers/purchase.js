const razorPay = require('razorpay');
const Orders = require('../models/order');
require('dotenv').config();


exports.purchaseMembership = async (req, res, next) => {
    try{
        let rzp = new razorPay ({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const amount = 333;

        rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }

            req.user.createOrder({ orderid: order.id, status: 'PENDING' })
            .then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id });
            })
            .catch(err => {
                throw new Error(err);
            })
        });
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something Went Wrong', error: err });
    }
};

exports.postPurchaseSuccess = async (req, res, next) => {
    try {
        console.log(req.body);
        const { payment_id, order_id } = req.body;

        let order = await Orders.findOne({ where: { orderid: order_id } });

        let response = await order.update({ paymentid: payment_id, status: "SUCCESSFUL" });

        await req.user.update({ ispremiumuser: true });

        let user = JSON.stringify(req.user);

        console.log(JSON.stringify(req.user));
        return res.status(201).json({ success: true, message: 'Payment Successful', userDetails: user });
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something Went Wrong', error: err });
    }

};

exports.postPurchaseFail = async (req, res, next) => {
    try {
        console.log(req.body);
        const order_id = req.body.order_id;

        let order = await Orders.findOne({ where : { orderid: order_id } });

        await order.update({ status: "FAILED" });

        return res.status(201).json({ message: 'Payment Failed, Bank Denied Transaction' });

    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something Went Wrong', error: err });
    }
};