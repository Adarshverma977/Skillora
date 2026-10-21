
import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  ChartNoAxesCombined,
  ChevronDown,
  Command,
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
import "./MainLayout.css";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Journal",
    path: "/journal",
    icon: BookOpen,
  },
  {
    label: "Search & Filter",
    path: "/search",
    icon: Search,
  },
];

const accountItems = [
  {
    label: "My Profile",
    path: "/profile",
    icon: UserRound,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "S";

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate("/login", { replace: true });
  };

  const isActivePath = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(`${path}/`);

  const renderNavigation = (items) =>
    items.map(({ label, path, icon: Icon }) => (
      <NavLink
        key={path}
        to={path}
        onClick={closeMobileMenu}
        className={({ isActive }) =>
          `main-layout__nav-link${isActive || isActivePath(path) ? " is-active" : ""}`
        }
      >
        <Icon size={19} strokeWidth={1.8} />
        <span>{label}</span>
      </NavLink>
    ));

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
        className={`main-layout__sidebar${mobileMenuOpen ? " is-open" : ""}`}
      >
        <NavLink
          to="/dashboard"
          className="main-layout__brand"
          onClick={closeMobileMenu}
        >
          <span className="main-layout__brand-icon">
            <Command size={22} />
          </span>

          <span>
            <strong>LearnLog</strong>
            <small>YOUR LEARNING SPACE</small>
          </span>

          <button
            type="button"
            className="main-layout__mobile-close"
            aria-label="Close navigation"
            onClick={(event) => {
              event.preventDefault();
              closeMobileMenu();
            }}
          >
            <X size={20} />
          </button>
        </NavLink>

        <div className="main-layout__workspace">
          <span className="main-layout__workspace-dot" />
          Student workspace
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
            <p>Keep showing up. Your progress adds up every day.</p>
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
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <Menu size={22} />
          </button>

          <div className="main-layout__breadcrumb">
            <span>LearnLog</span>
            <span className="main-layout__breadcrumb-divider">/</span>
            <strong>
              {[...navigationItems, ...accountItems].find(
                (item) => isActivePath(item.path)
              )?.label || "Learning space"}
            </strong>
          </div>

          <div className="main-layout__topbar-actions">
            <label className="main-layout__search">
              <Search size={17} />
              <input
                type="search"
                placeholder="Search anything..."
                aria-label="Search anything"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && event.currentTarget.value.trim()) {
                    navigate(
                      `/search?q=${encodeURIComponent(event.currentTarget.value.trim())}`
                    );
                    closeMobileMenu();
                  }
                }}
              />
              <kbd>↵</kbd>
            </label>

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
                  alt={user.name || "Profile"}
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
};

export default MainLayout;
