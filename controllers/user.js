const User = require('../models/user');

exports.postUser = async (req, res, next) => {

    try {
        // console.log(req.body);

        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.password;

        const user = await User.create({
            name: username,
            email: email,
            password: password
        });

        console.log(user);
        // userJS = user.toJSON();

        res.json({createdUser: user});

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

        console.log(user.length);

        if (user.length) {
            res.status(200).json(user);
        } else{
            res.status(404).json(user);
        }
    } catch (err) {
        console.log(err);
    }
};