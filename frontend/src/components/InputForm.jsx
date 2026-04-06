// InputForm.jsx
import { useState } from "react";

const CATEGORIES = ["GEN", "OBC-NCL", "EWS", "SC", "ST", "PWD"];
const BRANCHES = [
  { label: "All Branches", value: "" },
  { label: "Computer Science", value: "computer" },
  { label: "Artificial Intelligence", value: "artificial intelligence" },
  { label: "Data Science", value: "data science" },
  { label: "Electrical Engineering", value: "electrical" },
  { label: "Electronics & Communication", value: "electronics" },
  { label: "VLSI / Microelectronics", value: "vlsi" },
  { label: "Mechanical Engineering", value: "mechanical" },
  { label: "Civil Engineering", value: "civil" },
  { label: "Chemical Engineering", value: "chemical" },
  { label: "Structural Engineering", value: "structural" },
  { label: "Power Systems / Electronics", value: "power" },
  { label: "Robotics", value: "robotics" },
];

const fieldStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  padding: "10px 14px",
  fontSize: 14,
  color: "#cbd5e1",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
  appearance: "none",
  WebkitAppearance: "none",
};

const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: "#475569",
  marginBottom: 8,
};

export default function InputForm({ onSubmit, loading }) {
  const [score, setScore] = useState("");
  const [category, setCategory] = useState("GEN");
  const [branch, setBranch] = useState("");
  const [focused, setFocused] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ score: parseFloat(score), category, branch });
  }

  const focusStyle = (name) =>
    focused === name
      ? {
          borderColor: "rgba(59,130,246,0.5)",
          boxShadow: "0 0 0 3px rgba(59,130,246,0.1)",
        }
      : {};

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: 28,
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
        }}
      >
        {/* Score */}
        <div>
          <label style={labelStyle}>GATE Score</label>
          <input
            type="number"
            min={100}
            max={1000}
            step={0.01}
            placeholder="e.g. 720"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            onFocus={() => setFocused("score")}
            onBlur={() => setFocused(null)}
            required
            style={{ ...fieldStyle, ...focusStyle("score") }}
          />
        </div>

        {/* Category */}
        <div>
          <label style={labelStyle}>Category</label>
          <div style={{ position: "relative" }}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              onFocus={() => setFocused("cat")}
              onBlur={() => setFocused(null)}
              style={{
                ...fieldStyle,
                ...focusStyle("cat"),
                paddingRight: 36,
                cursor: "pointer",
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} style={{ background: "#0d1526" }}>
                  {c}
                </option>
              ))}
            </select>
            <span
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#475569",
                pointerEvents: "none",
                fontSize: 10,
              }}
            >
              ▼
            </span>
          </div>
        </div>

        {/* Branch */}
        <div>
          <label style={labelStyle}>Branch / Domain</label>
          <div style={{ position: "relative" }}>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              onFocus={() => setFocused("branch")}
              onBlur={() => setFocused(null)}
              style={{
                ...fieldStyle,
                ...focusStyle("branch"),
                paddingRight: 36,
                cursor: "pointer",
              }}
            >
              {BRANCHES.map((b) => (
                <option
                  key={b.value}
                  value={b.value}
                  style={{ background: "#0d1526" }}
                >
                  {b.label}
                </option>
              ))}
            </select>
            <span
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#475569",
                pointerEvents: "none",
                fontSize: 10,
              }}
            >
              ▼
            </span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: 24,
          width: "100%",
          background: loading
            ? "rgba(59,130,246,0.4)"
            : "linear-gradient(135deg, #2563eb, #3b82f6)",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          padding: "13px 0",
          fontSize: 14,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          letterSpacing: 0.5,
          boxShadow: loading ? "none" : "0 4px 24px rgba(59,130,246,0.25)",
          transition: "all 0.2s",
        }}
      >
        {loading ? "Analyzing..." : "Predict My Colleges →"}
      </button>
    </form>
  );
}
