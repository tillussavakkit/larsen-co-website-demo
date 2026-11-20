import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privatlivspolitik',
  description: 'Læs, hvordan Larsen & Co. behandler personoplysninger fra hjemmesiden og kontaktformularen.',
  alternates: { canonical: '/privatlivspolitik' },
};

export default function PrivacyPolicyPage() {
  return (
    <main id="main-content" className="legal-page">
      <header className="legal-page__masthead">
        <div className="shell">
          <p className="section-kicker section-kicker--yellow">Larsen & Co. · Oplysninger</p>
          <h1>Privatlivspolitik</h1>
          <p>Senest opdateret: 20. november 2026</p>
        </div>
      </header>
      <article className="legal-page__content shell">
        <p className="legal-page__lead">
          Her kan du læse, hvordan vi håndterer personoplysninger, når du besøger
          larsenco.gl, kontakter os eller bruger hjemmesidens administration.
        </p>

        <section>
          <h2>Hvem er dataansvarlig?</h2>
          <p>
            Larsen & Co. i Nuuk er ansvarlig for den behandling af personoplysninger,
            som sker i forbindelse med virksomhedens hjemmeside og henvendelser til os.
          </p>
          <p>
            Du kan kontakte os om personoplysninger på{' '}
            <a href="mailto:benny@larsenco.gl">benny@larsenco.gl</a> eller
            telefon <a href="tel:+299322228">+299 32 22 28</a>.
          </p>
        </section>

        <section>
          <h2>Hvilke oplysninger behandler vi?</h2>
          <p>
            Når du udfylder kontaktformularen, modtager vi dit navn,
            din e-mailadresse, din besked og eventuelle oplysninger om firma,
            telefonnummer og opgavetype.
          </p>
          <p>
            Ved besøg på hjemmesiden kan der desuden behandles tekniske
            oplysninger, eksempelvis IP-adresse, tidspunkt og oplysninger
            om browser eller forespørgsel, i forbindelse med drift og sikkerhed.
            For godkendte administratorer behandles også kontooplysninger,
            loginoplysninger og sessionsdata.
          </p>
        </section>

        <section>
          <h2>Hvorfor behandler vi oplysningerne?</h2>
          <p>
            Vi bruger oplysninger fra kontaktformularen til at besvare din
            henvendelse, vurdere den beskrevne opgave og eventuelt følge op
            på et samarbejde. Tekniske oplysninger og loginoplysninger bruges
            til at drive, beskytte og administrere hjemmesiden.
          </p>
          <p>
            Behandlingen sker, når den er nødvendig for at håndtere din
            henvendelse, for at tage skridt til et muligt samarbejde eller
            som led i vores saglige interesse i sikker og stabil drift,
            efter de regler der gælder for behandlingen.
          </p>
        </section>

        <section>
          <h2>Hvem behandler oplysninger på vores vegne?</h2>
          <p>
            Hjemmesiden drives via Netlify. Supabase bruges til administrationens
            database og mediebibliotek, og Resend bruges til at videresende
            beskeder fra kontaktformularen. Modtagne henvendelser håndteres
            desuden i virksomhedens e-mail.
          </p>
          <p>
            Disse leverandører kan behandle oplysninger på vores vegne som
            led i de nævnte tjenester. Behandling eller overførsel uden for
            Grønland kan forekomme afhængigt af leverandørernes infrastruktur
            og vilkår og skal ske efter gældende regler.
          </p>
        </section>

        <section>
          <h2>Hvor længe opbevarer vi oplysninger?</h2>
          <p>
            Vi opbevarer henvendelser, så længe det er nødvendigt for at
            behandle og følge op på dem eller dokumentere et eventuelt
            kundeforhold. Oplysninger slettes, når der ikke længere er et
            sagligt eller lovligt grundlag for opbevaring. Nogle
            oplysninger kan skulle gemmes længere på grund af lovkrav.
          </p>
          <p>
            Administratorkonti og sessionsoplysninger opbevares i det omfang,
            det er nødvendigt for sikker adgang og drift af hjemmesiden.
          </p>
        </section>

        <section>
          <h2>Dine rettigheder</h2>
          <p>
            Efter persondataloven for Grønland kan du efter omstændighederne
            bede om indsigt i, berigtigelse eller sletning af oplysninger om dig,
            eller gøre indsigelse mod behandlingen. Kontakt os på{' '}
            <a href="mailto:benny@larsenco.gl">benny@larsenco.gl</a>,
            hvis du har spørgsmål eller ønsker at gøre brug af dine rettigheder.
          </p>
          <p>
            Du kan også henvende dig til{' '}
            <a href="https://da.datatilsynet.gl/" target="_blank" rel="noopener noreferrer">
              Datatilsynet i Grønland
            </a>
            .
          </p>
        </section>

        <section>
          <h2>Cookies og ændringer</h2>
          <p>
            Læs mere om brugen af cookies på vores{' '}
            <Link href="/cookiepolitik">cookiepolitik</Link>.
            Vi kan opdatere denne privatlivspolitik, hvis hjemmesidens funktioner
            eller vores behandling af oplysninger ændrer sig.
          </p>
        </section>
      </article>
    </main>
  );
}
