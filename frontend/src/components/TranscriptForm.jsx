import LiveMicButton from "./LiveMicButton";
export default function TranscriptForm({
  form,
  onChange,
  onSubmit,
  editingId,
  saving,
  error,
  onCancel,
  onTranscriptChange,
}) {
  return (
    <section className="panel form-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">
            {editingId ? "EDIT RECORD" : "YOUR WORKSPACE"}
          </span>

          <h2>{editingId ? "Edit transcript" : "Create a transcript"}</h2>

          <p>Add, review, and manage your transcription records.</p>
        </div>

        <span className="heading-icon">✎</span>
      </div>

      <form onSubmit={onSubmit} className="transcript-form">
        <div className="field">
          <label htmlFor="title">Transcript title</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={onChange}
            maxLength={120}
            placeholder="e.g. Team meeting notes"
          />
        </div>

        <div className="field">
          <label htmlFor="language">Language</label>
          <select
            id="language"
            name="language"
            value={form.language}
            onChange={onChange}
          >
            <option value="auto">Auto detect</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="kn">Kannada</option>
            <option value="en-hi">Hindi + English</option>
          </select>
        </div>

        <div className="field">
          <div className="label-row">
            <label htmlFor="text">Transcript text</label>
            <span>{form.text.length}/50000</span>
          </div>
          <LiveMicButton
            onTranscriptChange={onTranscriptChange}
            selectedLanguage={form.language === "auto" ? "" : form.language}
          />

          <textarea
            id="text"
            name="text"
            value={form.text}
            onChange={onChange}
            maxLength={50000}
            rows={5}
            required
            placeholder="Enter transcript text here..."
          />
        </div>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button
            className="button button-primary"
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Save changes"
                : "Save transcript"}
          </button>

          {editingId && (
            <button
              className="button button-secondary"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
