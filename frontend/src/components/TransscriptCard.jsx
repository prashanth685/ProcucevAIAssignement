export default function TranscriptCard({ item, onEdit, onDelete }) {
  return (
    <article className="transcript-card">
      <div className="transcript-card-content">
        <div className="transcript-card-heading">
          <h3>{item.title || "Untitled transcription"}</h3>
          <span className="language-badge">{item.language || "auto"}</span>
        </div>

        <p className="transcript-date">
          {item.createdAt
            ? new Date(item.createdAt).toLocaleString()
            : "Date unavailable"}
        </p>

        <p className="transcript-text">{item.text}</p>

        <div className="transcript-meta">
          <span>
            {item.text.trim().split(/\s+/).filter(Boolean).length} words
          </span>
          <span>•</span>
          <span>
            Updated{" "}
            {item.updatedAt
              ? new Date(item.updatedAt).toLocaleDateString()
              : "—"}
          </span>
        </div>
      </div>

      <div className="card-actions">
        <button
          className="button button-secondary button-small"
          type="button"
          onClick={() => onEdit(item)}
        >
          Edit
        </button>

        <button
          className="button button-danger button-small"
          type="button"
          onClick={() => onDelete(item._id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
