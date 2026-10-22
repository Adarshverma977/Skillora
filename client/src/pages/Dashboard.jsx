import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import {
  getEntries,
  getEntryAnalytics,
  deleteEntry,
} from "../services/entryService";
import "./Dashboard.css";

const PAGE_SIZE = 10;

const formatDuration = (minutes) => {
  const safeMinutes = Math.max(0, Number(minutes) || 0);
  const hours = Math.floor(safeMinutes / 60);
  const remainingMinutes = safeMinutes % 60;

  if (hours === 0) return `${remainingMinutes} min`;
  if (remainingMinutes === 0) return `${hours} hr`;

  return `${hours} hr ${remainingMinutes} min`;
};

const formatDate = (date, options) => {
  if (!date) return "Date not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date not available";
  }

  return parsedDate.toLocaleDateString("en-IN", options);
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [entries, setEntries] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");
  const [pagination, setPagination] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState(null);

  // Fetch dashboard analytics.
  const fetchAnalytics = useCallback(async () => {
    setIsAnalyticsLoading(true);
    setAnalyticsError("");

    try {
      const response = await getEntryAnalytics();
      const data = response?.data ?? null;

      setAnalytics(data);

      if (!data) {
        setAnalyticsError("Analytics data is unavailable.");
      }
    } catch (err) {
      setAnalyticsError(
        err.response?.data?.message || "Unable to load learning analytics.",
      );
    } finally {
      setIsAnalyticsLoading(false);
    }
  }, []);

  // Fetch journal entries with pagination and filters.
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
          "Unable to load your learning entries. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, search, difficulty]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Search journal entries.
  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  // Filter entries by difficulty.
  const handleDifficultyChange = (event) => {
    setPage(1);
    setDifficulty(event.target.value);
  };

  // Clear all journal filters.
  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setDifficulty("");
    setPage(1);
  };

  // Delete an entry and refresh the affected data.

  // Open the custom delete confirmation modal.
  const openDeleteModal = (id) => {
    setSelectedEntryId(id);
    setShowDeleteModal(true);
  };

  // Delete the selected entry after confirmation.
  const handleDeleteEntry = async () => {
    if (!selectedEntryId) return;

    const id = selectedEntryId;

    setDeletingId(id);
    setError("");

    try {
      await deleteEntry(id);

      setShowDeleteModal(false);
      setSelectedEntryId(null);

      showToast("Learning entry deleted successfully!", "success");

      await fetchAnalytics();

      if (entries.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        await fetchEntries();
      }
    } catch (err) {
      console.error("Delete entry error:", err);

      setShowDeleteModal(false);
      setSelectedEntryId(null);

      showToast(
        err.response?.data?.message ||
        "Unable to delete this entry. Please try again.",
        "error"
      );
    } finally {
      setDeletingId(null);
    }
  };


  // Dashboard overview values.
  const totalStudyMinutes = analytics?.overview?.totalStudyMinutes ?? 0;

  const totalEntries = analytics?.overview?.totalEntries ?? 0;

  const totalStudyHours = analytics?.overview?.totalStudyHours ?? 0;

  const averageSessionMinutes = analytics?.overview?.averageSessionMinutes ?? 0;

  const uniqueTopics = analytics?.overview?.uniqueTopics ?? 0;

  const weeklyStudy = analytics?.weeklyStudy ?? [];

  const weeklyStudySessions = weeklyStudy.reduce(
    (total, day) => total + (Number(day.entriesCount) || 0),
    0,
  );

  const difficultyBreakdown = analytics?.difficultyBreakdown ?? {
    Easy: 0,
    Medium: 0,
    Hard: 0,
  };

  const difficultyTotal =
    (Number(difficultyBreakdown.Easy) || 0) +
    (Number(difficultyBreakdown.Medium) || 0) +
    (Number(difficultyBreakdown.Hard) || 0);

  const maxStudyMinutes = Math.max(
    1,
    ...weeklyStudy.map((day) => Number(day.studyMinutes) || 0),
  );

  const recentEntries = analytics?.recentEntries ?? [];

  // Filtered pagination information.
  const filteredTotalEntries = pagination?.totalEntries ?? entries.length;

  const totalPages =
    pagination?.totalPages ??
    Math.max(1, Math.ceil(filteredTotalEntries / PAGE_SIZE));

  const firstVisibleEntry =
    entries.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;

  const lastVisibleEntry = (page - 1) * PAGE_SIZE + entries.length;

  const analyticsUnavailable = Boolean(analyticsError) || !analytics;

  const analyticsValue = (value) => {
    if (isAnalyticsLoading || analyticsUnavailable) {
      return "—";
    }

    return value;
  };

  const formatDay = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(`${date}T12:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      weekday: "short",
    });
  };

  return (
    <div className="dashboard-page">
      <main className="dashboard-main">
        {/* Welcome section */}
        <section className="dashboard-welcome">
          <p className="dashboard-eyebrow">YOUR LEARNING SPACE</p>

          <h1>
            Welcome back,{" "}
            <span>{user?.name?.trim().split(/\s+/)[0] || "Learner"}</span>!
          </h1>

          <p>
            Keep track of what you learn, reflect on your progress, and build
            consistent learning habits.
          </p>
        </section>

        {/* Analytics error and retry */}
        {analyticsError && (
          <div
            className="dashboard-feedback dashboard-feedback-error"
            role="alert"
          >
            <p>{analyticsError}</p>

            <button
              type="button"
              disabled={isAnalyticsLoading}
              onClick={fetchAnalytics}
            >
              {isAnalyticsLoading ? "Retrying…" : "Try again"}
            </button>
          </div>
        )}

        {/* Overview statistic cards */}
        <section
          className="dashboard-stats"
          aria-label="Learning overview statistics"
        >
          <article className="dashboard-stat-card">
            <span className="dashboard-stat-icon" aria-hidden="true">
              📚
            </span>

            <p>Total learning entries</p>

            <h2>{analyticsValue(totalEntries)}</h2>

            <span>Across your learning journal</span>
          </article>

          <article className="dashboard-stat-card">
            <span className="dashboard-stat-icon" aria-hidden="true">
              ⏱️
            </span>

            <p>Total study time</p>

            <h2>{analyticsValue(formatDuration(totalStudyMinutes))}</h2>

            <span>
              {isAnalyticsLoading
                ? "Calculating your learning time..."
                : analyticsUnavailable
                  ? "Analytics currently unavailable"
                  : `${totalStudyHours} hours of learning recorded`}
            </span>
          </article>

          <article className="dashboard-stat-card">
            <span className="dashboard-stat-icon" aria-hidden="true">
              🎯
            </span>

            <p>Entries this week</p>

            <h2>{analyticsValue(weeklyStudySessions)}</h2>

            <span>Entries recorded in the last 7 days</span>
          </article>

          {/* Average study session */}
          <article className="dashboard-stat-card">
            <span className="dashboard-stat-icon" aria-hidden="true">
              ⏳
            </span>

            <p>Average session duration</p>

            <h2>
              {analyticsValue(
                formatDuration(Math.round(averageSessionMinutes)),
              )}
            </h2>

            <span>Average time spent per learning entry</span>
          </article>

          {/* Unique topics learned */}
          <article className="dashboard-stat-card">
            <span className="dashboard-stat-icon" aria-hidden="true">
              🧠
            </span>

            <p>Unique topics learned</p>

            <h2>{analyticsValue(uniqueTopics)}</h2>

            <span>Distinct topics across your journal</span>
          </article>
        </section>

        {/* Learning analytics charts and recent activity */}
        <section
          className="dashboard-analytics"
          aria-label="Learning analytics"
        >
          {/* Weekly study activity */}
          <article className="dashboard-analytics-card">
            <div className="dashboard-analytics-heading">
              <h2>Weekly study activity</h2>
              <p>Study time recorded over the last 7 days.</p>
            </div>

            {isAnalyticsLoading ? (
              <p className="dashboard-analytics-empty" role="status">
                Loading weekly activity…
              </p>
            ) : analyticsUnavailable ? (
              <p className="dashboard-analytics-empty">
                Weekly activity is currently unavailable.
              </p>
            ) : weeklyStudy.length === 0 ? (
              <p className="dashboard-analytics-empty">
                No weekly study activity available yet.
              </p>
            ) : (
              <div className="dashboard-weekly-chart">
                {weeklyStudy.map((day, index) => {
                  const minutes = Number(day.studyMinutes) || 0;

                  const barHeight =
                    minutes > 0
                      ? Math.max(5, (minutes / maxStudyMinutes) * 100)
                      : 0;

                  return (
                    <div
                      className="dashboard-chart-day"
                      key={day.date || index}
                      title={`${formatDuration(minutes)} studied`}
                    >
                      <span className="dashboard-chart-value">
                        {formatDuration(minutes)}
                      </span>

                      <div className="dashboard-chart-track">
                        <div
                          className="dashboard-chart-bar"
                          style={{ height: `${barHeight}%` }}
                        />
                      </div>

                      <span className="dashboard-chart-label">
                        {formatDay(day.date)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </article>

          {/* Difficulty breakdown */}
          <article className="dashboard-analytics-card">
            <div className="dashboard-analytics-heading">
              <h2>Difficulty breakdown</h2>
              <p>Understand the difficulty of your learning entries.</p>
            </div>

            {isAnalyticsLoading ? (
              <p className="dashboard-analytics-empty" role="status">
                Loading difficulty breakdown…
              </p>
            ) : analyticsUnavailable ? (
              <p className="dashboard-analytics-empty">
                Difficulty breakdown is currently unavailable.
              </p>
            ) : difficultyTotal === 0 ? (
              <p className="dashboard-analytics-empty">
                Add learning entries to see your breakdown.
              </p>
            ) : (
              <div className="dashboard-difficulty-list">
                {["Easy", "Medium", "Hard"].map((level) => {
                  const count = Number(difficultyBreakdown[level]) || 0;

                  const percentage =
                    difficultyTotal > 0 ? (count / difficultyTotal) * 100 : 0;

                  return (
                    <div className="dashboard-difficulty-item" key={level}>
                      <div className="dashboard-difficulty-label">
                        <span>{level}</span>

                        <strong>
                          {count} ({Math.round(percentage)}%)
                        </strong>
                      </div>

                      <div
                        className="dashboard-difficulty-track"
                        role="progressbar"
                        aria-label={`${level} difficulty entries`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(percentage)}
                      >
                        <div
                          className="dashboard-difficulty-bar"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </article>

          {/* Recent learning activity */}
          <article className="dashboard-analytics-card">
            <div className="dashboard-analytics-heading">
              <h2>Recent learning activity</h2>
              <p>Your latest recorded learning sessions.</p>
            </div>

            {isAnalyticsLoading ? (
              <p className="dashboard-analytics-empty" role="status">
                Loading recent activity…
              </p>
            ) : analyticsUnavailable ? (
              <p className="dashboard-analytics-empty">
                Recent activity is currently unavailable.
              </p>
            ) : recentEntries.length === 0 ? (
              <p className="dashboard-analytics-empty">
                Your recent learning entries will appear here.
              </p>
            ) : (
              <div className="dashboard-recent-list">
                {recentEntries.slice(0, 5).map((entry, index) => (
                  <div
                    className="dashboard-recent-item"
                    key={entry._id || entry.id || index}
                  >
                    <div>
                      <h3>{entry.topic || "Untitled entry"}</h3>

                      <p>
                        {formatDate(entry.learningDate, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        {" · "}
                        {entry.difficulty || "Difficulty not set"}
                      </p>
                    </div>

                    <span className="dashboard-recent-duration">
                      {formatDuration(entry.studyDurationMinutes)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>

        {/* Learning journal entries */}
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
            <form className="dashboard-search-form" onSubmit={handleSearch}>
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
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Journal loading and error states */}
          {error && (
            <div
              className="dashboard-feedback dashboard-feedback-error"
              role="alert"
            >
              <p>{error}</p>

              <button type="button" disabled={isLoading} onClick={fetchEntries}>
                Try again
              </button>
            </div>
          )}

          {isLoading && (
            <p className="dashboard-feedback" role="status">
              Loading your learning entries…
            </p>
          )}

          {/* Empty journal state */}
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
                  onClick={clearFilters}
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

          {/* Journal entry cards */}
          {!isLoading && !error && entries.length > 0 && (
            <>
              <div className="dashboard-entry-list">
                {entries.map((entry) => {
                  const entryId = entry._id || entry.id;

                  return (
                    <article className="dashboard-entry-card" key={entryId}>
                      <div className="dashboard-entry-content">
                        <h3>{entry.topic || "Untitled entry"}</h3>

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
                              {formatDate(entry.learningDate, {
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
                          </button>

                          <button
                            type="button"
                            disabled={deletingId !== null}
                            onClick={() => openDeleteModal(entryId)}
                          >
                            {deletingId === entryId ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="dashboard-pagination">
                  <p>
                    Showing {firstVisibleEntry}–{lastVisibleEntry} of{" "}
                    {filteredTotalEntries} entries
                  </p>

                  <div className="dashboard-pagination-actions">
                    <button
                      type="button"
                      disabled={isLoading || page <= 1}
                      onClick={() => setPage((currentPage) => currentPage - 1)}
                    >
                      Previous
                    </button>

                    <span>
                      Page {page} of {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={isLoading || page >= totalPages}
                      onClick={() => setPage((currentPage) => currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      {showDeleteModal && (
        <div
          className="dashboard-delete-overlay"
          onClick={(event) => {
            if (
              event.target === event.currentTarget &&
              deletingId === null
            ) {
              setShowDeleteModal(false);
              setSelectedEntryId(null);
            }
          }}
        >
          <section
            className="dashboard-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboard-delete-title"
          >
            <div className="dashboard-delete-icon">!</div>

            <h2 id="dashboard-delete-title">
              Delete learning entry?
            </h2>

            <p>
              This action cannot be undone. Are you sure you want to
              delete this entry?
            </p>

            <div className="dashboard-delete-actions">
              <button
                type="button"
                className="dashboard-delete-cancel"
                disabled={deletingId !== null}
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedEntryId(null);
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="dashboard-delete-confirm"
                disabled={deletingId !== null}
                onClick={handleDeleteEntry}
              >
                {deletingId !== null ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
