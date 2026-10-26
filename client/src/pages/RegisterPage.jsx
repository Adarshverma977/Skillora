
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import {
  Eye,
  EyeOff,
  UserRound,
  Mail,
  LockKeyhole,
  ArrowRight,
  LoaderCircle,
  BookOpen,
  ChartNoAxesColumnIncreasing,
  Target,
  Sparkles,
} from 'lucide-react';

import ThemeToggle from '../components/ThemeToggle';
import { registerUser } from '../services/authService';
import studentArtwork from '../assets/images/skillora-student.png';
import './RegisterPage.css';

const RegisterPage = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();

    if (name.length < 2 || name.length > 50) {
      setError('Name must contain between 2 and 50 characters.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (
      formData.password.length < 8 ||
      formData.password.length > 72
    ) {
      setError('Password must contain between 8 and 72 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await registerUser({
        name,
        email,
        password: formData.password,
      });

      showToast(
        result?.message ||
        'Registration successful. Please check your email for verification instructions.',
        'success',
      );

      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      navigate('/verify-email', {
        state: { email },
      });
    } catch (err) {
      const response = err.response;

      if (response?.data?.message) {
        setError(response.data.message);
      } else if (response?.data?.errors) {
        const errors = response.data.errors;

        setError(
          Array.isArray(errors)
            ? errors.map((item) => item.message).join(' ')
            : 'Please check the information you entered.',
        );
      } else if (err.request) {
        setError(
          'Unable to connect to Skillora. Please check that the server is running.',
        );
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="register-page">
      <header className="register-header">
        <Link
          to="/"
          className="register-brand"
          aria-label="Skillora home"
        >
          <span className="register-brand-icon">
            <BookOpen size={25} strokeWidth={2.2} />
          </span>
          <span className="register-brand-name">
            Skill<span>ora</span>
          </span>
        </Link>

        <div className="register-header-actions">
          <span className="register-header-text">Already learning?</span>
          <Link to="/login" className="register-signin-link">
            Sign in
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="register-layout">
        <section className="register-showcase">
          <div className="register-showcase-copy">
            <span className="register-eyebrow">
              <Sparkles size={15} />
              JOIN YOUR LEARNING JOURNEY
            </span>

            <h1>
              Start Your
              <br />
              Learning Journey
              <br />
              with <span className="register-gradient-text">Skillora</span>
            </h1>

            <p className="register-showcase-description">
              Write, track, analyze and grow with a beautiful learning
              journal.
            </p>

            <div className="register-benefits">
              <div className="register-benefit">
                <span className="register-benefit-icon benefit-pink">
                  <BookOpen size={23} />
                </span>
                <span className="register-benefit-copy">
                  <strong>Capture Learning</strong>
                  <small>
                    Organize your thoughts and key takeaways.
                  </small>
                </span>
              </div>

              <div className="register-benefit">
                <span className="register-benefit-icon benefit-purple">
                  <ChartNoAxesColumnIncreasing size={23} />
                </span>
                <span className="register-benefit-copy">
                  <strong>Track Progress</strong>
                  <small>
                    See your growth with beautiful insights.
                  </small>
                </span>
              </div>

              <div className="register-benefit">
                <span className="register-benefit-icon benefit-orange">
                  <Target size={23} />
                </span>
                <span className="register-benefit-copy">
                  <strong>Achieve Goals</strong>
                  <small>
                    Stay consistent and build better habits.
                  </small>
                </span>
              </div>
            </div>
          </div>

          <div className="register-artwork" aria-hidden="true">
            <div className="register-artwork-glow" />
            <div className="register-artwork-orbit register-orbit-left" />
            <div className="register-artwork-orbit register-orbit-right" />

            <img
              className="register-student-image"
              src={studentArtwork}
              alt=""
              draggable="false"
            />
          </div>
        </section>

        <section className="register-form-section">
          <div className="register-card">
            <div className="register-heading">
              <span className="register-card-eyebrow">
                YOUR NEXT CHAPTER STARTS HERE
              </span>

              <h2>
                Create Your <span>Account</span>
              </h2>

              <p>
                Start your learning journey today.
                <Sparkles size={15} aria-hidden="true" />
              </p>
            </div>

            {error && (
              <div
                className="register-alert register-alert-error"
                role="alert"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="register-field">
                <label htmlFor="register-name">Full name</label>

                <div className="register-input-wrap">
                  <UserRound size={19} aria-hidden="true" />
                  <input
                    id="register-name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    minLength={2}
                    maxLength={50}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="register-field">
                <label htmlFor="register-email">Email address</label>

                <div className="register-input-wrap">
                  <Mail size={19} aria-hidden="true" />
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="register-field">
                <label htmlFor="register-password">Password</label>

                <div className="register-input-wrap">
                  <LockKeyhole size={19} aria-hidden="true" />
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={72}
                    required
                    disabled={isSubmitting}
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <span className="register-field-hint">
                  Use between 8 and 72 characters.
                </span>
              </div>

              <div className="register-field">
                <label htmlFor="register-confirm-password">
                  Confirm password
                </label>

                <div className="register-input-wrap">
                  <LockKeyhole size={19} aria-hidden="true" />
                  <input
                    id="register-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Enter your password again"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    disabled={isSubmitting}
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword((value) => !value)
                    }
                    aria-label={
                      showConfirmPassword
                        ? 'Hide confirmation password'
                        : 'Show confirmation password'
                    }
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="register-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle
                      className="register-spinner"
                      size={19}
                    />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </form>

            <div className="register-divider">
              <span />
              <p>Your journey begins with one step</p>
              <span />
            </div>

            <p className="register-login-prompt">
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </p>
          </div>

          <p className="register-bottom-note">
            Made for your growth. Built for your goals.
          </p>
        </section>
      </div>
    </main>
  );
};

export default RegisterPage;
