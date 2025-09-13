// db.js
const mysql = require("mysql2/promise"); // Using the promise-based API
const runMigration = require("./migration");
require("dotenv").config(); // For environment variables

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

runMigration(pool)

module.exports = pool;
