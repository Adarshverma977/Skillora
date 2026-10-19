import './Logo.css';
import { BookOpen } from 'lucide-react';

const Logo = ({ compact = false }) => {
  return (
    <a
      href="/"
      className={`brand-logo ${compact ? 'brand-logo-compact' : ''}`}
      aria-label="Skillora home"
    >
      <span className="brand-logo-icon">
        <BookOpen size={22} strokeWidth={2.2} />
      </span>

      {!compact && (
        <span className="brand-logo-name">
          Skill<span>ora</span>
        </span>
      )}
    </a>
  );
};

export default Logo;
