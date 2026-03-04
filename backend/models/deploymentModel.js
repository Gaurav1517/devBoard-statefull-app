const pool = require("../db");

async function createDeployment(projectId, version, status){

  const result = await pool.query(
    "INSERT INTO deployments(project_id,version,status) VALUES($1,$2,$3) RETURNING *",
    [projectId, version, status]
  );

  return result.rows[0];
}

async function getDeployments(projectId){

  const result = await pool.query(
    "SELECT * FROM deployments WHERE project_id=$1",
    [projectId]
  );

  return result.rows;
}

module.exports = {
  createDeployment,
  getDeployments
};