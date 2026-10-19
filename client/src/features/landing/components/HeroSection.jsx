
import {
  ArrowRight,
  CheckCircle2,
  Play,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button';
import './HeroSection.css';

const trustPoints = [
  'Track daily learning',
  'Build consistent habits',
  'See your progress',
];

const HeroSection = () => {
  return (
    <section className="hero-section" id="home">
      <div className="hero-background-glow hero-glow-one" />
      <div className="hero-background-glow hero-glow-two" />

      <div className="container hero-layout">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-icon">
              <Sparkles size={15} />
            </span>
            YOUR PERSONAL LEARNING COMPANION
          </div>

          <h1 className="hero-title">
            Your Learning
            <br />
            Journey, <span className="gradient-text">Made Simple.</span>
          </h1>

          <p className="hero-description">
            Turn everyday learning into lasting progress.
            Track what you study, build better habits, and
            see how far you have come — all in one place.
          </p>

          <div className="hero-actions">
            <Link to="/register">
              <Button size="large">
                Get Started Free
                <ArrowRight size={18} />
              </Button>
            </Link>

            <a className="hero-secondary-action" href="#features">
              <span className="hero-play-icon">
                <Play size={15} fill="currentColor" />
              </span>
              Explore Features
            </a>
          </div>

          <div className="hero-trust-points">
            {trustPoints.map((point) => (
              <div className="hero-trust-point" key={point}>
                <CheckCircle2 size={16} />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-glow" />

          <div className="hero-visual-card">
            <div className="hero-visual-top">
              <div>
                <span className="hero-visual-label">
                  YOUR LEARNING SPACE
                </span>
                <h2>Small steps. Big growth.</h2>
              </div>

              <span className="hero-sparkle">
                <Sparkles size={20} />
              </span>
            </div>

            <div className="hero-preview-placeholder">
              <div className="hero-preview-orbit hero-orbit-one" />
              <div className="hero-preview-orbit hero-orbit-two" />

              <div className="hero-preview-book">
                <div className="hero-book-page">
                  <BookIllustration />
                </div>
              </div>

              <div className="hero-floating-card hero-floating-progress">
                <span className="hero-floating-icon">
                  <CheckCircle2 size={18} />
                </span>
                <div>
                  <strong>Keep it up!</strong>
                  <span>Progress starts here</span>
                </div>
              </div>

              <div className="hero-floating-card hero-floating-streak">
                <span className="hero-streak-emoji">✦</span>
                <div>
                  <strong>Stay consistent</strong>
                  <span>One day at a time</span>
                </div>
              </div>
            </div>

            <div className="hero-visual-footer">
              <div>
                <span className="hero-footer-dot" />
                <span>Learning never stops</span>
              </div>
              <span>Made for your growth</span>
            </div>
          </div>

          <div className="hero-decor hero-decor-top">
            <Sparkles size={22} />
          </div>
          <div className="hero-decor hero-decor-bottom">✦</div>
        </div>
      </div>
    </section>
  );
};

const BookIllustration = () => (
  <div className="book-illustration">
    <div className="book-cover">
      <div className="book-cover-symbol">
        <Sparkles size={36} />
      </div>
      <span>KEEP</span>
      <strong>GROWING</strong>
      <div className="book-cover-lines">
        <i />
        <i />
        <i />
      </div>
    </div>
  </div>
);

export default HeroSection;
