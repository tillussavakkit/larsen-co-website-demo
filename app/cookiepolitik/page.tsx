import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookiepolitik',
  description: 'Information om teknisk nødvendige cookies og administrationens login på larsenco.gl.',
  alternates: { canonical: '/cookiepolitik' },
};

export default function CookiePolicyPage() {
  return (
    <main id="main-content" className="legal-page">
      <header className="legal-page__masthead">
        <div className="shell">
          <p className="section-kicker section-kicker--yellow">Larsen & Co. · Oplysninger</p>
          <h1>Cookiepolitik</h1>
          <p>Senest opdateret: 20. november 2026</p>
        </div>
      </header>
      <article className="legal-page__content shell">
        <p className="legal-page__lead">
          Her forklarer vi, hvordan cookies og lignende teknologier bruges
          på larsenco.gl.
        </p>

        <section>
          <h2>Hvad er cookies?</h2>
          <p>
            Cookies er små oplysninger, som en hjemmeside kan gemme i din
            browser. De kan blandt andet bruges til at opretholde en sikker
            login-session eller huske valgte indstillinger.
          </p>
        </section>

        <section>
          <h2>Teknisk nødvendige cookies</h2>
          <p>
            Den beskyttede administration bruger sessionscookies via Better Auth,
            så godkendte administratorer kan logge ind og forblive logget ind.
            De bruges til sikker adgang og ikke til annoncering.
            Hvis du blokerer dem, vil administratorlogin muligvis ikke fungere.
          </p>
        </section>

        <section>
          <h2>Statistik og markedsføring</h2>
          <p>
            Vi har ikke tilføjet reklame- eller analyse-trackere til de
            offentlige sider i hjemmesidens egen kode. Hostingudbydere kan
            dog behandle tekniske trafik- og sikkerhedsoplysninger som led
            i driften; det er ikke nødvendigvis cookies på din enhed.
          </p>
          <p>
            Hvis vi senere tilføjer statistik, markedsføring eller andre
            ikke-nødvendige sporingsteknologier, vil vi opdatere denne
            politik og indhente eventuelt påkrævet samtykke, før de aktiveres.
          </p>
        </section>

        <section>
          <h2>Sådan styrer du cookies</h2>
          <p>
            Du kan se, blokere eller slette cookies i din browsers indstillinger.
            Bemærk, at blokering af nødvendige cookies kan påvirke funktioner
            som administrationens login.
          </p>
        </section>

        <section>
          <h2>Kontakt og personoplysninger</h2>
          <p>
            Har du spørgsmål om cookies, kan du skrive til{' '}
            <a href="mailto:benny@larsenco.gl">benny@larsenco.gl</a>.
            Læs også vores <Link href="/privatlivspolitik">privatlivspolitik</Link>.
          </p>
        </section>
      </article>
    </main>
  );
}
