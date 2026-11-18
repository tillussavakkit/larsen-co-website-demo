import Image from 'next/image';
import Link from 'next/link';
import { navigation } from '@/data/site';
import { getSiteContent } from '@/lib/site-content';

export async function SiteFooter() {
  const year = new Date().getFullYear();
  const content = await getSiteContent();
  const phone = content['global.company.phone'];
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;

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
          <p>{content['global.footer.description']}</p>
        </div>

        <div className="site-footer__contact">
          <p className="footer-label">Kontakt</p>
          <a href={phoneHref}>{phone}</a>
          <span>{content['global.company.location']}</span>
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
        <span>© {year} {content['global.company.name']}</span>
        <span>{content['global.footer.location']}</span>
      </div>
    </footer>
  );
}
