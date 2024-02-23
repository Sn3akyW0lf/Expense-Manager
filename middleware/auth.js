const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('authorization');
        // console.log('token: ', token);

        console.log(process.env.TOKEN_SECRET);

        const tk = process.env.TOKEN_SECRET;

        const userId = jwt.verify(token, tk);

        // console.log('userId - ', userId.userId);

        let user = await User.findByPk(userId.userId);

        // console.log(JSON.stringify(user));
        
        req.user = user;

        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false });
    }
}

module.exports = {
    authenticate
}