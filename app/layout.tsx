import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { siteUrl } from '@/lib/site-url';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Larsen & Co. | Entreprenør- og minørfirma i Nuuk',
    template: '%s | Larsen & Co.',
  },
  description:
    'Larsen & Co. i Nuuk udfører minør- og sprængningsarbejde samt jord- og terrænarbejde.',
  alternates: { canonical: siteUrl },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    url: siteUrl,
    title: 'Larsen & Co. | Entreprenør- og minørfirma i Nuuk',
    description:
      'Larsen & Co. udfører minør- og sprængningsarbejde samt jord- og terrænarbejde i Nuuk.',
    type: 'website',
    locale: 'da_DK',
    siteName: 'Larsen & Co.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Larsen & Co. — entreprenørarbejde i Nuuk',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Larsen & Co. | Entreprenør- og minørfirma i Nuuk',
    description:
      'Larsen & Co. udfører minør- og sprængningsarbejde samt jord- og terrænarbejde i Nuuk.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da">
      <body className={`${geistSans.variable} antialiased`}>
        <a href="#main-content" className="skip-link">
          Gå til indhold
        </a>
        <SiteHeader tone="overlay" />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
