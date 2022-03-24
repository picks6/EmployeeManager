// Connect to the database
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  // Your MySQL username,
  user: 'root',
  // Your MySQL password
  password: 'ShinyPsyduck',
  database: 'employee_db'
});

module.exports = db;