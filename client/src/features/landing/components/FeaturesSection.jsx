
import {
  BookOpen,
  ChartNoAxesCombined,
  CalendarCheck,
  Target,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import './FeaturesSection.css';

const features = [
  {
    icon: BookOpen,
    title: 'Your Personal Learning Journal',
    description:
      'Capture what you learn every day, organize topics, and keep your learning notes in one place.',
    className: 'feature-purple',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Insights That Matter',
    description:
      'Understand your study habits with clear statistics, weekly summaries, and progress insights.',
    className: 'feature-pink',
  },
  {
    icon: CalendarCheck,
    title: 'Build Daily Consistency',
    description:
      'Create a sustainable learning routine and keep track of the time you invest in your growth.',
    className: 'feature-blue',
  },
  {
    icon: Target,
    title: 'Track Every Milestone',
    description:
      'Review completed topics, reflect on difficult concepts, and see how far you have progressed.',
    className: 'feature-orange',
  },
];

const FeaturesSection = () => {
  return (
    <section className="features-section section" id="features">
      <div className="container">
        <div className="features-heading">
          <span className="section-eyebrow">
            <Sparkles size={15} />
            LEARN WITH PURPOSE
          </span>

          <h2>
            Everything you need to
            <br />
            <span className="gradient-text">grow every day.</span>
          </h2>

          <p>
            A simpler way to document your learning, understand your progress,
            and turn small daily efforts into meaningful growth.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <article
                className="feature-card"
                key={feature.title}
                style={{ '--feature-index': index }}
              >
                <div className={`feature-icon ${feature.className}`}>
                  <Icon size={23} strokeWidth={1.8} />
                </div>

                <span className="feature-number">
                  0{index + 1}
                </span>

                <h3>{feature.title}</h3>
                <p>{feature.description}</p>

                <div className="feature-card-bottom">
                  <span>Designed for your growth</span>
                  <ArrowUpRight size={17} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
