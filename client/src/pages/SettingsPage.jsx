
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { changePassword } from "../services/authService";
import "./SettingsPage.css";

const initialForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [visible, setVisible] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setError("");
  };

  const toggleVisibility = (field) => {
    setVisible((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const passwordChecks = [
    {
      label: "At least 8 characters",
      valid: form.newPassword.length >= 8,
    },
    {
      label: "Different from current password",
      valid:
        Boolean(form.newPassword) &&
        form.newPassword !== form.currentPassword,
    },
    {
      label: "Passwords match",
      valid:
        Boolean(form.confirmPassword) &&
        form.newPassword === form.confirmPassword,
    },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setToast("");

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("Please complete all password fields.");
      return;
    }

    if (form.newPassword.length < 8) {
      setError("Your new password must contain at least 8 characters.");
      return;
    }

    if (form.newPassword.length > 128) {
      setError("Your new password cannot exceed 128 characters.");
      return;
    }

    if (form.newPassword === form.currentPassword) {
      setError("Your new password must differ from your current password.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Your new passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setForm(initialForm);
      setToast("Password changed successfully! Please log in again.");

      window.setTimeout(() => {
        logout();
        navigate("/login", { replace: true });
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "We couldn't change your password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      {toast && (
        <div className="settings-toast" role="status" aria-live="polite">
          <span className="settings-toast__icon">
            <CheckCircle2 size={21} />
          </span>
          <span className="settings-toast__content">
            <strong>Password updated</strong>
            <span>{toast}</span>
          </span>
          <button
            type="button"
            className="settings-toast__close"
            onClick={() => setToast("")}
            aria-label="Dismiss notification"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <section className="settings-hero">
        <div className="settings-hero__copy">
          <span className="settings-eyebrow">
            <Sparkles size={14} />
            YOUR ACCOUNT, YOUR CONTROL
          </span>

          <h1>Settings<span>.</span></h1>

          <p>
            Keep your learning space secure. Manage your password and protect
            your progress.
          </p>
        </div>

        <div className="settings-hero__art" aria-hidden="true">
          <div className="settings-hero__orb settings-hero__orb--one" />
          <div className="settings-hero__orb settings-hero__orb--two" />
          <div className="settings-hero__shield">
            <ShieldCheck size={54} strokeWidth={1.4} />
          </div>
          <span className="settings-hero__spark settings-hero__spark--one">✦</span>
          <span className="settings-hero__spark settings-hero__spark--two">✧</span>
        </div>
      </section>

      <div className="settings-section-heading">
        <div>
          <span className="settings-section-heading__eyebrow">ACCOUNT PREFERENCES</span>
          <h2>Security & privacy</h2>
          <p>Simple steps to keep your account protected.</p>
        </div>
        <span className="settings-secure-label">
          <LockKeyhole size={15} />
          Secure settings
        </span>
      </div>

      <div className="settings-grid">
        <aside className="settings-menu">
          <div className="settings-menu__title">SETTINGS MENU</div>
          <div className="settings-menu__item is-selected">
            <span className="settings-menu__icon">
              <KeyRound size={18} />
            </span>
            <span>
              <strong>Password & security</strong>
              <small>Manage your password</small>
            </span>
            <ArrowRight size={17} />
          </div>

          <div className="settings-menu__note">
            <ShieldCheck size={20} />
            <strong>Your account matters</strong>
            <p>
              Use a unique password to help keep your learning journey safe.
            </p>
          </div>
        </aside>

        <section className="settings-card">
          <div className="settings-card__heading">
            <div className="settings-card__icon">
              <LockKeyhole size={21} />
            </div>
            <div>
              <h3>Change password</h3>
              <p>Choose a strong password you haven't used before.</p>
            </div>
            <span className="settings-card__badge">SECURITY</span>
          </div>

          {error && (
            <div className="settings-alert settings-alert--error" role="alert">
              <span>!</span>
              {error}
            </div>
          )}

          <form className="settings-form" onSubmit={handleSubmit}>
            {[
              {
                name: "currentPassword",
                label: "Current password",
                placeholder: "Enter your current password",
              },
              {
                name: "newPassword",
                label: "New password",
                placeholder: "Create a new password",
              },
              {
                name: "confirmPassword",
                label: "Confirm new password",
                placeholder: "Enter your new password again",
              },
            ].map((field, index) => (
              <div className="settings-field" key={field.name}>
                <label htmlFor={field.name}>
                  <span>{field.label}</span>
                  {index === 0 && <small>Required</small>}
                </label>

                <div className="settings-input-wrap">
                  <LockKeyhole size={17} />
                  <input
                    id={field.name}
                    name={field.name}
                    type={visible[field.name] ? "text" : "password"}
                    value={form[field.name]}
                    onChange={updateField}
                    placeholder={field.placeholder}
                    autoComplete={
                      index === 0 ? "current-password" : "new-password"
                    }
                    maxLength={index === 0 ? 72 : 128}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="settings-password-toggle"
                    onClick={() => toggleVisibility(field.name)}
                    aria-label={
                      visible[field.name] ? "Hide password" : "Show password"
                    }
                    disabled={loading}
                  >
                    {visible[field.name] ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            ))}

            <div className="settings-password-guide">
              <div className="settings-password-guide__heading">
                <span>Password checklist</span>
                <span>
                  {passwordChecks.filter((item) => item.valid).length}/3
                </span>
              </div>
              <div className="settings-password-guide__checks">
                {passwordChecks.map((item) => (
                  <div
                    key={item.label}
                    className={`settings-password-check${item.valid ? " is-valid" : ""}`}
                  >
                    <span>{item.valid ? <Check size={12} /> : null}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="settings-form__footer">
              <p>
                <ShieldCheck size={16} />
                You'll need to sign in again after changing your password.
              </p>

              <button
                type="submit"
                className="settings-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="settings-spinner" />
                    Updating password...
                  </>
                ) : (
                  <>
                    Update password
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
