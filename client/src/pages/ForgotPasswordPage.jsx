
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { useToast } from "../context/ToastContext";
import { forgotPassword } from "../services/authService";
import "./ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await forgotPassword({
        email: normalizedEmail,
      });

      setIsSubmitted(true);

      showToast(
        result.message ||
        "If an account exists with this email, password reset instructions will be sent.",
        "success"
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to process your request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="forgot-password-page">
      <div className="forgot-password-decoration decoration-one" />
      <div className="forgot-password-decoration decoration-two" />
      <div className="forgot-password-decoration decoration-three" />

      <section className="forgot-password-card">
        <Link
          to="/"
          className="forgot-password-brand"
          aria-label="Skillora home"
        >
          <span className="forgot-password-logo-icon">
            <BookOpen size={25} strokeWidth={2.2} />
          </span>

          <span className="forgot-password-logo-text">
            Skill<span>ora</span>
          </span>
        </Link>

        <Link to="/login" className="forgot-password-top-back">
          <ArrowLeft size={17} />
          Back to Login
        </Link>

        <div className="forgot-password-heading">
          <h1>
            {isSubmitted ? "Check Your Email" : "Forgot Password?"}
          </h1>

          <p>
            {isSubmitted
              ? "If an account exists with this email, we'll send you a reset link."
              : "No worries! Enter your email address and we'll send you a reset link."}
          </p>
        </div>

        <div
          className={`forgot-password-illustration ${isSubmitted ? "illustration-success" : ""
            }`}
          aria-hidden="true"
        >
          <div className="illustration-blob blob-one" />
          <div className="illustration-blob blob-two" />
          <span className="illustration-dot dot-one" />
          <span className="illustration-dot dot-two" />
          <span className="illustration-dot dot-three" />
          <span className="illustration-dot dot-four" />

          <div className="illustration-envelope">
            <div className="envelope-back" />
            <div className="envelope-paper">
              <Mail size={43} strokeWidth={1.6} />
            </div>
            <div className="envelope-front" />
          </div>

          <div className="illustration-lock">
            {isSubmitted ? (
              <CheckCircle2 size={37} strokeWidth={2.2} />
            ) : (
              <>
                <span className="lock-shackle" />
                <LockKeyhole size={29} strokeWidth={2.5} />
              </>
            )}
          </div>
        </div>

        {isSubmitted ? (
          <div className="forgot-password-success">
            <p>
              Please check your inbox and spam folder. The reset link, if
              available, will expire after 15 minutes.
            </p>

            <button
              type="button"
              className="forgot-password-submit"
              onClick={() => {
                setIsSubmitted(false);
                setError("");
              }}
            >
              Try Another Email <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="forgot-password-field">
              <label htmlFor="forgot-password-email">
                Email Address
              </label>

              <div className="forgot-password-input-wrap">
                <Mail size={20} aria-hidden="true" />

                <input
                  id="forgot-password-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError("");
                  }}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {error && (
              <p className="forgot-password-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="forgot-password-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    size={19}
                    className="forgot-password-spinner"
                  />
                  Sending Reset Link...
                </>
              ) : (
                <>
                  Send Reset Link <ArrowRight size={19} />
                </>
              )}
            </button>
          </form>
        )}

        <div className="forgot-password-bottom">
          <p>Remember your password?</p>
          <Link to="/login">Back to Login</Link>
        </div>
      </section>

      <p className="forgot-password-footer">
        Made for your growth. Built for your goals.
      </p>
    </main>
  );
};

export default ForgotPasswordPage;
