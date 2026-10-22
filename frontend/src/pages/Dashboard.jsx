import { useCallback, useEffect, useState } from "react";

import AppHeader from "../components/AppHeader";
import StatsCards from "../components/StatsCards";
import TranscriptForm from "../components/TranscriptForm";
import TranscriptList from "../components/TranscriptList";

import {
  getTranscripts,
  createTranscript,
  updateTranscript,
  deleteTranscript,
} from "../services/transcriptApi";

const initialForm = {
  title: "",
  text: "",
  language: "auto",
};

export default function Dashboard() {
  const [transcripts, setTranscripts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadTranscripts = useCallback(async () => {
    try {
      setError("");
      const data = await getTranscripts();
      setTranscripts(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load transcripts. Check your connection.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTranscripts();
  }, [loadTranscripts]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.text.trim()) {
      setError("Transcript text cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        title: form.title.trim() || "Untitled transcription",
        text: form.text.trim(),
        language: form.language,
      };

      if (editingId) {
        await updateTranscript(editingId, payload);
      } else {
        await createTranscript(payload);
      }

      setForm(initialForm);
      setEditingId(null);
      await loadTranscripts();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save transcript.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(item) {
    setEditingId(item._id);
    setForm({
      title: item.title || "",
      text: item.text || "",
      language: item.language || "auto",
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this transcript permanently?")) return;

    try {
      setError("");
      await deleteTranscript(id);

      setTranscripts((previous) => previous.filter((item) => item._id !== id));

      if (editingId === id) {
        setEditingId(null);
        setForm(initialForm);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete transcript.");
    }
  }

  const filteredTranscripts = transcripts.filter((item) => {
    const query = search.toLowerCase();

    return (
      (item.title || "").toLowerCase().includes(query) ||
      (item.text || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="app-shell">
      <AppHeader />

      <main className="dashboard-container">
        <section className="welcome-section">
          <div>
            <span className="eyebrow">WORKSPACE OVERVIEW</span>
            <h1>Your transcription workspace</h1>
            <p>Manage your speech transcripts in one simple workspace.</p>
          </div>
          <div className="welcome-decoration" aria-hidden="true">
            <span>〰</span>
            <span>◉</span>
            <span>〰</span>
          </div>
        </section>

        <StatsCards transcripts={transcripts} />

        <TranscriptForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          editingId={editingId}
          saving={saving}
          error={error}
          onCancel={() => {
            setEditingId(null);
            setForm(initialForm);
            setError("");
          }}
          onTranscriptChange={(text, append = false) => {
            console.log("onTranscriptChange called:", { text, append });
            setForm((previous) => ({
              ...previous,
              text: append
                ? previous.text
                  ? previous.text + " " + text
                  : text
                : text,
            }));
          }}
        />

        <TranscriptList
          transcripts={filteredTranscripts}
          loading={loading}
          search={search}
          onSearchChange={setSearch}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={loadTranscripts}
        />
      </main>

      <footer className="app-footer">
        SpeechFlow <span>·</span> Built with React and MongoDB
      </footer>
    </div>
  );
}
