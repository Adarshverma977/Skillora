
import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Inbox,
  LoaderCircle,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react';

import { useToast } from '../context/ToastContext';
import {
  resendVerificationEmail,
  verifyEmail,
} from '../services/authService';

import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import './VerifyEmailPage.css';

const VerifyEmailPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const email = location.state?.email || '';

  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('idle');
      setMessage('');
      return;
    }

    let isActive = true;

    const verify = async () => {
      setStatus('loading');
      setMessage('Verifying your email...');

      try {
        const result = await verifyEmail(token);

        if (isActive) {
          setStatus('success');
          setMessage(
            result.message ||
            'Your email has been verified successfully.',
          );
        }
      } catch (error) {
        if (isActive) {
          setStatus('error');
          setMessage(
            error.response?.data?.message ||
            'Email verification failed. The link may have expired or already been used.',
          );
        }
      }
    };

    verify();

    return () => {
      isActive = false;
    };
  }, [searchParams]);

  const handleResend = async () => {
    if (!email || isResending) return;

    setIsResending(true);
    setResendMessage('');
    setResendError('');

    try {
      const result = await resendVerificationEmail({ email });

      setResendMessage(
        result.message ||
        'If this account requires verification, a verification email will be sent.',
      );

      showToast('Verification request submitted.', 'success');
    } catch (error) {
      if (error.response?.status === 429) {
        setResendError(
          'Too many requests. Please wait 15 minutes before trying again.',
        );
      } else {
        setResendError(
          error.response?.data?.message ||
          'Unable to resend the verification email. Please try again.',
        );
      }
    } finally {
      setIsResending(false);
    }
  };

  const openEmailApp = () => {
    if (!email) return;

    window.location.href = `mailto:${encodeURIComponent(email)}`;
  };

  const isVerifyingLink = searchParams.has('token');

  return (
    <main className="verify-email-page">
      <header className="verify-email-header">
        <Link
          to="/"
          className="verify-email-brand"
          aria-label="Skillora home"
        >
          <Logo />
        </Link>

        <ThemeToggle />
      </header>

      <section className="verify-email-card" aria-live="polite">
        {status === 'loading' && (
          <LoaderCircle className="verify-email-icon" />
        )}

        {status === 'success' && (
          <CheckCircle2 className="verify-email-icon success" />
        )}

        {status === 'error' && (
          <XCircle className="verify-email-icon error" />
        )}

        {!isVerifyingLink && (
          <div className="verify-email-illustration">
            <span className="verify-email-sparkle sparkle-one">
              <Sparkles size={20} />
            </span>

            <span className="verify-email-sparkle sparkle-two">
              <ShieldCheck size={22} />
            </span>

            <div className="verify-email-envelope">
              <Mail size={58} strokeWidth={1.5} />
              <span className="verify-email-envelope-check">
                <CheckCircle2 size={25} />
              </span>
            </div>
          </div>
        )}

        <span className="verify-email-eyebrow">
          {isVerifyingLink
            ? 'ACCOUNT SECURITY'
            : 'ONE LAST STEP'}
        </span>

        <h1>
          {status === 'loading'
            ? 'Verifying your email'
            : status === 'success'
              ? 'Email verified!'
              : status === 'error'
                ? 'Verification failed'
                : 'Check your email'}
        </h1>

        <p className="verify-email-description">
          {isVerifyingLink
            ? message
            : 'We have sent a verification link to your email address. Open the email and click the link to activate your Skillora account.'}
        </p>

        {!isVerifyingLink && email && (
          <div className="verify-email-address">
            <span className="verify-email-address-icon">
              <Mail size={19} />
            </span>

            <span className="verify-email-address-text">
              <small>Verification email sent to</small>
              <strong>{email}</strong>
            </span>
          </div>
        )}

        {!isVerifyingLink && (
          <>
            <button
              type="button"
              className="verify-email-primary"
              onClick={openEmailApp}
              disabled={!email}
            >
              <Inbox size={19} />
              Open Email App
              <ExternalLink size={16} />
            </button>

            <div className="verify-email-resend">
              <p>Didn't receive the email?</p>

              <button
                type="button"
                className="verify-email-resend-button"
                onClick={handleResend}
                disabled={!email || isResending}
              >
                {isResending ? (
                  <LoaderCircle
                    size={17}
                    className="verify-email-spinner"
                  />
                ) : (
                  <RefreshCw size={16} />
                )}

                {isResending
                  ? 'Sending email...'
                  : 'Resend verification email'}
              </button>
            </div>

            {resendMessage && (
              <p className="verify-email-feedback success" role="status">
                {resendMessage}
              </p>
            )}

            {resendError && (
              <p className="verify-email-feedback error" role="alert">
                {resendError}
              </p>
            )}

            <p className="verify-email-spam-note">
              Please check your spam or junk folder too.
            </p>
          </>
        )}

        {isVerifyingLink && status !== 'loading' && (
          <Link
            to={status === 'success' ? '/login' : '/register'}
            className="verify-email-primary verify-email-link"
          >
            {status === 'success'
              ? 'Continue to login'
              : 'Back to registration'}
          </Link>
        )}

        <Link to="/login" className="verify-email-back">
          <ArrowLeft size={16} />
          Back to sign in
        </Link>
      </section>

      <p className="verify-email-footer">
        Made for your growth. Built for your goals.
      </p>
    </main>
  );
};

export default VerifyEmailPage;
