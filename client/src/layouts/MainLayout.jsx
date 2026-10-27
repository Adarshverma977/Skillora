
import { useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  BookOpen,
  ChartNoAxesCombined,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import SkilloraLogo from "../components/SkilloraLogo";
import "./MainLayout.css";

const navigationItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "My Journal", path: "/journal", icon: BookOpen },
  { label: "Search & Filter", path: "/search", icon: Search },
];

const accountItems = [
  { label: "My Profile", path: "/profile", icon: UserRound },
  { label: "Settings", path: "/settings", icon: Settings },
];

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "S";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const isActivePath = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(`${path}/`);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate("/login", { replace: true });
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchValue.trim();

    if (!query) return;

    navigate(`/search?q=${encodeURIComponent(query)}`);
    closeMobileMenu();
  };

  const renderNavigation = (items) =>
    items.map(({ label, path, icon: Icon }) => (
      <NavLink
        key={path}
        to={path}
        onClick={closeMobileMenu}
        className={({ isActive }) =>
          `main-layout__nav-link${isActive || isActivePath(path) ? " is-active" : ""
          }`
        }
      >
        <Icon size={19} strokeWidth={1.8} />
        <span>{label}</span>
      </NavLink>
    ));

  const activePage =
    [...navigationItems, ...accountItems].find((item) =>
      isActivePath(item.path)
    )?.label || "Learning space";

  return (
    <div className="main-layout">
      {mobileMenuOpen && (
        <button
          type="button"
          className="main-layout__backdrop"
          aria-label="Close navigation menu"
          onClick={closeMobileMenu}
        />
      )}

      <aside
        id="skillora-sidebar"
        className={`main-layout__sidebar${mobileMenuOpen ? " is-open" : ""
          }`}
        aria-label="Main navigation"
      >
        <div className="main-layout__brand-row">

          <NavLink
            to="/dashboard"
            className="main-layout__brand"
            onClick={closeMobileMenu}
            aria-label="Skillora home"
          >
            <SkilloraLogo variant="compact" showTagline={true} />
          </NavLink>

          <button
            type="button"
            className="main-layout__mobile-close"
            aria-label="Close navigation"
            onClick={closeMobileMenu}
          >
            <X size={20} />
          </button>
        </div>

        <div className="main-layout__workspace">
          <span className="main-layout__workspace-dot" />
          <span>Student workspace</span>
          <ChevronDown size={15} />
        </div>

        <div className="main-layout__nav-section">
          <p className="main-layout__section-label">WORKSPACE</p>
          <nav className="main-layout__nav">
            {renderNavigation(navigationItems)}
          </nav>
        </div>

        <div className="main-layout__nav-section">
          <p className="main-layout__section-label">ACCOUNT</p>
          <nav className="main-layout__nav">
            {renderNavigation(accountItems)}
          </nav>
        </div>

        <div className="main-layout__sidebar-bottom">
          <div className="main-layout__tip">
            <div className="main-layout__tip-icon">
              <ChartNoAxesCombined size={20} />
            </div>
            <strong>Small steps, big growth.</strong>
            <p>
              Keep showing up. Your progress adds up every day.
            </p>
          </div>

          <button
            type="button"
            className="main-layout__logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <div className="main-layout__main">
        <header className="main-layout__topbar">
          <button
            type="button"
            className="main-layout__menu-button"
            aria-label="Toggle navigation menu"
            aria-controls="skillora-sidebar"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>

          <div className="main-layout__breadcrumb">
            <h1>{activePage}</h1>
          </div>

          <div className="main-layout__topbar-actions">
            <form
              className="main-layout__search"
              role="search"
              onSubmit={handleSearch}
            >
              <Search size={18} aria-hidden="true" />

              <input
                type="search"
                placeholder="Search your learning journal..."
                aria-label="Search learning journal"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
              />

              <button
                type="submit"
                className="main-layout__search-submit"
                aria-label="Submit search"
              >
                <span>↵</span>
              </button>
            </form>

            <ThemeToggle />

            <NavLink
              to="/profile"
              className="main-layout__user"
              aria-label="Open profile"
            >
              {user?.profilePhoto ? (
                <img
                  className="main-layout__avatar"
                  src={user.profilePhoto}
                  alt=""
                />
              ) : (
                <span className="main-layout__avatar main-layout__avatar--fallback">
                  {getInitials(user?.name)}
                </span>
              )}

              <span className="main-layout__user-details">
                <strong>{user?.name || "Student"}</strong>
                <small>{user?.email || "Learning account"}</small>
              </span>

              <ChevronDown size={16} />
            </NavLink>
          </div>
        </header>

        <main className="main-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
