import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import classNames from 'classnames';
import { verifyLogin } from '~/api/auth';
import { useAppDispatch } from '~/redux/hooks';
import { setUser } from '~/redux/slices/userSlice';
import { login } from '~/redux/slices/authSlice';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const domain = searchParams.get('domain') || '';

  useEffect(() => {
    if (!domain) {
      navigate('/auth/company-url');
    }
  }, [domain, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Match the exact object structure from React Native app
      // Domain comes with https:// prefix from company URL screen
      const loginObject = {
        domain: domain, // Already includes https://
        user: '',
        code: email,
        screen: '',
        token: '',
        key: '',
        stamp: '',
        company: '',
        isEmbeddedLogin: false,
        appToken: '',
        employeeAccessSignature: '',
        password: password,
        session: '',
      };

      const response = await verifyLogin(loginObject);

      if (response?.data?.token) {
        // Store token in Redux
        dispatch(setUser({
          token: response.data.token,
          email: email,
          name: response.data.name || email,
        }));
        dispatch(login({ token: response.data.token }));

        // Navigate to home
        navigate('/');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-3xl font-bold shadow-lg mb-4">
            R
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Sign in to <span className="text-blue-600">Roster</span>
          </h1>
          <p className="text-gray-600 mt-2">{domain}</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email / Username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="Enter your email or username"
                className={classNames(
                  'w-full px-4 py-3 border rounded-lg transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  {
                    'border-red-500': error,
                    'border-gray-300': !error,
                  }
                )}
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your password"
                  className={classNames(
                    'w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500',
                    {
                      'border-red-500': error,
                      'border-gray-300': !error,
                    }
                  )}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 font-semibold hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className={classNames(
                'w-full py-3 rounded-lg font-semibold text-white transition-all duration-200',
                'flex items-center justify-center gap-2 shadow-lg',
                {
                  'bg-blue-600 hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5':
                    !loading && email.trim() && password.trim(),
                  'bg-gray-400 cursor-not-allowed': loading || !email.trim() || !password.trim(),
                }
              )}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Back to Domain */}
          <div className="mt-6">
            <button
              onClick={() => navigate('/auth/company-url')}
              className="w-full text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              ← Back to Domain Selection
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2026 Roster App. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

