
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteEntry, getEntryById } from "../services/entryService";
import "./EntryDetailsPage.css";

const EntryDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    const loadEntry = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getEntryById(id);

        if (active) {
          setEntry(response?.data?.entry ?? null);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
            "Unable to load this journal entry."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadEntry();

    return () => {
      active = false;
    };
  }, [id]);

  const formatDate = (value) => {
    if (!value) return "Date not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Date not available";

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const formatDateTime = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Not available";

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const formatDuration = (minutes = 0) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours && remainingMinutes) {
      return `${hours}h ${remainingMinutes}m`;
    }

    if (hours) return `${hours}h`;

    return `${remainingMinutes} min`;
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${entry.topic}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      await deleteEntry(entry._id || entry.id);
      navigate("/journal", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete this entry. Please try again."
      );
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="entry-details-page">
        <div className="entry-details-state" aria-live="polite">
          <span className="entry-details-spinner" />
          <p>Loading entry details...</p>
        </div>
      </main>
    );
  }

  if (error && !entry) {
    return (
      <main className="entry-details-page">
        <Link to="/journal" className="entry-back-link">
          ← Back to My Journal
        </Link>

        <div className="entry-details-state">
          <h2>Unable to open this entry</h2>
          <p>{error}</p>
          <Link to="/journal" className="entry-primary-button">
            Return to journal
          </Link>
        </div>
      </main>
    );
  }

  if (!entry) {
    return (
      <main className="entry-details-page">
        <Link to="/journal" className="entry-back-link">
          ← Back to My Journal
        </Link>
        <div className="entry-details-state">
          <h2>Entry not found</h2>
          <p>This learning entry may have been deleted or is unavailable.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="entry-details-page">
      <Link to="/journal" className="entry-back-link">
        <span aria-hidden="true">←</span>
        Back to My Journal
      </Link>

      <section className="entry-details-hero">
        <div className="entry-details-hero-content">
          <span className="entry-details-eyebrow">
            LEARNING JOURNAL / ENTRY DETAILS
          </span>
          <h1>{entry.topic}</h1>
          <p>
            Review your notes, reflect on what you learned and keep building
            your knowledge.
          </p>
        </div>

        <div className="entry-details-hero-actions">
          <Link
            to={`/learning-entries/${entry._id || entry.id}/edit`}
            className="entry-primary-button"
          >
            Edit entry
          </Link>

          <button
            type="button"
            className="entry-danger-button"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </section>

      {error && (
        <div className="entry-details-error" role="alert">
          {error}
        </div>
      )}

      <section className="entry-details-stats">
        <article className="entry-details-stat-card">
          <span className="entry-details-stat-icon">◷</span>
          <div>
            <p>Study duration</p>
            <strong>
              {formatDuration(entry.studyDurationMinutes)}
            </strong>
          </div>
        </article>

        <article className="entry-details-stat-card">
          <span className="entry-details-stat-icon">◷</span>
          <div>
            <p>Learning date</p>
            <strong>{formatDate(entry.learningDate)}</strong>
          </div>
        </article>

        <article className="entry-details-stat-card">
          <span className="entry-details-stat-icon">✦</span>
          <div>
            <p>Difficulty</p>
            <strong>
              <span
                className={`entry-details-difficulty entry-details-difficulty-${entry.difficulty?.toLowerCase()}`}
              >
                {entry.difficulty || "Medium"}
              </span>
            </strong>
          </div>
        </article>
      </section>

      <section className="entry-details-card">
        <div className="entry-details-section-heading">
          <span className="entry-details-section-icon">✎</span>
          <div>
            <h2>Learning notes</h2>
            <p>Your thoughts and takeaways from this session</p>
          </div>
        </div>

        <div className="entry-details-description">
          {entry.description || "No notes were added to this entry."}
        </div>
      </section>

      <section className="entry-details-metadata">
        <div>
          <span>Created</span>
          <strong>{formatDateTime(entry.createdAt)}</strong>
        </div>

        <div>
          <span>Last updated</span>
          <strong>{formatDateTime(entry.updatedAt)}</strong>
        </div>
      </section>

      <div className="entry-details-footer">
        <Link to="/journal" className="entry-secondary-button">
          ← All journal entries
        </Link>
        <Link
          to={`/learning-entries/${entry._id || entry.id}/edit`}
          className="entry-primary-button"
        >
          Edit this entry
        </Link>
      </div>
    </main>
  );
};

export default EntryDetailsPage;
