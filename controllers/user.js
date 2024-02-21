const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateAccessToken (id) {
    return jwt.sign({ userId: id }, 'sxkfrotzza4y78bdhpm1ie8stz4gukkofdr5ugmo3t78h');
}

exports.postUser = async (req, res, next) => {

    try {
        // console.log(req.body);

        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.password;

        const saltrounds = 10;

        bcrypt.hash(password, saltrounds, async (err, hash) => {
            console.log(err);
            const user = await User.create({
                name: username,
                email: email,
                password: hash,
                ispremiumuser: false
            });
            console.log(user);
            // userJS = user.toJSON();
    
            res.json({createdUser: user});

        });

        // const user = await User.create({
        //     name: username,
        //     email: email,
        //     password: password
        // });



    } catch (err) {
        console.log('Error Occurred');

        res.status(500).json(err);
    }

};

exports.postLogin = async (req, res, next) => {
    try {
        let email = req.body.email;
        let password = req.body.password;

        const user = await User.findAll({
            where: {
                email: email
            }
        });


        // console.log(user[0].password);

        if (user.length) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    throw new Error('Something Went Wrong');
                }
                if (result) {
                    console.log('Correct Password');
                    return res.status(200).json({ success: true, message: 'User Logged in Successfully', token: generateAccessToken(user[0].id) });
                } else {
                    console.log('Wrong Password');
                    return res.status(401).json({ success: false, message: 'Wrong Password' });
                }
            })
        } else {
            res.status(404).json(user);
        }
    } catch (err) {
        console.log(err);
    }
};