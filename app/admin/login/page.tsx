'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { authClient } from '@/lib/auth-client';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const result = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
        rememberMe: true,
      });

      if (result.error) {
        setError('Login mislykkedes. Kontrollér e-mail og adgangskode.');
        return;
      }

      window.location.assign('/admin');
    } catch {
      setError('Der opstod en fejl. Prøv igen.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login" id="main-content">
      <section className="admin-login__card">
        <Link href="/" className="admin-login__brand">
          <span>Larsen &amp; Co.</span>
          <small>Administration</small>
        </Link>

        <p className="admin-kicker">Sikker adgang</p>
        <h1>Log ind</h1>
        <p>Administrer virksomhedens hjemmeside, artikler og billeder.</p>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <label className="admin-login__field">
            <span>E-mailadresse</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
              placeholder="navn@larsenco.gl"
              required
            />
          </label>

          <label className="admin-login__field">
            <span>Adgangskode</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <p className="admin-login__error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="admin-button admin-button--primary"
            disabled={loading}
          >
            {loading ? 'Logger ind...' : 'Log ind'}
          </button>
        </form>

        <Link href="/" className="admin-button admin-button--secondary">
          Tilbage til hjemmesiden
        </Link>

        <p className="admin-login__help">
          <Link href="/admin/adgangskode">Glemt adgangskode eller ny konto? Vælg din adgangskode</Link>
        </p>
        <p className="admin-login__help">
          Kontakt BB Digital ApS, hvis du har brug for administratoradgang.
        </p>
      </section>
    </main>
  );
}
