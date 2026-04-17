import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from '../hooks/useAuth';
import { getDefaultRouteByRole } from '../utils/roleRoutes';
import { normalizeApiError } from '../services/errorService';
import { ErrorAlert } from '../components/ui/ErrorAlert';
import { Button } from '../components/ui/Button';
import '../styles/auth.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const captchaRef = useRef(null);
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!captchaToken) {
      setError('Please complete the captcha verification.');
      return;
    }

    setLoading(true);

    try {
      const userData = await login(email, password, captchaToken);
      navigate(getDefaultRouteByRole(userData?.role), { replace: true });
    } catch (err) {
      setError(normalizeApiError(err, 'Login failed. Please try again.'));
      setCaptchaToken('');
      captchaRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your Kalasetu account</p>

        <ErrorAlert message={error} />

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group captcha-group">
            {recaptchaSiteKey ? (
              <ReCAPTCHA
                ref={captchaRef}
                sitekey={recaptchaSiteKey}
                onChange={(token) => setCaptchaToken(token || '')}
              />
            ) : (
              <p className="captcha-config-error">Captcha is not configured. Contact support.</p>
            )}
          </div>

          <Button type="submit" className="auth-button" disabled={loading || !captchaToken || !recaptchaSiteKey}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="auth-link">
          Don't have an account?{' '}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
