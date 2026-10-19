import {
  ArrowUpRight,
  Heart,
  Mail,
  MoveUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../../../components/Logo';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Logo />

            <p>
              A little progress every day adds up to remarkable results.
              Keep your learning organized and your growth intentional.
            </p>

            <div className="footer-socials">
              <a
                href="mailto:hello@skillora.app"
                aria-label="Contact Skillora by email"
                title="Email"
              >
                <Mail size={17} />
              </a>
            </div>
          </div>

          <div className="footer-links-group">
            <h3>Explore</h3>
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
          </div>

          <div className="footer-links-group">
            <h3>Your account</h3>
            <Link to="/login">Sign in</Link>
            <Link to="/register">Create account</Link>
          </div>

          <div className="footer-note">
            <div className="footer-note-icon">
              <Heart size={18} />
            </div>

            <h3>Keep showing up.</h3>

            <p>
              You don't have to learn everything today. Just keep moving
              forward, one topic at a time.
            </p>

            <a href="#home" className="footer-back-top">
              Back to top
              <MoveUp size={15} />
              <ArrowUpRight className="footer-back-arrow" size={14} />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {currentYear} Skillora. Built for curious minds.
          </p>

          <span className="footer-made-with">
            Made with <Heart size={13} fill="currentColor" /> for learners
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
