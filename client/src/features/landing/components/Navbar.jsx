
import { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../../../components/Logo';
import Button from '../../../components/Button';
import ThemeToggle from '../../../components/ThemeToggle';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
  ];

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

            <Link to="/login" onClick={closeMenu}>
              Login
            </Link>

            <Link to="/register" onClick={closeMenu}>
              <Button>
                Get Started <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </nav>

        <div className="landing-navbar-actions">
          <ThemeToggle />

          <Link to="/login" className="landing-login-link">
            Login
          </Link>

          <Link to="/register">
            <Button size="medium">
              Get Started <ArrowRight size={16} />
            </Button>
          </Link>
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
