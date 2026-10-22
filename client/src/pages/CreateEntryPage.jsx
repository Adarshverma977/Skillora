
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { createEntry } from "../services/entryService";
import "./CreateEntryPage.css";

const initialForm = {
  topic: "",
  description: "",
  studyDurationMinutes: "",
  difficulty: "Medium",
  learningDate: new Date().toISOString().slice(0, 10),
};

const CreateEntryPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.topic.trim() || !form.description.trim()) {
      setError("Please enter a topic and description.");
      return;
    }

    const duration = Number(form.studyDurationMinutes);

    if (!Number.isInteger(duration) || duration <= 0) {
      setError(
        "Study duration must be a positive whole number of minutes."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await createEntry({
        topic: form.topic.trim(),
        description: form.description.trim(),
        studyDurationMinutes: duration,
        difficulty: form.difficulty,
        learningDate: form.learningDate,
      });

      showToast("Learning entry created successfully!", "success");

      navigate("/dashboard", {
        replace: true,
        state: { entryCreated: true },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save your entry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="create-entry-page">
      <div className="create-entry-container">
        <button
          type="button"
          className="create-entry-back"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to dashboard
        </button>

        <header className="create-entry-heading">
          <span>YOUR LEARNING JOURNAL</span>
          <h1>Capture what you learned.</h1>
          <p>
            Small learning sessions add up. Record today's progress
            and keep your journey moving.
          </p>
        </header>

        <form className="create-entry-form" onSubmit={handleSubmit}>
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
              placeholder="e.g. JavaScript closures"
              maxLength={120}
              required
            />
          </div>

          <div className="create-entry-field">
            <label htmlFor="description">What did you learn?</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write your key concepts, notes, or takeaways..."
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
                step="1"
                value={form.studyDurationMinutes}
                onChange={handleChange}
                placeholder="e.g. 45"
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
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="create-entry-field">
            <label htmlFor="learningDate">Learning date</label>
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
              onClick={() => navigate("/dashboard")}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-entry-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving entry..." : "Save learning entry"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateEntryPage;
