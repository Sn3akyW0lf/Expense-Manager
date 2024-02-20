const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('authorization');
        console.log('token: ', token);

        const userId = jwt.verify(token, 'sxkfrotzza4y78bdhpm1ie8stz4gukkofdr5ugmo3t78h');

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