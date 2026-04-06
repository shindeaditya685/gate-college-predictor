// SummaryCards.jsx
export default function SummaryCards({ summary }) {
  const cards = [
    {
      label: "Safe Picks",
      value: summary.safe,
      accent: "#22c55e",
      glow: "rgba(34,197,94,0.15)",
      border: "rgba(34,197,94,0.2)",
      icon: "✓",
    },
    {
      label: "Moderate",
      value: summary.moderate,
      accent: "#f59e0b",
      glow: "rgba(245,158,11,0.15)",
      border: "rgba(245,158,11,0.2)",
      icon: "~",
    },
    {
      label: "Reach",
      value: summary.reach,
      accent: "#ef4444",
      glow: "rgba(239,68,68,0.15)",
      border: "rgba(239,68,68,0.2)",
      icon: "↑",
    },
    {
      label: "Total Matched",
      value: summary.total,
      accent: "#3b82f6",
      glow: "rgba(59,130,246,0.15)",
      border: "rgba(59,130,246,0.2)",
      icon: "#",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 12,
      }}
    >
      {cards.map((c) => (
        <div
          key={c.label}
          style={{
            background: c.glow,
            border: `1px solid ${c.border}`,
            borderRadius: 14,
            padding: "20px 16px",
            textAlign: "center",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: c.accent,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {c.icon} {c.label}
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: c.accent,
              lineHeight: 1,
            }}
          >
            {c.value}
          </div>
        </div>
      ))}
    </div>
  );
}
