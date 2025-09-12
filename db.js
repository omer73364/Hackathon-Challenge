// db.js
const mysql = require("mysql2/promise"); // Using the promise-based API
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

pool.execute(`
    CREATE TABLE IF NOT EXISTS fingerprints (
      id int(11) NOT NULL AUTO_INCREMENT,
      name varchar(255) DEFAULT NULL,
      fingerprint_img varchar(255) NOT NULL,
      matched tinyint(1) NOT NULL,
      score int(11) NOT NULL,
      created_at timestamp NOT NULL DEFAULT current_timestamp(),
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`).then(() => {
  console.log("Table `fingerprints` created if not exist");
}).catch((error) => {
  console.error("Error creating table `fingerprints`: ", error);
});

module.exports = pool;
