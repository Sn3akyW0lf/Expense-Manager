const User = require('../models/user');
const sequelize = require('../util/database');
const Sib = require('sib-api-v3-sdk');
require('dotenv').config();



exports.forgotPassword = async (req, res, next) => {

    try {
        console.log(req.body.email);

        const client = Sib.ApiClient.instance;

        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY;

        const tranEmailAPI = new Sib.TransactionalEmailsApi();

        const sender = {
            email: 'techfishmap@gmail.com'
        }

        const receiver = [
            {
                email: `${req.body.email}`
            }
        ];

        const result = await tranEmailAPI.sendTransacEmail({
            sender,
            to: receiver,
            subject: 'Password Recovery for the Expense Tracker',
            textContent: `
        This is a Dummy mail to you about Forgotten Password.
        `
        });

        console.log(result);

    } catch (err) {
        console.log(err);
    }
    


};
