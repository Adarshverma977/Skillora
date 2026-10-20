
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, LoaderCircle, XCircle } from 'lucide-react';
import { verifyEmail } from '../services/authService';
import "./VerifyEmailPage.css";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('The verification link is missing its token.');
      return;
    }

    let isActive = true;

    const verify = async () => {
      try {
        const result = await verifyEmail(token);

        if (isActive) {
          setStatus('success');
          setMessage(result.message || 'Your email has been verified successfully.');
        }
      } catch (error) {
        if (isActive) {
          setStatus('error');
          setMessage(
            error.response?.data?.message ||
            'Email verification failed. The link may have expired or already been used.'
          );
        }
      }
    };

    verify();

    return () => {
      isActive = false;
    };
  }, [searchParams]);

  return (
    <main className="verify-email-page">
      <section className="verify-email-card" aria-live="polite">
        {status === 'loading' && <LoaderCircle className="verify-email-icon" />}
        {status === 'success' && (
          <CheckCircle2 className="verify-email-icon success" />
        )}
        {status === 'error' && (
          <XCircle className="verify-email-icon error" />
        )}

        <h1>
          {status === 'loading'
            ? 'Verifying your email'
            : status === 'success'
              ? 'Email verified!'
              : 'Verification failed'}
        </h1>

        <p>{message}</p>

        {status !== 'loading' && (
          <Link to={status === 'success' ? '/login' : '/register'}>
            {status === 'success' ? 'Continue to login' : 'Back to registration'}
          </Link>
        )}
      </section>
    </main>
  );
};

export default VerifyEmailPage;
