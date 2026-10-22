
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import {
  Eye,
  EyeOff,
  UserRound,
  Mail,
  LockKeyhole,
  ArrowRight,
  LoaderCircle,
} from 'lucide-react';

import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import { registerUser } from '../services/authService';
import './RegisterPage.css';

const RegisterPage = () => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const name = formData.name.trim();
    const email = formData.email.trim();

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
        <Link to="/" aria-label="Skillora home">
          <Logo />
        </Link>

        <ThemeToggle />
      </header>

      <section className="register-card">
        <div className="register-heading">
          <span className="register-eyebrow">
            START YOUR JOURNEY
          </span>

          <h1>Create your account</h1>

          <p>
            Build better learning habits, track your progress,
            and celebrate every milestone.
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
            <label htmlFor="name">Full name</label>

            <div className="register-input-wrap">
              <UserRound size={19} aria-hidden="true" />

              <input
                id="name"
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
            <label htmlFor="email">Email address</label>

            <div className="register-input-wrap">
              <Mail size={19} aria-hidden="true" />

              <input
                id="email"
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
            <label htmlFor="password">Password</label>

            <div className="register-input-wrap">
              <LockKeyhole size={19} aria-hidden="true" />

              <input
                id="password"
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
            <label htmlFor="confirmPassword">
              Confirm password
            </label>

            <div className="register-input-wrap">
              <LockKeyhole size={19} aria-hidden="true" />

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={
                  showConfirmPassword ? 'text' : 'password'
                }
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
                Create account
                <ArrowRight size={19} />
              </>
            )}
          </button>
        </form>

        <p className="register-login-prompt">
          Already have an account?{' '}
          <Link to="/login">Log in</Link>
        </p>
      </section>

      <footer className="register-bottom">
        Your learning journey starts with one small step.
      </footer>
    </main>
  );
};

export default RegisterPage;
