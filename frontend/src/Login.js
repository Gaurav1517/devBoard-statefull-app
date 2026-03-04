import React, { useState } from "react";
import api from "./api";

export default function Login({ setLogged }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {

      await api.post("/auth/login", {
        username,
        password
      });

      setLogged(true);
      setError("");

    } catch (err) {

      if (err.response) {
        setError(err.response.data.error || "Login failed");
      } else {
        setError("Server not reachable");
      }

    }
  };

  return (

    <div style={{
      width: "350px",
      margin: "100px auto",
      padding: "30px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      textAlign: "center",
      boxShadow: "0px 0px 10px rgba(0,0,0,0.1)"
    }}>

      <h2>🚀 DevBoard Login</h2>

      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          {error}
        </div>
      )}

      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ width: "100%", padding: "8px" }}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: "100%", padding: "8px" }}
      />

      <br /><br />

      <button
        onClick={login}
        style={{
          width: "100%",
          padding: "10px",
          background: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Login
      </button>

    </div>
  );
}