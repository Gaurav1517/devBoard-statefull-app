import React, { useState, useEffect } from "react";
import api from "./api";

export default function Dashboard({ setLogged }) {

  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [env, setEnv] = useState("dev");
  const [deployments, setDeployments] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  /* ---------------- LOAD PROJECTS ---------------- */

  const loadProjects = async () => {
    try {

      const res = await api.get("/projects");
      setProjects(res.data);

    } catch (err) {

      if (err.response && err.response.status === 401) {
        console.log("Session expired");
        setLogged(false);
      } else {
        console.error("Failed to load projects", err);
      }

    }
  };

  /* ---------------- CREATE PROJECT ---------------- */

  const createProject = async () => {

    if (!name.trim()) {
      alert("Project name required");
      return;
    }

    try {

      await api.post("/projects", {
        name,
        environment: env
      });

      setName("");
      loadProjects();

    } catch (err) {
      console.error("Project creation failed", err);
      alert("Failed to create project");
    }
  };

  /* ---------------- DELETE PROJECT ---------------- */

  const deleteProject = async (id) => {

    if (!window.confirm("Delete this project?")) return;

    try {

      await api.delete(`/projects/${id}`);
      loadProjects();

    } catch (err) {

      console.error("Delete failed", err);
      alert("Failed to delete project");

    }
  };

  /* ---------------- UPDATE PROJECT ---------------- */

  const updateProject = async (project) => {

    const newName = prompt("New project name", project.name);

    if (!newName) return;

    try {

      await api.put(`/projects/${project.id}`, {
        name: newName,
        environment: project.environment
      });

      loadProjects();

    } catch (err) {

      console.error("Update failed", err);
      alert("Failed to update project");

    }
  };

  /* ---------------- LOGOUT ---------------- */

  const logout = async () => {

    try {

      await api.post("/auth/logout");
      setLogged(false);

    } catch (err) {

      console.error("Logout failed", err);

    }
  };

  /* ---------------- LOAD DEPLOYMENTS ---------------- */

  const loadDeployments = async (projectId) => {

    try {

      const res = await api.get(`/deployments/${projectId}`);
      setDeployments(res.data);
      setSelectedProject(projectId);

    } catch (err) {

      console.error("Failed to load deployments", err);

    }

  };

  /* ---------------- DEPLOY PROJECT ---------------- */

  const deployProject = async (projectId) => {

    const version = prompt("Enter version (example v1.0)");

    if (!version) return;

    try {

      await api.post(`/deployments/${projectId}`, {
        version
      });

      loadDeployments(projectId);

    } catch (err) {

      console.error("Deployment failed", err);
      alert("Deployment failed");

    }

  };

  /* ---------------- UI ---------------- */

  return (

    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>

      <h1>🚀 DevOps DevBoard</h1>

      <button onClick={logout}>Logout</button>

      <hr />

      <h3>Create Project</h3>

      <input
        placeholder="Project Name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ marginRight: "10px" }}
      />

      <select
        value={env}
        onChange={e => setEnv(e.target.value)}
      >
        <option value="dev">DEV</option>
        <option value="stage">STAGE</option>
        <option value="prod">PROD</option>
      </select>

      <button onClick={createProject} style={{ marginLeft: "10px" }}>
        Create
      </button>

      <hr />

      <h3>Your Projects</h3>

      {projects.length === 0 && <p>No projects yet</p>}

      {projects.map(project => (

        <div
          key={project.id}
          style={{
            border: "1px solid gray",
            padding: "15px",
            margin: "10px 0",
            borderRadius: "6px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >

          <div>
            <b>{project.name}</b>
            <p>Environment: {project.environment}</p>
          </div>

          <div>

            <button
              onClick={() => deployProject(project.id)}
              style={{ marginRight: "10px", background: "#4CAF50", color: "white" }}
            >
              Deploy
            </button>

            <button
              onClick={() => loadDeployments(project.id)}
              style={{ marginRight: "10px" }}
            >
              History
            </button>

            <button
              onClick={() => updateProject(project)}
              style={{ marginRight: "10px" }}
            >
              Edit
            </button>

            <button
              onClick={() => deleteProject(project.id)}
              style={{ background: "#ff4d4f", color: "white" }}
            >
              Delete
            </button>

          </div>

        </div>

      ))}

      <hr />

      <h3>Deployment History</h3>

      {selectedProject === null && <p>Select a project to view deployments</p>}

      {deployments.map(dep => (

        <div
          key={dep.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "5px 0",
            borderRadius: "4px"
          }}
        >

          <b>Version:</b> {dep.version}

          <p>Status: {dep.status}</p>

          <p>Deployed At: {new Date(dep.deployed_at).toLocaleString()}</p>

        </div>

      ))}

    </div>

  );

}