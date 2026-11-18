'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const adminLinks = [
  { href: '/admin', label: 'Overblik', mark: '▦' },
  { href: '/admin/artikler', label: 'Artikler', mark: '≡' },
  { href: '/admin/artikler/ny', label: 'Ny artikel', mark: '+' },
  { href: '/admin/sider', label: 'Sider', mark: '□' },
  { href: '/admin/medier', label: 'Medier', mark: '◇' },
] as const;

function isCurrentPath(pathname: string, href: string) {
  if (href === '/admin') return pathname === href;
  if (href === '/admin/artikler/ny') return pathname.startsWith(href);
  if (href === '/admin/artikler') {
    return (
      pathname === href ||
      (pathname.startsWith(`${href}/`) &&
        !pathname.startsWith('/admin/artikler/ny'))
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <aside className={`admin-sidebar${open ? ' is-open' : ''}`}>
      <div className="admin-sidebar__top">
        <Link
          href="/admin"
          className="admin-brand"
          aria-label="Larsen & Co. CMS — overblik"
          onClick={() => setOpen(false)}
        >
          <span className="admin-brand__name">Larsen &amp; Co.</span>
          <span className="admin-brand__product">CMS</span>
        </Link>
        <button
          type="button"
          className="admin-sidebar__toggle"
          aria-expanded={open}
          aria-controls="admin-navigation"
          aria-label={
            open
              ? 'Luk administrationens menu'
              : 'Åbn administrationens menu'
          }
          onClick={() => setOpen((current) => !current)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className="admin-sidebar__drawer" id="admin-navigation">
        <nav className="admin-navigation" aria-label="Administration">
          <p className="admin-navigation__label">Indhold</p>
          {adminLinks.map((link) => {
            const current = isCurrentPath(pathname, link.href);
            return (
              <Link
                href={link.href}
                key={link.href}
                className={current ? 'is-current' : undefined}
                aria-current={current ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                <span className="admin-navigation__mark" aria-hidden="true">
                  {link.mark}
                </span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <Link href="/" target="_blank" rel="noreferrer">
            Se hjemmeside
          </Link>
          <p>Larsen &amp; Co. · Nuuk</p>
        </div>
      </div>
    </aside>
  );
}
