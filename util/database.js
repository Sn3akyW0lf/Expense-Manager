const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'S!ddh3sh', {
    dialect: 'mysql', 
    host: 'localhost'
});

module.exports = sequelize;