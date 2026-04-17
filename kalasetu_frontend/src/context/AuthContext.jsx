import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextObject';
import { authService } from '../services/authService';
import { normalizeApiError } from '../services/errorService';
import { storage } from '../utils/storage';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = storage.getAccessToken();
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setError(null);
      return userData;
    } catch (err) {
      console.error('Failed to fetch user:', err);
      authService.logout();
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email,
    password,
    first_name,
    last_name,
    role,
    phone_number = '',
    region = '',
    captchaToken = ''
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register({
        email,
        password,
        password_confirm: password,
        first_name,
        last_name,
        role,
        phone_number,
        region,
        captcha_token: captchaToken,
      });
      return response;
    } catch (err) {
      const message = normalizeApiError(err, 'Registration failed');
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, captchaToken) => {
    try {
      setLoading(true);
      setError(null);
      await authService.login(email, password, captchaToken);

      // Fetch user data
      const userData = await fetchCurrentUser();
      return userData;
    } catch (err) {
      const message = normalizeApiError(err, 'Login failed');
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const updateProfile = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await authService.updateProfile(data);
      setUser(userData);
      return userData;
    } catch (err) {
      const message = normalizeApiError(err, 'Update failed');
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
