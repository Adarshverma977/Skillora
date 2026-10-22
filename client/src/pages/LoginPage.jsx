
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChartNoAxesColumnIncreasing,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Moon,
  Sun,
  Target,
  TrendingUp,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { loginUser } from "../services/authService";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const email = formData.email.trim();

    if (!email || !formData.password) {
      setError("Please enter your email address and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await loginUser({
        email,
        password: formData.password,
      });

      if (!response?.data?.token) {
        throw new Error("Unable to complete sign in. Please try again.");
      }

      login({
        token: response.data.token,
        user: response.data.user,
      });

      showToast("Login successful! Welcome back to Skillora.", "success");

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <header className="login-topbar">
        <Link to="/" className="login-logo" aria-label="Skillora home">
          <span className="login-logo-icon">
            <BookOpen size={25} strokeWidth={2.2} />
          </span>
          <span>
            Skill<span className="login-logo-accent">ora</span>
          </span>
        </Link>

        <button
          type="button"
          className="login-theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <div className="login-layout">
        <section className="login-showcase">
          <Link to="/" className="login-back-link">
            <ArrowLeft size={17} />
            Back to home
          </Link>

          <div className="login-showcase-content">
            <div className="login-illustration" aria-hidden="true">
              <div className="login-orbit login-orbit-one" />
              <div className="login-orbit login-orbit-two" />

              <div className="login-floating-card login-floating-book">
                <BookOpen size={27} />
              </div>

              <div className="login-floating-card login-floating-chart">
                <ChartNoAxesColumnIncreasing size={31} />
              </div>

              <div className="login-floating-card login-floating-progress">
                <TrendingUp size={19} />
                <span>
                  <strong>75%</strong>
                  <small>Progress</small>
                </span>
              </div>

              <div className="login-study-scene">
                <div className="login-study-glow" />

                <div className="login-study-person">
                  <div className="login-person-hair" />
                  <div className="login-person-face">
                    <span className="login-person-eye login-eye-left" />
                    <span className="login-person-eye login-eye-right" />
                    <span className="login-person-smile" />
                  </div>
                  <div className="login-person-neck" />
                  <div className="login-person-body">
                    <BookOpen size={30} />
                  </div>
                </div>

                <div className="login-laptop">
                  <div className="login-laptop-screen">
                    <span />
                  </div>
                  <div className="login-laptop-base" />
                </div>

                <div className="login-books">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="login-plant">
                  <span />
                  <span />
                  <span />
                  <i />
                </div>
              </div>
            </div>

            <div className="login-hero-copy">
              <span className="login-eyebrow">LEARN · TRACK · GROW</span>

              <h1>
                Your Learning
                <br />
                Journey, Better
                <br />
                <span>Every Day.</span>
              </h1>

              <p>
                Track your progress, build better habits, and achieve your
                goals with Skillora.
              </p>
            </div>

            <div className="login-benefits">
              <div className="login-benefit">
                <span className="login-benefit-icon">
                  <TrendingUp size={19} />
                </span>
                <span>
                  <strong>Track Progress</strong>
                  <small>Log your daily learning</small>
                </span>
              </div>

              <div className="login-benefit">
                <span className="login-benefit-icon">
                  <Target size={19} />
                </span>
                <span>
                  <strong>Build Habits</strong>
                  <small>Stay consistent</small>
                </span>
              </div>

              <div className="login-benefit">
                <span className="login-benefit-icon">
                  <BookOpen size={19} />
                </span>
                <span>
                  <strong>Achieve Goals</strong>
                  <small>Become a better version of you</small>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="login-form-section">
          <div className="login-card">
            <div className="login-card-brand">
              <span className="login-logo-icon">
                <BookOpen size={25} strokeWidth={2.2} />
              </span>
              <span>
                Skill<span className="login-logo-accent">ora</span>
              </span>
            </div>

            <span className="login-card-eyebrow">
              YOUR LEARNING JOURNEY
            </span>

            <h2>Welcome back!</h2>

            <p className="login-description">
              Sign in to continue building better learning habits.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="login-field">
                <label htmlFor="login-email">Email address</label>

                <div className="login-input-wrap">
                  <Mail size={19} aria-hidden="true" />

                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="login-password">Password</label>

                <div className="login-input-wrap">
                  <LockKeyhole size={19} aria-hidden="true" />

                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              <div className="login-form-options">
                <span className="login-secure-note">
                  <LockKeyhole size={14} />
                  Secure sign in
                </span>

                <Link to="/forgot-password">Forgot password?</Link>
              </div>

              {error && (
                <p className="login-error" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="login-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
                {!isSubmitting && <ArrowRight size={19} />}
              </button>
            </form>

            <div className="login-divider">
              <span />
              <p>Your next chapter starts here</p>
              <span />
            </div>

            <p className="login-footer">
              Don&apos;t have an account?{" "}
              <Link to="/register">Create account</Link>
            </p>
          </div>

          <p className="login-bottom-note">
            Made for your growth. Built for your goals.
          </p>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
