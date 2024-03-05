const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE || 'expense', process.env.DB_USER || 'root', process.env.DB_PASSWORD || 'S!ddh3sh', {
    dialect: 'mysql', 
    host: process.env.DB_HOST || 'localhost'
});

module.exports = sequelize;