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

        console.log(user.toJSON());
        // userJS = user.toJSON();

        res.json({createdUser: user});

    } catch (err) {
        console.log('Error Occurred');

        res.status(500).json(err);
    }

}