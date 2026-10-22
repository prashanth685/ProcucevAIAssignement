const stats = [
  { label: "Total transcripts", icon: "▤", color: "blue" },
  { label: "Languages used", icon: "文", color: "purple" },
  { label: "Storage engine", icon: "◈", color: "green" },
];

export default function StatsCards({ transcripts }) {
  const languages = new Set(transcripts.map((item) => item.language || "auto"))
    .size;

  const values = [transcripts.length, languages, "MongoDB"];

  return (
    <section className="stats-grid">
      {stats.map((stat, index) => (
        <article className="stat-card" key={stat.label}>
          <div className="stat-top">
            <span className="stat-label">{stat.label}</span>
            <span className={`stat-icon ${stat.color}`}>{stat.icon}</span>
          </div>

          <div className="stat-value">{values[index]}</div>

          <p className="stat-caption">
            {index === 0
              ? "Saved in your workspace"
              : index === 1
                ? "Across saved records"
                : "Persistent database"}
          </p>
        </article>
      ))}
    </section>
  );
}
