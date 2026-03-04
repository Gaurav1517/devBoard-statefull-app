const pool = require("../db");

async function createUser(username, password) {

  const result = await pool.query(
    "INSERT INTO users(username,password) VALUES($1,$2) RETURNING *",
    [username, password]
  );

  return result.rows[0];
}

async function findUser(username) {

  const result = await pool.query(
    "SELECT * FROM users WHERE username=$1",
    [username]
  );

  return result.rows[0];
}

module.exports = {
  createUser,
  findUser
};