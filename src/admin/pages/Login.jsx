import { useState } from "react";
import { login } from "../data/auth";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!username || !password) return setError("Username va parol kiriting!");
    setLoading(true);
    setTimeout(() => {
      const session = login(username, password);
      if (session) {
        onLogin(session);
      } else {
        setError("Username yoki parol noto'g'ri!");
        setLoading(false);
      }
    }, 400);
  };

  const inputStyle = {
    background: "#0f1117",
    border: "1px solid #2d3748",
    borderRadius: "8px",
    color: "#e2e8f0",
    fontSize: "14px",
    padding: "10px 14px",
    width: "100%",
    fontFamily: "inherit",
    outline: "none",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#0f1117" }}
    >
      <div
        style={{
          background: "#1a1f2e",
          border: "1px solid #2d3748",
          borderRadius: "16px",
          padding: "2rem",
          width: "100%",
          maxWidth: "360px",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-2xl font-bold mb-1" style={{ color: "#a80000" }}>
            Combo St★r
          </div>
          <div className="text-sm" style={{ color: "#64748b" }}>CRM tizimi</div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-xs block mb-1.5" style={{ color: "#64748b" }}>
              Username
            </label>
            <input
              style={inputStyle}
              placeholder="username kiriting..."
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs block mb-1.5" style={{ color: "#64748b" }}>
              Parol
            </label>
            <input
              type="password"
              style={inputStyle}
              placeholder="parol kiriting..."
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {error && (
            <div
              className="text-sm px-3 py-2 rounded-lg"
              style={{ background: "#3d0d0d", color: "#f87171", border: "1px solid #7f1d1d" }}
            >
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-medium text-white mt-2"
            style={{
              background: loading ? "#6b0000" : "#a80000",
              opacity: loading ? 0.8 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Kirish..." : "Kirish"}
          </button>
        </div>
      </div>
    </div>
  );
}