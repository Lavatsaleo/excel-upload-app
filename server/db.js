const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'Leon',
  password: 'Gianna',
  database: 'exceldb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
