
const runMigration = (pool) => {
  pool
    .execute(
      `
    CREATE TABLE IF NOT EXISTS fingerprints_log (
      id int(11) NOT NULL AUTO_INCREMENT,
      name varchar(255) DEFAULT NULL,
      fingerprint_img varchar(255) NOT NULL,
      matched tinyint(1) NOT NULL,
      score int(11) NOT NULL,
      created_at timestamp NOT NULL DEFAULT current_timestamp(),
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`
    )
    .then(() => {
      console.log("Table `fingerprints_log` created if not exist");
    })
    .catch((error) => {
      console.error("Error creating table `fingerprints_log`: ", error);
    });

  // add persons table
  pool
    .execute(
      `
    CREATE TABLE IF NOT EXISTS persons (
      id int(11) NOT NULL AUTO_INCREMENT,
      name varchar(255) NOT NULL,
      birthday date DEFAULT NULL,
      phone varchar(255) DEFAULT NULL,
      address varchar(255) DEFAULT NULL,
      gender varchar(255) NOT NULL,
      image varchar(255) DEFAULT NULL,
      created_at timestamp NOT NULL DEFAULT current_timestamp(),
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`
    )
    .then(() => {
      console.log("Table `persons` created if not exist");
    })
    .catch((error) => {
      console.error("Error creating table `persons`: ", error);
    });

  // add fingerprints table
  pool
    .execute(
      `
    CREATE TABLE IF NOT EXISTS fingerprints (
      id int(11) NOT NULL AUTO_INCREMENT,
      person_id int(11) NOT NULL,
      fingerprint_img varchar(255) NOT NULL,
      created_at timestamp NOT NULL DEFAULT current_timestamp(),
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`
    )
    .then(() => {
      console.log("Table `fingerprints` created if not exist");
    })
    .catch((error) => {
      console.error("Error creating table `fingerprints`: ", error);
    });
};

module.exports = runMigration;
