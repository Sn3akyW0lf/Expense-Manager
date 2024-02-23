const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ForgotPasswordRequests = sequelize.define('forgotPasswordRequests', {
    id: {
        type:Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    is_active: Sequelize.BOOLEAN
});

module.exports = ForgotPasswordRequests;