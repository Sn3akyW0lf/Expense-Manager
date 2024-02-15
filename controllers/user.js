const User = require('../models/user');

exports.postUser = async (req, res, next) => {
    console.log(req.body);

    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let objUser = {
        username: username,
        email: email,
        password: password
    }

    res.status(201).json({ createdUserObject: objUser });
}