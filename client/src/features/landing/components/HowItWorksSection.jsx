
import {
  UserRoundPlus,
  NotebookPen,
  TrendingUp,
  ArrowDown,
} from 'lucide-react';
import Button from '../../../components/Button';
import { Link } from 'react-router-dom';
import './HowItWorksSection.css';

const steps = [
  {
    number: '01',
    icon: UserRoundPlus,
    title: 'Create your space',
    description:
      'Create your free account and set up your personal learning journal in just a few moments.',
    tag: 'GET STARTED',
  },
  {
    number: '02',
    icon: NotebookPen,
    title: 'Record what you learn',
    description:
      'Log your daily topics, add notes, track study time, and reflect on what you have understood.',
    tag: 'STAY CONSISTENT',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'See your progress grow',
    description:
      'Explore your learning statistics, review past topics, and discover how your habits improve over time.',
    tag: 'KEEP GROWING',
  },
];

const HowItWorksSection = () => {
  return (
    <section className="how-section section" id="how-it-works">
      <div className="container">
        <div className="how-heading">
          <span className="section-eyebrow">
            YOUR JOURNEY, SIMPLIFIED
          </span>

          <h2>
            Small steps.
            <br />
            <span className="gradient-text">Meaningful progress.</span>
          </h2>

          <p>
            Build a learning habit that lasts. Start simple, stay consistent,
            and let your progress speak for itself.
          </p>
        </div>

        <div className="how-steps">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article className="how-step" key={step.number}>
                <div className="how-step-visual">
                  <div className="how-step-icon">
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  <span className="how-step-number">
                    {step.number}
                  </span>

                  {index < steps.length - 1 && (
                    <div className="how-step-connector">
                      <span />
                      <ArrowDown size={15} />
                    </div>
                  )}
                </div>

                <div className="how-step-content">
                  <span className="how-step-tag">{step.tag}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="how-bottom">
          <p>
            Your next learning milestone starts with one small step.
          </p>

          <Button onClick={() => (window.location.href = '/register')}>
            Start learning free
            <TrendingUp size={17} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
