import TranscriptCard from "../components/TransscriptCard";

export default function TranscriptList({
  transcripts,
  loading,
  search,
  onSearchChange,
  onEdit,
  onDelete,
  onRefresh,
}) {
  return (
    <section className="history-section">
      <div className="history-heading">
        <div>
          <span className="eyebrow">YOUR LIBRARY</span>
          <h2>Transcript history</h2>
          <p>Find and manage your saved conversations.</p>
        </div>

        <button
          className="button button-secondary"
          type="button"
          onClick={onRefresh}
        >
          ↻ Refresh
        </button>
      </div>

      <div className="history-toolbar">
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title or transcript..."
            aria-label="Search transcripts"
          />
        </label>

        <span className="results-count">{transcripts.length} records</span>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="loading-spinner" />
          <p>Loading your transcripts...</p>
        </div>
      ) : transcripts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">▤</div>
          <h3>No transcripts found</h3>
          <p>Your saved transcripts will appear here.</p>
        </div>
      ) : (
        <div className="transcript-list">
          {transcripts.map((item) => (
            <TranscriptCard
              key={item._id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
