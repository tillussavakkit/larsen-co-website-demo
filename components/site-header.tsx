'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { navigation } from '@/data/site';

type SiteHeaderProps = {
  tone?: 'overlay' | 'solid';
};

export function SiteHeader({ tone = 'solid' }: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstMobileLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === 'Tab') {
        const focusable = [
          menuButtonRef.current,
          ...Array.from(
            mobileMenuRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [],
          ),
        ].filter(
          (element): element is HTMLButtonElement | HTMLAnchorElement =>
            element !== null,
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={`site-header site-header--${tone}${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-open' : ''}`}
    >
      <div className="site-header__inner shell">
        <Link
          href="/"
          aria-label="Larsen & Co. — forside"
          className="brand-link"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/images/larsen-co/logos/larsen-co-full-logo-transparent.png"
            alt="Larsen & Co."
            width={850}
            height={241}
            className="brand-logo"
            priority
          />
        </Link>

        <nav aria-label="Primær navigation" className="desktop-nav">
          {navigation.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/kontakt" className="button button--yellow header-cta">
          Kontakt os

        </Link>

        <button
          ref={menuButtonRef}
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? 'Luk menu' : 'Åbn menu'}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
        </button>
      </div>

      <div
        ref={mobileMenuRef}
        id="mobile-navigation"
        className="mobile-menu"
        hidden={!menuOpen}
      >
        <nav aria-label="Mobil navigation" className="shell">
          {navigation.map((item, index) => (
            <Link
              href={item.href}
              key={item.href}
              ref={index === 0 ? firstMobileLinkRef : undefined}
              aria-current={pathname === item.href ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <span>0{index + 1}</span>
              {item.label}
            </Link>
          ))}
          <Link
            href="/kontakt"
            className="mobile-menu__cta"
            onClick={() => setMenuOpen(false)}
          >
            Start en henvendelse
          </Link>
        </nav>
      </div>
    </header>
  );
}
