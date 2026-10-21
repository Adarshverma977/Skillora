
import { useEffect, useRef, useState } from "react";
import {
  getMyProfile,
  updateMyProfile,
  uploadProfilePhoto,
} from "../services/userService";
import { useAuth } from "../context/AuthContext";
import "./ProfilePage.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.message ||
  "Something went wrong. Please try again.";

const ProfilePage = () => {
  const { updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef("");

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const setPreview = (url) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }

    setPhotoPreview(url);

    if (url.startsWith("blob:")) {
      previewUrlRef.current = url;
    }
  };

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyProfile();
        const user = response.data?.user;

        if (!user) {
          throw new Error("Profile data was not returned by the server.");
        }

        if (active) {
          setProfile(user);
          setName(user.name || "");
          setProfilePhoto(user.profilePhoto || "");
          setPhotoPreview(user.profilePhoto || "");
        }
      } catch (err) {
        if (active) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      active = false;

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = "";
      }
    };
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Please select a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setProfilePhoto("");
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 50) {
      setError("Name must be between 2 and 50 characters.");
      return;
    }

    const updates = {};
    let nextPhoto = profile.profilePhoto || null;

    if (trimmedName !== profile.name) {
      updates.name = trimmedName;
    }

    try {
      setSaving(true);

      if (selectedFile) {
        setUploading(true);

        try {
          nextPhoto = await uploadProfilePhoto(selectedFile);
        } finally {
          setUploading(false);
        }
      } else if (!photoPreview && profile.profilePhoto) {
        nextPhoto = null;
      }

      if (nextPhoto !== (profile.profilePhoto || null)) {
        updates.profilePhoto = nextPhoto;
      }

      let updatedUser = profile;

      if (Object.keys(updates).length > 0) {
        const response = await updateMyProfile(updates);
        updatedUser = response.data?.user;

        if (!updatedUser) {
          throw new Error("Updated profile data was not returned.");
        }
      }

      setProfile(updatedUser);
      setName(updatedUser.name || "");
      setProfilePhoto(updatedUser.profilePhoto || "");
      setSelectedFile(null);
      setPreview(updatedUser.profilePhoto || "");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      updateUser({
        name: updatedUser.name,
        profilePhoto: updatedUser.profilePhoto || null,
      });

      setSuccess(
        Object.keys(updates).length > 0
          ? "Profile updated successfully."
          : "Your profile is already up to date."
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-state" role="status">
          <span className="profile-spinner" />
          <p>Loading your profile...</p>
        </div>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main className="profile-page">
        <section className="profile-state profile-state-error">
          <div className="profile-state-icon">!</div>
          <h2>Unable to load profile</h2>
          <p>{error}</p>
          <button
            type="button"
            className="profile-button profile-button-primary"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  const displayName = profile?.name || "Skillora Learner";

  const initials =
    displayName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "S";

  return (
    <main className="profile-page">
      <header className="profile-page-header">
        <div>
          <span className="profile-eyebrow">YOUR ACCOUNT</span>
          <h1>My Profile</h1>
          <p>
            Manage your personal information and how you appear in Skillora.
          </p>
        </div>

        <div className="profile-header-badge">
          <span className="profile-status-dot" />
          Personal account
        </div>
      </header>

      <div className="profile-content">
        <section className="profile-summary-card">
          <div className="profile-summary-cover">
            <span className="profile-cover-decoration profile-cover-decoration-one" />
            <span className="profile-cover-decoration profile-cover-decoration-two" />
          </div>

          <div className="profile-summary-body">
            <div className="profile-avatar">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt={`${displayName}'s profile`}
                  onError={() => setPreview("")}
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <div className="profile-summary-info">
              <h2>{displayName}</h2>
              <p>{profile?.email}</p>

              <div className="profile-verification">
                <span
                  className={
                    profile?.isEmailVerified
                      ? "profile-verification-icon verified"
                      : "profile-verification-icon unverified"
                  }
                >
                  {profile?.isEmailVerified ? "✓" : "!"}
                </span>

                {profile?.isEmailVerified
                  ? "Email verified"
                  : "Email not verified"}
              </div>
            </div>

            <span className="profile-member-badge">Skillora member</span>
          </div>
        </section>

        <section className="profile-form-card">
          <div className="profile-section-heading">
            <div className="profile-section-icon">
              <svg
                viewBox="0 0 24 24"
                width="21"
                height="21"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
              </svg>
            </div>

            <div>
              <h2>Personal information</h2>
              <p>Keep your account details up to date.</p>
            </div>
          </div>

          {error && (
            <div className="profile-alert profile-alert-error" role="alert">
              <span>!</span>
              {error}
            </div>
          )}

          {success && (
            <div className="profile-alert profile-alert-success" role="status">
              <span>✓</span>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="profile-form-grid">
              <div className="profile-field profile-field-full">
                <label htmlFor="profile-name">Full name</label>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  minLength={2}
                  maxLength={50}
                  required
                  autoComplete="name"
                  disabled={saving}
                />
                <span className="profile-field-hint">
                  Your name will be displayed across your account.
                </span>
              </div>

              <div className="profile-field profile-field-full">
                <label htmlFor="profile-email">Email address</label>
                <input
                  id="profile-email"
                  type="email"
                  value={profile?.email || ""}
                  readOnly
                  disabled
                />
                <span className="profile-field-hint">
                  Your email address cannot be changed here.
                </span>
              </div>

              <div className="profile-field profile-field-full">
                <label htmlFor="profile-photo">Profile photo</label>

                <input
                  ref={fileInputRef}
                  id="profile-photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  disabled={saving}
                />

                <span className="profile-field-hint">
                  Choose a JPG, PNG, or WebP image. Maximum size: 5 MB.
                </span>

                {selectedFile && (
                  <span className="profile-field-hint">
                    Selected: {selectedFile.name}
                  </span>
                )}

                {photoPreview && (
                  <button
                    type="button"
                    className="profile-button"
                    onClick={handleRemovePhoto}
                    disabled={saving}
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>

            <div className="profile-form-footer">
              <p>
                <span className="profile-save-indicator" />
                Changes are saved to your Skillora account.
              </p>

              <button
                type="submit"
                className="profile-button profile-button-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="profile-button-spinner" />
                    {uploading ? "Uploading photo..." : "Saving changes..."}
                  </>
                ) : (
                  <>
                    Save changes
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        <section className="profile-security-note">
          <div className="profile-security-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="10" width="16" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              <path d="M12 14v3" />
            </svg>
          </div>

          <div>
            <h3>Your information stays protected</h3>
            <p>
              Your profile is linked to your authenticated account. Password
              and email changes are not available from this page.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
