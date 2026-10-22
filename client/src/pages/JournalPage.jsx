
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEntries, deleteEntry } from "../services/entryService";
import "./JournalPage.css";

const INITIAL_PAGINATION = {
  currentPage: 1,
  pageSize: 10,
  totalEntries: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const JournalPage = () => {
  const [entries, setEntries] = useState([]);
  const [pagination, setPagination] = useState(INITIAL_PAGINATION);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sort, setSort] = useState("newest");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Debounce search input.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch entries using all active filters.
  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getEntries({
        page,
        limit: 10,
        search: search || undefined,
        difficulty: difficulty || undefined,
        sort,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      });

      setEntries(response?.data?.entries ?? []);
      setPagination(response?.pagination ?? INITIAL_PAGINATION);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load your journal entries. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, difficulty, sort, fromDate, toDate]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleDifficultyChange = (value) => {
    setDifficulty(value);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSort(value);
    setPage(1);
  };

  const handleFromDateChange = (value) => {
    setFromDate(value);
    setPage(1);
  };

  const handleToDateChange = (value) => {
    setToDate(value);
    setPage(1);
  };

  const clearDateFilters = () => {
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setSearch("");
    setDifficulty("");
    setFromDate("");
    setToDate("");
    setSort("newest");
    setPage(1);
  };

  const handleDelete = async (entry) => {
    const confirmed = window.confirm(
      `Delete "${entry.topic}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    const id = entry._id || entry.id;
    setDeletingId(id);
    setError("");

    try {
      await deleteEntry(id);

      if (entries.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadEntries();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete this entry. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const formatDuration = (minutes = 0) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours && remainingMinutes) {
      return `${hours}h ${remainingMinutes}m`;
    }

    if (hours) return `${hours}h`;

    return `${remainingMinutes}m`;
  };

  const getEntryId = (entry) => entry._id || entry.id;

  const hasDateFilters = Boolean(fromDate || toDate);
  const hasOtherFilters = Boolean(search || difficulty);
  const hasActiveFilters = hasOtherFilters || hasDateFilters;

  const invalidDateRange = Boolean(
    fromDate && toDate && fromDate > toDate
  );

  return (
    <main className="journal-page">
      <section className="journal-heading">
        <div>
          <span className="journal-eyebrow">YOUR LEARNING SPACE</span>
          <h1>My Journal</h1>
          <p>
            Every session counts. Review your learning journey and keep
            moving forward.
          </p>
        </div>

        <Link to="/learning-entries/new" className="journal-add-button">
          <span aria-hidden="true">+</span>
          Add entry
        </Link>
      </section>

      <section className="journal-summary">
        <div className="journal-summary-icon" aria-hidden="true">
          ✦
        </div>
        <div>
          <span>Total journal entries</span>
          <strong>{pagination.totalEntries}</strong>
        </div>
        <p>Your progress, one entry at a time.</p>
      </section>

      <section className="journal-content">
        <div className="journal-content-heading">
          <div>
            <h2>All entries</h2>
            <p>Search, organize and revisit what you have learned.</p>
          </div>

          <span className="journal-count">
            {pagination.totalEntries}{" "}
            {pagination.totalEntries === 1 ? "entry" : "entries"}
          </span>
        </div>

        <div className="journal-toolbar">
          <label className="journal-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search topics or descriptions..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              aria-label="Search journal entries"
            />

            {searchInput && (
              <button
                type="button"
                className="journal-clear-search"
                onClick={() => setSearchInput("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>

          <label className="journal-select-label">
            <span>Difficulty</span>
            <select
              value={difficulty}
              onChange={(event) =>
                handleDifficultyChange(event.target.value)
              }
            >
              <option value="">All levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>

          <label className="journal-select-label">
            <span>Sort by</span>
            <select
              value={sort}
              onChange={(event) => handleSortChange(event.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>

        {/* Date range filters */}
        <div className="journal-date-filters">
          <div className="journal-date-filters-heading">
            <div>
              <h3>Filter by study date</h3>
              <p>Choose a date range to find specific learning sessions.</p>
            </div>

            {hasDateFilters && (
              <button
                type="button"
                className="journal-clear-dates"
                onClick={clearDateFilters}
              >
                Clear dates
              </button>
            )}
          </div>

          <div className="journal-date-inputs">
            <label className="journal-date-label">
              <span>From date</span>
              <input
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(event) =>
                  handleFromDateChange(event.target.value)
                }
                aria-label="Filter entries from date"
              />
            </label>

            <label className="journal-date-label">
              <span>To date</span>
              <input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(event) =>
                  handleToDateChange(event.target.value)
                }
                aria-label="Filter entries to date"
              />
            </label>
          </div>
        </div>

        {invalidDateRange && (
          <div className="journal-error" role="alert">
            Start date cannot be later than end date.
          </div>
        )}

        {error && (
          <div className="journal-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={loadEntries}>
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="journal-state" aria-live="polite">
            <span className="journal-spinner" />
            <p>Loading your learning journal...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="journal-empty">
            <div className="journal-empty-icon" aria-hidden="true">
              ✎
            </div>

            <h3>
              {hasActiveFilters
                ? "No matching entries"
                : "Your journal starts here"}
            </h3>

            <p>
              {hasActiveFilters
                ? "Try changing your search or filters to find entries."
                : "Capture what you learn, track your study time and build a habit of reflection."}
            </p>

            {hasActiveFilters ? (
              <button
                type="button"
                className="journal-secondary-button"
                onClick={clearAllFilters}
              >
                Clear all filters
              </button>
            ) : (
              <Link
                to="/learning-entries/new"
                className="journal-add-button"
              >
                + Create your first entry
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="journal-table-wrapper">
              <table className="journal-table">
                <thead>
                  <tr>
                    <th>Learning topic</th>
                    <th>Study date</th>
                    <th>Duration</th>
                    <th>Difficulty</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {entries.map((entry) => {
                    const id = getEntryId(entry);

                    return (
                      <tr key={id}>
                        <td>
                          <div className="journal-topic-cell">
                            <span className="journal-topic-icon">
                              {entry.topic?.charAt(0)?.toUpperCase() || "L"}
                            </span>
                            <div>
                              <strong>{entry.topic}</strong>
                              <p>
                                {entry.description?.length > 76
                                  ? `${entry.description.slice(0, 76)}...`
                                  : entry.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td>{formatDate(entry.learningDate)}</td>

                        <td>
                          {formatDuration(entry.studyDurationMinutes)}
                        </td>

                        <td>
                          <span
                            className={`journal-difficulty journal-difficulty-${entry.difficulty?.toLowerCase()}`}
                          >
                            {entry.difficulty || "Medium"}
                          </span>
                        </td>

                        <td>
                          <div className="journal-actions">
                            <Link
                              to={`/learning-entries/${id}`}
                              className="journal-action-link"
                              aria-label={`View ${entry.topic}`}
                              title="View details"
                            >
                              View
                            </Link>

                            <Link
                              to={`/learning-entries/${id}/edit`}
                              className="journal-action-link"
                              aria-label={`Edit ${entry.topic}`}
                              title="Edit entry"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              className="journal-delete-button"
                              disabled={deletingId === id}
                              onClick={() => handleDelete(entry)}
                              aria-label={`Delete ${entry.topic}`}
                            >
                              {deletingId === id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="journal-mobile-list">
              {entries.map((entry) => {
                const id = getEntryId(entry);

                return (
                  <article className="journal-mobile-card" key={id}>
                    <div className="journal-mobile-card-heading">
                      <span className="journal-topic-icon">
                        {entry.topic?.charAt(0)?.toUpperCase() || "L"}
                      </span>

                      <div>
                        <h3>{entry.topic}</h3>
                        <p>{formatDate(entry.learningDate)}</p>
                      </div>

                      <span
                        className={`journal-difficulty journal-difficulty-${entry.difficulty?.toLowerCase()}`}
                      >
                        {entry.difficulty || "Medium"}
                      </span>
                    </div>

                    <p className="journal-mobile-description">
                      {entry.description}
                    </p>

                    <div className="journal-mobile-meta">
                      <span>
                        {formatDuration(entry.studyDurationMinutes)} studied
                      </span>
                    </div>

                    <div className="journal-mobile-actions">
                      <Link to={`/learning-entries/${id}`}>
                        View details
                      </Link>
                      <Link to={`/learning-entries/${id}/edit`}>Edit</Link>
                      <button
                        type="button"
                        disabled={deletingId === id}
                        onClick={() => handleDelete(entry)}
                      >
                        {deletingId === id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="journal-pagination">
              <p>
                Page {pagination.currentPage} of{" "}
                {Math.max(1, pagination.totalPages)}
              </p>

              <div>
                <button
                  type="button"
                  disabled={!pagination.hasPreviousPage || loading}
                  onClick={() => setPage((current) => current - 1)}
                >
                  ← Previous
                </button>

                <button
                  type="button"
                  disabled={!pagination.hasNextPage || loading}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default JournalPage;
