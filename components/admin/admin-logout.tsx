'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export function AdminLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function logout() {
    setLoading(true);
    setError('');

    try {
      const result = await authClient.signOut();

      if (result.error) {
        setError('Kunne ikke logge ud.');
        return;
      }

      window.location.replace('/admin/login');
    } catch {
      setError('Kunne ikke logge ud.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        className="admin-topbar__signout"
        onClick={logout}
        disabled={loading}
      >
        {loading ? 'Logger ud...' : 'Log ud'}
      </button>
      {error && <small role="alert">{error}</small>}
    </div>
  );
}
