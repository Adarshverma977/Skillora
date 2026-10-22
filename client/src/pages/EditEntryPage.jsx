
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getEntryById,
  updateEntry,
} from "../services/entryService";
import "./EditEntryPage.css";

const EditEntryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const loadEntry = async () => {
      try {
        const response = await getEntryById(id);
        const entry = response?.data?.entry;

        if (!entry) {
          throw new Error("Learning entry was not found.");
        }

        if (active) {
          setForm({
            topic: entry.topic || "",
            description: entry.description || "",
            studyDurationMinutes: String(
              entry.studyDurationMinutes ?? ""
            ),
            difficulty: entry.difficulty || "Medium",
            learningDate: entry.learningDate
              ? new Date(entry.learningDate)
                .toISOString()
                .slice(0, 10)
              : new Date().toISOString().slice(0, 10),
          });
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
            err.message ||
            "Unable to load this learning entry."
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadEntry();

    return () => {
      active = false;
    };
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.topic.trim() || !form.description.trim()) {
      setError("Topic and description are required.");
      return;
    }

    const duration = Number(form.studyDurationMinutes);

    if (!Number.isInteger(duration) || duration <= 0) {
      setError("Study duration must be a positive whole number.");
      return;
    }

    if (duration > 1440) {
      setError("Study duration cannot exceed 1440 minutes.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateEntry(id, {
        topic: form.topic.trim(),
        description: form.description.trim(),
        studyDurationMinutes: duration,
        difficulty: form.difficulty,
        learningDate: form.learningDate,
      });

      // Return to My Journal after a successful update.
      navigate("/journal", {
        replace: true,
        state: { entryUpdated: true },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update the entry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="create-entry-page">
        <p role="status">Loading learning entry...</p>
      </main>
    );
  }

  if (!form) {
    return (
      <main className="create-entry-page">
        <p role="alert">
          {error || "Learning entry not found."}
        </p>

        <button
          type="button"
          className="create-entry-cancel"
          onClick={() => navigate("/journal")}
        >
          Back to My Journal
        </button>
      </main>
    );
  }

  return (
    <main className="create-entry-page">
      <div className="create-entry-container">
        <button
          type="button"
          className="create-entry-back"
          onClick={() => navigate("/journal")}
        >
          ← Back to My Journal
        </button>

        <header className="create-entry-heading">
          <span>YOUR LEARNING JOURNAL</span>
          <h1>Edit your entry.</h1>
          <p>
            Update your notes and keep your learning journal accurate.
          </p>
        </header>

        <form
          className="create-entry-form"
          onSubmit={handleSubmit}
        >
          {error && (
            <p className="create-entry-error" role="alert">
              {error}
            </p>
          )}

          <div className="create-entry-field">
            <label htmlFor="topic">Topic</label>
            <input
              id="topic"
              name="topic"
              value={form.topic}
              onChange={handleChange}
              minLength={2}
              maxLength={100}
              required
            />
          </div>

          <div className="create-entry-field">
            <label htmlFor="description">
              What did you learn?
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={6}
              maxLength={5000}
              required
            />
          </div>

          <div className="create-entry-grid">
            <div className="create-entry-field">
              <label htmlFor="studyDurationMinutes">
                Study duration (minutes)
              </label>
              <input
                id="studyDurationMinutes"
                name="studyDurationMinutes"
                type="number"
                min="1"
                max="1440"
                step="1"
                value={form.studyDurationMinutes}
                onChange={handleChange}
                required
              />
            </div>

            <div className="create-entry-field">
              <label htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                required
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="create-entry-field">
            <label htmlFor="learningDate">
              Learning date
            </label>
            <input
              id="learningDate"
              name="learningDate"
              type="date"
              value={form.learningDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="create-entry-actions">
            <button
              type="button"
              className="create-entry-cancel"
              onClick={() => navigate("/journal")}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-entry-submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving changes..."
                : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditEntryPage;
