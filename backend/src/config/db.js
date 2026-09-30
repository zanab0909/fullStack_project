const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool to the MySQL database.
// A pool manages multiple connections efficiently,
// so we don't open and close a new connection for every request.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// .promise() lets us use async/await instead of callbacks
const db = pool.promise();

module.exports = db;
