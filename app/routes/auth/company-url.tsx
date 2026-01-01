import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import classNames from 'classnames';
import { verifyDomain } from '~/api/auth';

export default function CompanyURLScreen() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domain.trim()) {
      setError('Please enter your domain.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Add https:// prefix to the domain
      const fullDomain = `https://${domain}`;
      
      const response = await verifyDomain({ domain });
      if (response?.data) {
        navigate(`/auth/login?domain=${encodeURIComponent(fullDomain)}`);
      } else {
        setError('Invalid domain. Please try again.');
      }
    } catch (err: any) {
      console.log(err);
      setError(err?.message || 'Domain verification failed. Please try again.');
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
            Welcome to <span className="text-blue-600">Roster</span>
          </h1>
          <p className="text-gray-600 mt-2">Enter your domain to continue</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Domain Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Domain
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm font-medium">https://</span>
                </div>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => {
                    setDomain(e.target.value);
                    setError('');
                  }}
                  placeholder="your-company.com"
                  className={classNames(
                    'w-full pl-20 pr-4 py-3 border rounded-lg transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500',
                    {
                      'border-red-500': error,
                      'border-gray-300': !error,
                    }
                  )}
                  disabled={loading}
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !domain.trim()}
              className={classNames(
                'w-full py-3 rounded-lg font-semibold text-white transition-all duration-200',
                'flex items-center justify-center gap-2 shadow-lg',
                {
                  'bg-blue-600 hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5':
                    !loading && domain.trim(),
                  'bg-gray-400 cursor-not-allowed': loading || !domain.trim(),
                }
              )}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <a href="#" className="text-blue-600 font-semibold hover:underline">
                Contact Support
              </a>
            </p>
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

