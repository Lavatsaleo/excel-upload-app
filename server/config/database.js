// server/config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('exceldb', 'Leon', 'Gianna', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
