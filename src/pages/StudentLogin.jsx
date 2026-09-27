import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentLogin.css";

function StudentLogin() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {

    e.preventDefault();

    if (
      username === "student" &&
      password === "student123"
    ) {

      // Save student login session
      localStorage.setItem(
        "studentLoggedIn",
        "true"
      );

      // Save student username
      localStorage.setItem(
        "studentUsername",
        username
      );

      navigate("/student");

    } else {

      setError(
        "Invalid username or password"
      );

    }
  };

  return (

    <div className="student-login-page">

      <div className="student-login-card">

        <div className="student-login-icon">
          🎓
        </div>

        <h1>
          Student Login
        </h1>

        <p>
          CertiChain Student Portal
        </p>

        {error && (
          <div className="student-login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <label>
            Username
          </label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            Login →
          </button>

        </form>

        <div className="student-login-info">

          <span>
            Demo Credentials
          </span>

          <small>
            Username: student
          </small>

          <small>
            Password: student123
          </small>

        </div>

        <button
          className="student-back-home"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

      </div>

    </div>

  );
}

export default StudentLogin;