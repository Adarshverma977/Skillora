
import { useState } from 'react';
import { ArrowRight, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../components/Logo';
import Button from '../../../components/Button';
import ThemeToggle from '../../../components/ThemeToggle';
import { useAuth } from '../../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login', { replace: true });
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
  ];

  const authActions = (
    <>
      {isAuthenticated ? (
        <>
          <span className="landing-login-link">
            Hi, {user?.name?.split(' ')[0] || 'Learner'}
          </span>

          <Link to="/dashboard" onClick={closeMenu}>
            <Button size="medium">
              <LayoutDashboard size={16} /> Dashboard
            </Button>
          </Link>

          <button
            type="button"
            className="landing-login-link"
            onClick={handleLogout}
          >
            <LogOut size={16} /> Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="landing-login-link"
            onClick={closeMenu}
          >
            Login
          </Link>

          <Link to="/register" onClick={closeMenu}>
            <Button size="medium">
              Get Started <ArrowRight size={16} />
            </Button>
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="landing-navbar">
      <div className="landing-navbar-inner">
        <Logo />

        <nav
          className={`landing-nav ${menuOpen ? 'landing-nav-open' : ''}`}
          aria-label="Main navigation"
        >
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="landing-nav-link"
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}

          <div className="landing-mobile-actions">
            <ThemeToggle />
            {authActions}
          </div>
        </nav>

        <div className="landing-navbar-actions">
          <ThemeToggle />
          {authActions}
        </div>

        <button
          type="button"
          className="landing-menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
