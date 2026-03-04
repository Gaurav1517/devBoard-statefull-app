const pool = require("../db");

async function createProject(userId, name, environment) {

  const result = await pool.query(
    "INSERT INTO projects(user_id,name,environment) VALUES($1,$2,$3) RETURNING *",
    [userId, name, environment]
  );

  return result.rows[0];
}

async function getProjects(userId){

  const result = await pool.query(
    "SELECT * FROM projects WHERE user_id=$1",
    [userId]
  );

  return result.rows;
}

async function updateProject(projectId, name, environment) {

  const result = await pool.query(
    "UPDATE projects SET name=$1, environment=$2 WHERE id=$3 RETURNING *",
    [name, environment, projectId]
  );

  return result.rows[0];
}

async function deleteProject(projectId) {

  await pool.query(
    "DELETE FROM projects WHERE id=$1",
    [projectId]
  );

  return true;
}
module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject
};