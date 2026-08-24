import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main-content" className="not-found">
      <div className="not-found__inner shell">
        <span>404</span>
        <p className="section-kicker section-kicker--yellow">Siden blev ikke fundet</p>
        <h1>Du er kommet ud af sporet.</h1>
        <p>Siden findes ikke, men du kan finde tilbage til Larsen & Co. her.</p>
        <div className="not-found__actions">
          <Link href="/" className="button button--yellow">
            Gå til forsiden
          </Link>
          <Link href="/kontakt" className="button button--outline-light">
            Kontakt os
          </Link>
        </div>
      </div>
    </main>
  );
}
