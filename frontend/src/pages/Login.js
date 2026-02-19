import { useState } from "react";
import axios from "axios";

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        credentials
      );
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("role", res.data.role);
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div className="card" style={{ width: "100%", maxWidth: "420px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "8px" }}>
          Product Marketplace
        </h2>
        <p
          style={{
            textAlign: "center",
            marginBottom: "24px",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
         
        </p>

        {error && (
          <p style={{ color: "#b91c1c", marginBottom: "12px" }}>{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: 600,
              }}
            >
              Username
            </label>
            <input
              type="text"
              placeholder="e.g. admin_user"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              required
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: 600,
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

      </div>
    </div>
  );
}

export default Login;