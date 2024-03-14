const User = require('../models/user');
const ForgotPasswordRequests = require('../models/forgotPassword');
const sequelize = require('../util/database');
const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');
const {
    v4: uuidv4
} = require('uuid');

exports.forgotPassword = async (req, res, next) => {

    try {
        // console.log(req.body.email);

        const client = Sib.ApiClient.instance;

        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY;

        const tranEmailAPI = new Sib.TransactionalEmailsApi();

        const sender = {
            email: 'techfishmap@gmail.com'
        }

        const receiver = [{
            email: `${req.body.email}`
        }];

        const uuid = uuidv4();

        console.log(uuid);

        const user = await User.findOne({
            where: {
                email: req.body.email
            },

            attributes: [
                'id', 'name', 'email'
            ]
        });

        const record = await ForgotPasswordRequests.create({
            id: uuid,
            is_active: true,
            userId: user.id
        });

        console.log(user.email);
        const link = `http://13.233.236.151:4000/password/reset-password/${uuid}`;

        const result = await tranEmailAPI.sendTransacEmail({
            sender,
            to: receiver,
            subject: 'Password Recovery for the Expense Tracker',
            textContent: `
        Please follow following link to reset your password - 
        <a href = "${link}">Reset Password</a>
        `
        });

        console.log(result);

        return res.status(201).json({
            success: true,
            message: 'Recovery Mail Sent succesfully!'
        });

    } catch (err) {
        console.log(err);
    }



};

exports.resetPassword = async (req, res, next) => {
    const uuid = req.params.reqId;
    console.log(uuid);
    const record = await ForgotPasswordRequests.findOne({
        where: {
            id: uuid
        }
    });

    console.log(JSON.stringify(record));

    if (record.is_active) {
        res.send(
            `
            <!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>
                    Account Recovery
                </title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9"
                    crossorigin="anonymous">
                <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm"
                    crossorigin="anonymous"></script>
            </head>

            <div class="container">
                <div class="card p-3 m-3">
                    <h2 class="card-header">Account Recovery</h2>
                    <div class="card-body">
                        <span class="card-text">
                            Enter New Password for your Account
                        </span>
                    </div>
                </div>
                <form id="my-form" class="text-bg-secondary bg-opacity-20 border border-dark border-size-3 rounded-3 p-5 m-3"
                    method="POST">
                    <div>
                        <div id="msg_password"></div>
                        <label for="password" class="form-label">Enter New Password</label>
                        <input type="password" name="password" id="password" class="form-control text-bg-light form-control-sm">
                        <div id="msg_dup"></div>
                    </div>
                    <input type="submit" value="CHANGE PASSWORD" class="btn btn-success btn-sm btn-outline-light p-3 m-3" />
                </form>
            </div>

            <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js"></script>
            <script>
                const myForm = document.querySelector('#my-form');
                const email = document.getElementById('password');
                const msg_email = document.getElementById('msg_password');

                myForm.addEventListener('submit', onSubmit);

                async function onSubmit(e) {
                    try {
                        e.preventDefault();

                        if (email.value === '') {
                            msg_email.style.color = 'chocolate';
                            msg_email.style.background = 'beige';
                            msg_email.innerHTML = 'Please Enter Password!';
                            setTimeout(() => msg_email.remove(), 3000);
                        } else {
                            console.log(email.value);

                            objUser = {
                                password: email.value
                            };

                            let res = await axios.post('http://13.233.236.151:4000/password/update-password/${uuid}', objUser);

                            console.log(res);
                        }



                    } catch (err) {
                        console.log(err);

                        if (err.response.status === 404) {
                            msg_dup.style.color = 'chocolate';
                            msg_dup.style.background = 'beige';
                            msg_dup.innerHTML = 'The Email is not Registered, Please Register!';
                            setTimeout(() => msg_dup.remove(), 3000);
                        }
                    }
                }
            </script>
            </body>

            </html>
            `
        );
    } else {
        res.sendFile('D:/Sid/Sharpener/AWS/ExpenseManagerFront/Pages/expired-link.html')
    }
};

exports.updatePassword = async (req, res, next) => {
    console.log(req.body, req.params);

    let { password } = req.body;
    const salt = 10;

    let userId = await ForgotPasswordRequests.findOne({
        where: {
            id: req.params.reqId
        }
    });

    let user = await User.findOne({
        where: {
            id: userId.userId
        }
    });

    
    bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
            console.log(err);
        } else {
            await user.update({
                password: hash
            });

            await userId.update({
                is_active: false
            });
            
            return res.send(`
            <!DOCTYPE html>
            <html lang="en">
        
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>
                    Account Recovery
                </title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9"
                    crossorigin="anonymous">
                <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm"
                    crossorigin="anonymous"></script>
            </head>
        
            <div class="container">
                    <div class="card p-3 m-3">
                        <h2 class="card-header">Expired Account Recovery Link</h2>
                        <div class="card-body">
                            <span class="card-text">
                                The Password has been Successfully Reset!
                            </span>
                        </div>
                    </div>
                </div>
        
            </body>
        
            </html>
            `);
        }
    });

    console.log(user);


};
