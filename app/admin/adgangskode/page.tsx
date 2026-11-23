'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { authClient } from '@/lib/auth-client';

export default function AdminPasswordPage() {
  const [token, setToken] = useState<string | null>(null);
  const [invalidToken, setInvalidToken] = useState(false);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token'));
    setInvalidToken(params.has('error'));
  }, []);

  async function requestReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const result = await authClient.requestPasswordReset({
        email: email.trim().toLowerCase(),
        redirectTo: `${window.location.origin}/admin/adgangskode`,
      });
      if (result.error) {
        setError('Vi kunne ikke behandle anmodningen lige nu. Prøv igen senere.');
      } else {
        // Do not disclose whether an account exists.
        setSent(true);
      }
    } catch {
      setError('Der opstod en fejl. Prøv igen senere.');
    } finally {
      setLoading(false);
    }
  }

  async function setPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || !token) return;
    if (newPassword.length < 12) {
      setError('Adgangskoden skal indeholde mindst 12 tegn.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Adgangskoderne er ikke ens.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await authClient.resetPassword({ token, newPassword });
      if (result.error) {
        setError('Linket er ugyldigt eller udløbet. Anmod om et nyt link.');
      } else {
        setUpdated(true);
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setError('Der opstod en fejl. Prøv igen senere.');
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
        <h1>{token ? 'Vælg adgangskode' : 'Adgangskode'}</h1>

        {updated ? (
          <>
            <p>Din adgangskode er opdateret. Du kan nu logge ind.</p>
            <Link href="/admin/login" className="admin-button admin-button--primary">
              Gå til login
            </Link>
          </>
        ) : token ? (
          <form className="admin-login__form" onSubmit={setPassword}>
            <p>Vælg en personlig adgangskode på mindst 12 tegn.</p>
            <label className="admin-login__field">
              <span>Ny adgangskode</span>
              <input
                type="password"
                autoComplete="new-password"
                minLength={12}
                maxLength={128}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />
            </label>
            <label className="admin-login__field">
              <span>Gentag adgangskode</span>
              <input
                type="password"
                autoComplete="new-password"
                minLength={12}
                maxLength={128}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </label>
            {error && <p className="admin-login__error" role="alert">{error}</p>}
            <button
              type="submit"
              className="admin-button admin-button--primary"
              disabled={loading}
            >
              {loading ? 'Gemmer…' : 'Gem adgangskode'}
            </button>
          </form>
        ) : sent ? (
          <p>
            Hvis e-mailadressen har en konto, modtager du snart et link til at vælge
            en ny adgangskode. Tjek også spam.
          </p>
        ) : (
          <form className="admin-login__form" onSubmit={requestReset}>
            <p>
              Indtast din godkendte e-mailadresse. Vi sender et engangslink,
              så du selv kan vælge din adgangskode.
            </p>
            {invalidToken && (
              <p className="admin-login__error" role="alert">
                Det tidligere link er ugyldigt eller udløbet. Anmod om et nyt.
              </p>
            )}
            <label className="admin-login__field">
              <span>E-mailadresse</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            {error && <p className="admin-login__error" role="alert">{error}</p>}
            <button
              type="submit"
              className="admin-button admin-button--primary"
              disabled={loading}
            >
              {loading ? 'Sender…' : 'Send link'}
            </button>
          </form>
        )}

        <Link href="/admin/login" className="admin-button admin-button--secondary">
          Tilbage til login
        </Link>
        <p className="admin-login__help">
          Har du ikke en konto, skal BB Digital ApS godkende din adgang.
        </p>
      </section>
    </main>
  );
}
