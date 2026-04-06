// FilterBar.jsx
const FILTERS = [
  { key: "all", label: "All Results" },
  { key: "safe", label: "Safe" },
  { key: "moderate", label: "Moderate" },
  { key: "reach", label: "Reach" },
];

const ACTIVE_COLORS = {
  all: {
    bg: "rgba(59,130,246,0.15)",
    border: "rgba(59,130,246,0.5)",
    text: "#60a5fa",
  },
  safe: {
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.4)",
    text: "#4ade80",
  },
  moderate: {
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.4)",
    text: "#fbbf24",
  },
  reach: {
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.4)",
    text: "#f87171",
  },
};

export default function FilterBar({ filter, setFilter }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {FILTERS.map((f) => {
        const active = filter === f.key;
        const colors = ACTIVE_COLORS[f.key];
        return (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: "7px 18px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              background: active ? colors.bg : "rgba(255,255,255,0.03)",
              border: `1px solid ${active ? colors.border : "rgba(255,255,255,0.08)"}`,
              color: active ? colors.text : "#475569",
              letterSpacing: 0.3,
            }}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
