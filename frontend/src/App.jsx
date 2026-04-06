// App.jsx
import { useState } from "react";
import InputForm from "./components/InputForm";
import SummaryCards from "./components/SummaryCards";
import FilterBar from "./components/FilterBar";
import ResultsTable from "./components/ResultsTable";

const API = "http://localhost:5000/api";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);
  const [results, setResults] = useState([]);
  const [filter, setFilter] = useState("all");

  async function handlePredict(formData) {
    setLoading(true);
    setError("");
    setSummary(null);
    setResults([]);
    setFilter("all");
    try {
      const res = await fetch(`${API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Server error");
      }
      const data = await res.json();
      setSummary(data.summary);
      setResults(data.results);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = results.filter((r) => {
    if (filter === "all") return true;
    if (filter === "safe") return r.chance === "Safe";
    if (filter === "moderate") return r.chance === "Moderate";
    if (filter === "reach") return r.chance === "Reach";
    return true;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0f1e 0%, #0d1526 50%, #0a1020 100%)",
        padding: "40px 16px",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      {/* Subtle grid overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage:
            "linear-gradient(rgba(56,139,253,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,139,253,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#3b82f6",
                boxShadow: "0 0 12px #3b82f6",
              }}
            />
            <span
              style={{
                fontSize: 11,
                letterSpacing: 3,
                color: "#3b82f6",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              IIT Admission Tool
            </span>
          </div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#e2e8f0",
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            GATE College Predictor
          </h1>
          <p style={{ color: "#475569", marginTop: 6, fontSize: 14 }}>
            IIT admission chances based on 2025 COAP/CCMT cutoff data
          </p>
        </div>

        <InputForm onSubmit={handlePredict} loading={loading} />

        {error && (
          <div
            style={{
              marginTop: 16,
              padding: "12px 16px",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 10,
              color: "#f87171",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {summary && (
          <div
            style={{
              marginTop: 32,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <SummaryCards summary={summary} />
            <FilterBar
              filter={filter}
              setFilter={setFilter}
              summary={summary}
            />
            <ResultsTable rows={filtered} />
          </div>
        )}
      </div>
    </div>
  );
}
