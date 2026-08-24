import Image from 'next/image';
import Link from 'next/link';
import { company, navigation } from '@/data/site';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__top shell">
        <div className="site-footer__brand">
          <Image
            src="/images/larsen-co/logos/larsen-co-full-logo-transparent.png"
            alt="Larsen & Co. — entreprenør- og minørfirma"
            width={850}
            height={241}
            className="footer-logo"
          />
          <p>{company.description}</p>
        </div>

        <div className="site-footer__contact">
  <p className="footer-label">Kontakt</p>

  <a href={company.phoneHref}>
    {company.phone}
  </a>

  <a href={company.emailHref}>
    {company.email}
  </a>

  <span>{company.location}</span>
</div>

        <nav className="site-footer__nav" aria-label="Footer navigation">
          <p className="footer-label">Navigation</p>
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="site-footer__bottom shell">
        <span>© {year} Larsen & Co.</span>
        <span>Nuuk · Greenland</span>
      </div>
    </footer>
  );
}
