// ResultsTable.jsx
const CHANCE_STYLE = {
  Safe: {
    bg: "rgba(34,197,94,0.12)",
    color: "#4ade80",
    border: "rgba(34,197,94,0.3)",
  },
  Moderate: {
    bg: "rgba(245,158,11,0.12)",
    color: "#fbbf24",
    border: "rgba(245,158,11,0.3)",
  },
  Reach: {
    bg: "rgba(239,68,68,0.12)",
    color: "#f87171",
    border: "rgba(239,68,68,0.3)",
  },
};

export default function ResultsTable({ rows }) {
  if (rows.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "48px 0",
          color: "#334155",
          fontSize: 14,
        }}
      >
        No colleges match the selected filter.
      </div>
    );
  }

  const thStyle = {
    padding: "12px 16px",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#334155",
    background: "rgba(255,255,255,0.02)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    whiteSpace: "nowrap",
  };

  const tdStyle = {
    padding: "14px 16px",
    fontSize: 13,
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    color: "#94a3b8",
  };

  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.07)",
        overflow: "hidden",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr>
              {[
                "#",
                "College",
                "Program",
                "Cutoff 2025",
                "Your Score",
                "Diff",
                "Probability",
                "Chance",
              ].map((h, i) => (
                <th
                  key={h}
                  style={{
                    ...thStyle,
                    textAlign:
                      i >= 3 && i <= 6 ? "right" : i === 7 ? "center" : "left",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const style = CHANCE_STYLE[r.chance] || {};
              return (
                <tr
                  key={i}
                  style={{ transition: "background 0.15s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.03)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td
                    style={{
                      ...tdStyle,
                      color: "#1e293b",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {i + 1}
                  </td>
                  <td style={{ ...tdStyle, color: "#e2e8f0", fontWeight: 600 }}>
                    {r.college}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      maxWidth: 220,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.program}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {r.actual_cutoff}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {r.your_score}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "right",
                      fontWeight: 700,
                      color: r.difference >= 0 ? "#4ade80" : "#f87171",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {r.difference >= 0 ? "+" : ""}
                    {r.difference}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "right",
                      color: "#60a5fa",
                      fontWeight: 700,
                    }}
                  >
                    {r.probability}%
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        background: style.bg,
                        color: style.color,
                        border: `1px solid ${style.border}`,
                      }}
                    >
                      {r.chance}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
