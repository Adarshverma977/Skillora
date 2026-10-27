import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import {
  ArrowRight,
  BookOpen,
  ChartNoAxesColumnIncreasing,
  Eye,
  EyeOff,
  Heart,
  LockKeyhole,
  Mail,
  Moon,
  Sparkles,
  Star,
  Sun,
  Target,
  Users,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { loginUser } from "../services/authService";
import studentArtwork from "../assets/images/skillora-student.png";
import SkilloraLogo from "../components/SkilloraLogo";
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

      navigate("/dashboard");
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
          <SkilloraLogo variant="compact" showTagline={false} />
        </Link>

        <div className="login-topbar-actions">
          <span className="login-new-here">New here?</span>

          <Link to="/register" className="login-signup-link">
            Sign up
          </Link>

          <button
            type="button"
            className="login-theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
      </header>

      <div className="login-layout">
        <section className="login-showcase">
          <div className="login-showcase-content">
            <div className="login-hero-copy">
              <span className="login-eyebrow">
                <Sparkles size={15} />
                YOUR PERSONAL LEARNING JOURNAL
              </span>

              <h1>
                Turn Your
                <br />
                Learning Into
                <br />
                <span className="login-gradient-text">Real Progress</span>
              </h1>

              <p className="login-hero-description">
                Write, reflect, track and grow with a beautiful learning
                journal.
              </p>
            </div>

            <div className="login-benefits">
              <div className="login-benefit">
                <span className="login-benefit-icon benefit-purple">
                  <BookOpen size={23} />
                </span>

                <span className="login-benefit-copy">
                  <strong>Capture Learning</strong>
                  <small>Organize your thoughts and key takeaways.</small>
                </span>
              </div>

              <div className="login-benefit">
                <span className="login-benefit-icon benefit-pink">
                  <ChartNoAxesColumnIncreasing size={23} />
                </span>

                <span className="login-benefit-copy">
                  <strong>Track Progress</strong>
                  <small>See your growth with beautiful insights.</small>
                </span>
              </div>

              <div className="login-benefit">
                <span className="login-benefit-icon benefit-orange">
                  <Target size={23} />
                </span>

                <span className="login-benefit-copy">
                  <strong>Achieve Goals</strong>
                  <small>Stay consistent and build better habits.</small>
                </span>
              </div>
            </div>

            {/* Updated artwork: replaces the CSS-made cartoon boy. */}
            <div className="login-artwork" aria-hidden="true">
              <div className="login-artwork-glow" />

              <div className="login-artwork-orbit orbit-left" />
              <div className="login-artwork-orbit orbit-right" />

              <img
                className="login-student-image"
                src={studentArtwork}
                alt=""
                draggable="false"
              />
            </div>
          </div>
        </section>

        <section className="login-form-section">
          <div className="login-card">
            <div className="login-card-heading">
              <span className="login-card-eyebrow">WELCOME TO SKILLORA</span>

              <h2>Welcome Back!</h2>

              <p className="login-description">
                Login to continue your learning journey.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="login-field">
                <label htmlFor="login-email">Email address</label>

                <div className="login-input-wrap">
                  <Mail size={20} aria-hidden="true" />

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
                  <LockKeyhole size={20} aria-hidden="true" />

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
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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

                <Link to="/forgot-password">Forgot Password?</Link>
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
                {isSubmitting ? "Signing in..." : "Login"}
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
              <Link to="/register">Sign up</Link>
            </p>
          </div>

          <p className="login-bottom-note">
            Made for your growth. Built for your goals.
          </p>
        </section>
      </div>

      {/* <footer className="login-stats">
        <div className="login-stat">
          <span className="login-stat-icon stat-purple">
            <Users size={20} />
          </span>
          <span className="login-stat-copy">
            <strong>10K+</strong>
            <small>Active Learners</small>
          </span>
        </div>

        <div className="login-stat">
          <span className="login-stat-icon stat-orange">
            <Star size={20} />
          </span>
          <span className="login-stat-copy">
            <strong>50K+</strong>
            <small>Entries Written</small>
          </span>
        </div>

        <div className="login-stat">
          <span className="login-stat-icon stat-pink">
            <Heart size={20} />
          </span>
          <span className="login-stat-copy">
            <strong>4.8/5</strong>
            <small>User Rating</small>
          </span>
        </div>

        <div className="login-stat">
          <span className="login-stat-icon stat-teal">
            <Target size={20} />
          </span>
          <span className="login-stat-copy">
            <strong>95%</strong>
            <small>Stay Consistent</small>
          </span>
        </div>
      </footer> */}
    </main>
  );
};

export default LoginPage;