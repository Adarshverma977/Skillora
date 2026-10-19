
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import './CTASection.css';

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-panel">
          <div className="cta-decoration cta-decoration-one" />
          <div className="cta-decoration cta-decoration-two" />

          <div className="cta-content">
            <span className="cta-eyebrow">
              <Sparkles size={15} />
              YOUR NEXT CHAPTER STARTS HERE
            </span>

            <h2>
              Make every learning
              <br />
              session <span>count.</span>
            </h2>

            <p>
              Your growth deserves more than scattered notes.
              Start building a learning habit you can be proud of.
            </p>

            <div className="cta-actions">
              <Link to="/register" className="cta-primary-button">
                Get started for free
                <ArrowRight size={18} />
              </Link>

              <span className="cta-no-card">
                <BookOpen size={15} />
                Your learning journey, all in one place
              </span>
            </div>
          </div>

          <div className="cta-art" aria-hidden="true">
            <div className="cta-art-orbit cta-art-orbit-one" />
            <div className="cta-art-orbit cta-art-orbit-two" />

            <div className="cta-art-card">
              <div className="cta-art-icon">
                <BookOpen size={31} />
              </div>

              <span className="cta-art-label">YOUR PROGRESS</span>
              <strong>One day at a time.</strong>

              <div className="cta-progress-track">
                <span />
              </div>

              <div className="cta-progress-footer">
                <span>Keep showing up</span>
                <Sparkles size={15} />
              </div>
            </div>

            <div className="cta-floating-star cta-star-one">
              <Sparkles size={20} />
            </div>

            <div className="cta-floating-star cta-star-two">
              <BookOpen size={19} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
