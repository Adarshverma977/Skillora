import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getEntries,
  deleteEntry,
} from "../services/entryService";
import "./Dashboard.css";

const PAGE_SIZE = 10;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchEntries = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = {
        page,
        limit: PAGE_SIZE,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (difficulty) {
        params.difficulty = difficulty;
      }

      const response = await getEntries(params);

      setEntries(response?.data?.entries ?? []);
      setPagination(response?.pagination ?? null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load your learning entries. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, search, difficulty]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleDifficultyChange = (event) => {
    setPage(1);
    setDifficulty(event.target.value);
  };

  const handleDeleteEntry = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this learning entry?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");

    try {
      await deleteEntry(id);

      // If the current page becomes empty, move back one page.
      if (entries.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        await fetchEntries();
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

  const formatDuration = (minutes) => {
    const safeMinutes = Number(minutes) || 0;
    const hours = Math.floor(safeMinutes / 60);
    const remainingMinutes = safeMinutes % 60;

    if (hours === 0) return `${remainingMinutes} min`;
    if (remainingMinutes === 0) return `${hours} hr`;

    return `${hours} hr ${remainingMinutes} min`;
  };

  const totalStudyMinutes = entries.reduce(
    (total, entry) =>
      total + (Number(entry.studyDurationMinutes) || 0),
    0
  );

  const totalEntries =
    pagination?.totalEntries ?? entries.length;

  const totalPages =
    pagination?.totalPages ??
    Math.max(1, Math.ceil(totalEntries / PAGE_SIZE));

  const firstVisibleEntry =
    entries.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;

  const lastVisibleEntry =
    (page - 1) * PAGE_SIZE + entries.length;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <a href="/" className="dashboard-logo">
          Skillora<span>.</span>
        </a>

        <div className="dashboard-user">
          <div className="dashboard-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "S"}
          </div>

          <span className="dashboard-user-name">
            {user?.name || "Student"}
          </span>

          <button
            type="button"
            className="dashboard-logout"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-welcome">
          <p className="dashboard-eyebrow">
            YOUR LEARNING SPACE
          </p>

          <h1>
            Welcome back,{" "}
            <span>{user?.name?.split(" ")[0] || "Learner"}</span>!
          </h1>

          <p>
            Keep track of what you learn, reflect on your progress,
            and build consistent learning habits.
          </p>
        </section>

        {/* Dashboard statistics */}
        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <span className="dashboard-stat-icon">📚</span>
            <p>Entries on this page</p>
            <h2>{isLoading ? "—" : entries.length}</h2>
            <span>Currently displayed</span>
          </article>

          <article className="dashboard-stat-card">
            <span className="dashboard-stat-icon">⏱️</span>
            <p>Study time on this page</p>
            <h2>
              {isLoading ? "—" : formatDuration(totalStudyMinutes)}
            </h2>
            <span>Time recorded on this page</span>
          </article>

          <article className="dashboard-stat-card">
            <span className="dashboard-stat-icon">🗂️</span>
            <p>Total entries</p>
            <h2>{isLoading ? "—" : totalEntries}</h2>
            <span>Across your learning journal</span>
          </article>
        </section>

        {/* Learning entries */}
        <section className="dashboard-entries">
          <div className="dashboard-entries-heading">
            <div>
              <h2>Your learning journal</h2>
              <p>Review, search, and manage your learning entries.</p>
            </div>

            <button
              type="button"
              className="dashboard-primary-button"
              onClick={() => navigate("/learning-entries/new")}
            >
              + New entry
            </button>
          </div>

          {/* Search and difficulty filters */}
          <div className="dashboard-filters">
            <form
              className="dashboard-search-form"
              onSubmit={handleSearch}
            >
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search topics or descriptions..."
                aria-label="Search learning entries"
              />

              <button type="submit" disabled={isLoading}>
                Search
              </button>
            </form>

            <select
              value={difficulty}
              onChange={handleDifficultyChange}
              aria-label="Filter by difficulty"
              disabled={isLoading}
            >
              <option value="">All difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            {(search || difficulty) && (
              <button
                type="button"
                className="dashboard-clear-filters"
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                  setDifficulty("");
                  setPage(1);
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          {error && (
            <div
              className="dashboard-feedback dashboard-feedback-error"
              role="alert"
            >
              <p>{error}</p>

              {!isLoading && (
                <button type="button" onClick={fetchEntries}>
                  Try again
                </button>
              )}
            </div>
          )}

          {isLoading && (
            <p className="dashboard-feedback" role="status">
              Loading your learning entries…
            </p>
          )}

          {!isLoading && !error && entries.length === 0 && (
            <div className="dashboard-empty-state">
              <div className="dashboard-empty-icon">✦</div>

              <h2>
                {search || difficulty
                  ? "No matching entries found"
                  : "Your learning journey starts here"}
              </h2>

              <p>
                {search || difficulty
                  ? "Try another search term or change your difficulty filter."
                  : "Record what you learn, capture important takeaways, and reflect on your progress."}
              </p>

              {search || difficulty ? (
                <button
                  type="button"
                  className="dashboard-primary-button"
                  onClick={() => {
                    setSearchInput("");
                    setSearch("");
                    setDifficulty("");
                    setPage(1);
                  }}
                >
                  Clear filters
                </button>
              ) : (
                <button
                  type="button"
                  className="dashboard-primary-button"
                  onClick={() => navigate("/learning-entries/new")}
                >
                  + Create your first entry
                </button>
              )}
            </div>
          )}

          {!isLoading && !error && entries.length > 0 && (
            <>
              <div className="dashboard-entry-list">
                {entries.map((entry) => {
                  const entryId = entry._id || entry.id;

                  return (
                    <article
                      className="dashboard-entry-card"
                      key={entryId}
                    >
                      <div className="dashboard-entry-content">
                        <h3>{entry.topic}</h3>

                        <p>{entry.description}</p>

                        <div className="dashboard-entry-meta">
                          <span>
                            {entry.difficulty || "Difficulty not set"}
                          </span>

                          <span>
                            {formatDuration(entry.studyDurationMinutes)}
                          </span>

                          {entry.learningDate && (
                            <span>
                              {new Date(
                                entry.learningDate
                              ).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          )}
                        </div>

                        <div className="dashboard-entry-actions">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/learning-entries/${entryId}/edit`)
                            }
                          >
                            Edit
                          </button >

                          <button
                            type="button"
                            disabled={deletingId === entryId}
                            onClick={() => handleDeleteEntry(entryId)}
                          >
                            {deletingId === entryId
                              ? "Deleting…"
                              : "Delete"}
                          </button>
                        </div >
                      </div >
                    </article >
                  );
                })}
              </div >

              {/* Pagination */}
              {
                totalPages > 1 && (
                  <div className="dashboard-pagination">
                    <p>
                      Showing {firstVisibleEntry}–{lastVisibleEntry} of{" "}
                      {totalEntries} entries
                    </p>

                    <div className="dashboard-pagination-actions">
                      <button
                        type="button"
                        disabled={isLoading || page <= 1}
                        onClick={() =>
                          setPage((currentPage) => currentPage - 1)
                        }
                      >
                        Previous
                      </button>

                      <span>
                        Page {page} of {totalPages}
                      </span>

                      <button
                        type="button"
                        disabled={isLoading || page >= totalPages}
                        onClick={() =>
                          setPage((currentPage) => currentPage + 1)
                        }
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )
              }
            </>
          )}
        </section >
      </main >
    </div >
  );
};

export default Dashboard;
