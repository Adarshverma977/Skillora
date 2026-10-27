
import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  CalendarDays,
  ArrowUpDown,
  X,
  BookOpen,
  Clock3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { getEntries } from "../services/entryService";
import "./SearchFilterPage.css";

const INITIAL_PAGINATION = {
  currentPage: 1,
  pageSize: 10,
  totalEntries: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const SearchFilterPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryFromUrl = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(queryFromUrl);
  const [search, setSearch] = useState(queryFromUrl);
  const [difficulty, setDifficulty] = useState("");
  const [sort, setSort] = useState("newest");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const [entries, setEntries] = useState([]);
  const [pagination, setPagination] = useState(INITIAL_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSearch = searchInput.trim();

      setSearch(nextSearch);
      setPage(1);

      setSearchParams(
        (previous) => {
          const updated = new URLSearchParams(previous);

          if (nextSearch) {
            updated.set("q", nextSearch);
          } else {
            updated.delete("q");
          }

          return updated;
        },
        { replace: true }
      );
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput, setSearchParams]);

  // Keep the input synchronized with topbar searches and browser navigation.
  useEffect(() => {
    setSearchInput(queryFromUrl);
    setSearch(queryFromUrl.trim());
    setPage(1);
  }, [queryFromUrl]);

  const loadEntries = useCallback(async () => {
    if (fromDate && toDate && fromDate > toDate) {
      setEntries([]);
      setPagination(INITIAL_PAGINATION);
      setError("");
      setLoading(false);
      return;
    }

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
        "Unable to load matching entries. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, difficulty, sort, fromDate, toDate]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setDifficulty("");
    setSort("newest");
    setFromDate("");
    setToDate("");
    setPage(1);
    setSearchParams({}, { replace: true });
  };

  const hasFilters = Boolean(
    search || difficulty || fromDate || toDate || sort !== "newest"
  );

  const invalidDateRange = Boolean(
    fromDate && toDate && fromDate > toDate
  );

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
    const safeMinutes = Math.max(0, Number(minutes) || 0);
    const hours = Math.floor(safeMinutes / 60);
    const remainingMinutes = safeMinutes % 60;

    if (hours && remainingMinutes) {
      return `${hours}h ${remainingMinutes}m`;
    }

    if (hours) return `${hours}h`;

    return `${remainingMinutes}m`;
  };

  const getEntryId = (entry) => entry._id || entry.id;

  return (
    <main className="search-page">
      <section className="search-page__hero">
        <div className="search-page__eyebrow">
          <SlidersHorizontal size={15} />
          YOUR LEARNING SPACE
        </div>

        <h1>Search &amp; Filter</h1>

        <p>
          Find the right learning session without scrolling through
          your entire journal.
        </p>

        <form
          className="search-page__search"
          onSubmit={(event) => {
            event.preventDefault();
            setSearch(searchInput.trim());
            setPage(1);
          }}
        >
          <Search size={21} />

          <input
            type="search"
            placeholder="Search topics, skills or descriptions..."
            aria-label="Search learning entries"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />

          {searchInput && (
            <button
              type="button"
              className="search-page__clear-search"
              aria-label="Clear search"
              onClick={() => setSearchInput("")}
            >
              <X size={18} />
            </button>
          )}

          <button type="submit" className="search-page__search-button">
            Search
          </button>
        </form>
      </section>

      <section className="search-page__filters">
        <div className="search-page__filters-heading">
          <div>
            <h2>Refine your results</h2>
            <p>Combine filters to find exactly what you need.</p>
          </div>

          {hasFilters && (
            <button
              type="button"
              className="search-page__clear-all"
              onClick={clearFilters}
            >
              <X size={15} />
              Clear all
            </button>
          )}
        </div>

        <div className="search-page__filter-grid">
          <label className="search-page__field">
            <span>
              <SlidersHorizontal size={15} />
              Difficulty
            </span>

            <select
              value={difficulty}
              onChange={(event) => {
                setDifficulty(event.target.value);
                setPage(1);
              }}
            >
              <option value="">All levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>

          <label className="search-page__field">
            <span>
              <ArrowUpDown size={15} />
              Sort results
            </span>

            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                setPage(1);
              }}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>

          <label className="search-page__field">
            <span>
              <CalendarDays size={15} />
              From date
            </span>

            <input
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(event) => {
                setFromDate(event.target.value);
                setPage(1);
              }}
            />
          </label>

          <label className="search-page__field">
            <span>
              <CalendarDays size={15} />
              To date
            </span>

            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(event) => {
                setToDate(event.target.value);
                setPage(1);
              }}
            />
          </label>
        </div>
      </section>

      <section className="search-page__results">
        <div className="search-page__results-heading">
          <div>
            <h2>Matching entries</h2>
            <p>
              {loading
                ? "Finding your learning sessions..."
                : `${pagination.totalEntries} ${pagination.totalEntries === 1 ? "result" : "results"
                } found`}
            </p>
          </div>

          <span className="search-page__result-icon">
            <BookOpen size={20} />
          </span>
        </div>

        {invalidDateRange && (
          <div className="search-page__message" role="alert">
            Start date cannot be later than end date.
          </div>
        )}

        {error && (
          <div className="search-page__message" role="alert">
            <p>{error}</p>
            <button type="button" onClick={loadEntries}>
              Try again
            </button>
          </div>
        )}

        {loading && !invalidDateRange ? (
          <div className="search-page__state" aria-live="polite">
            <span className="search-page__spinner" />
            <p>Searching your journal...</p>
          </div>
        ) : !invalidDateRange && !error && entries.length === 0 ? (
          <div className="search-page__empty">
            <span className="search-page__empty-icon">
              <Search size={25} />
            </span>

            <h3>No matching entries</h3>

            <p>
              Try another keyword or adjust your filters to discover
              more of your learning journey.
            </p>

            {hasFilters && (
              <button type="button" onClick={clearFilters}>
                Clear all filters
              </button>
            )}
          </div>
        ) : !invalidDateRange && !error ? (
          <>
            <div className="search-page__list">
              {entries.map((entry) => {
                const id = getEntryId(entry);

                return (
                  <article className="search-result" key={id}>
                    <div className="search-result__icon">
                      {(entry.topic?.charAt(0) || "L").toUpperCase()}
                    </div>

                    <div className="search-result__content">
                      <div className="search-result__title-row">
                        <h3>{entry.topic}</h3>

                        <span
                          className={`search-result__difficulty search-result__difficulty--${(
                            entry.difficulty || "Medium"
                          ).toLowerCase()}`}
                        >
                          {entry.difficulty || "Medium"}
                        </span>
                      </div>

                      <p className="search-result__description">
                        {entry.description || "No description provided."}
                      </p>

                      <div className="search-result__meta">
                        <span>
                          <CalendarDays size={14} />
                          {formatDate(entry.learningDate)}
                        </span>

                        <span>
                          <Clock3 size={14} />
                          {formatDuration(entry.studyDurationMinutes)}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/learning-entries/${id}`}
                      className="search-result__view"
                    >
                      View entry
                      <ChevronRight size={16} />
                    </Link>
                  </article>
                );
              })}
            </div>

            <div className="search-page__pagination">
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
                  <ChevronLeft size={17} />
                  Previous
                </button>

                <button
                  type="button"
                  disabled={!pagination.hasNextPage || loading}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
};

export default SearchFilterPage;
