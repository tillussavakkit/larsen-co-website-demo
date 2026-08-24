'use client';

import { FormEvent, useState } from 'react';
import { company } from '@/data/site';

type FormStatus =
  | 'idle'
  | 'sending'
  | 'success'
  | 'validation'
  | 'rate-limit'
  | 'unavailable'
  | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [messageLength, setMessageLength] = useState(0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.elements.namedItem('name') as HTMLInputElement;
    const message = form.elements.namedItem('message') as HTMLTextAreaElement;

    name.setCustomValidity(
      name.value.trim().length >= 2 ? '' : 'Indtast et navn på mindst 2 tegn.',
    );
    message.setCustomValidity(
      message.value.trim().length >= 10
        ? ''
        : 'Indtast en besked på mindst 10 tegn.',
    );

    if (!form.reportValidity()) {
      setStatus('validation');
      return;
    }

    setStatus('sending');
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 400) setStatus('validation');
        else if (response.status === 429) setStatus('rate-limit');
        else if (response.status === 503) setStatus('unavailable');
        else setStatus('error');
        return;
      }

      form.reset();
      setMessageLength(0);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate={false}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">
            Navn <span aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            onInput={(event) => event.currentTarget.setCustomValidity('')}
          />
        </div>

        <div className="field">
          <label htmlFor="email">
            E-mail <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </div>

        <div className="field">
          <label htmlFor="company">Firma</label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={120}
          />
        </div>

        <div className="field">
          <label htmlFor="phone">Telefon</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={40}
          />
        </div>

        <div className="field field--wide">
          <label htmlFor="subject">Hvad drejer opgaven sig om?</label>
          <select id="subject" name="subject" defaultValue="">
            <option value="">Vælg gerne</option>
            <option value="Minør- og sprængningsarbejde">
              Minør- og sprængningsarbejde
            </option>
            <option value="Jord- og terrænarbejde">Jord- og terrænarbejde</option>
            <option value="Andet">Andet</option>
          </select>
        </div>

        <div className="field field--wide">
          <div className="field__label-row">
            <label htmlFor="message">
              Besked <span aria-hidden="true">*</span>
            </label>
            <span>{messageLength}/3000</span>
          </div>
          <textarea
            id="message"
            name="message"
            required
            minLength={10}
            maxLength={3000}
            rows={7}
            onChange={(event) => {
              event.currentTarget.setCustomValidity('');
              setMessageLength(event.target.value.length);
            }}
          />
        </div>

        <div className="honeypot" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="form-submit">
        <button
          type="submit"
          className="button button--yellow"
          disabled={status === 'sending'}
        >
          {status === 'sending' ? 'Sender…' : 'Send forespørgsel'}
          <span aria-hidden="true">↗</span>
        </button>
        <p>Felter markeret med * skal udfyldes.</p>
      </div>

      <div className="form-status" aria-live="polite" aria-atomic="true">
        {status === 'success' && (
          <div className="form-status__message form-status__message--success">
            <strong>Tak for din henvendelse</strong>
            <span>Din besked er sendt. Larsen & Co. vender tilbage hurtigst muligt.</span>
          </div>
        )}
        {status === 'error' && (
          <div className="form-status__message form-status__message--error">
            <strong>Beskeden kunne ikke sendes</strong>
            <span>
              Prøv igen om et øjeblik, eller kontakt Larsen & Co. på {company.phone}.
            </span>
          </div>
        )}
        {status === 'validation' && (
          <div className="form-status__message form-status__message--error">
            <strong>Kontrollér formularen</strong>
            <span>Kontrollér navn, e-mail og besked, og prøv igen.</span>
          </div>
        )}
        {status === 'rate-limit' && (
          <div className="form-status__message form-status__message--error">
            <strong>For mange forsøg</strong>
            <span>Vent op til 15 minutter, før du sender formularen igen.</span>
          </div>
        )}
        {status === 'unavailable' && (
          <div className="form-status__message form-status__message--error">
            <strong>Formularen er midlertidigt utilgængelig</strong>
            <span>
              Prøv igen senere, eller kontakt Larsen & Co. på {company.phone}.
            </span>
          </div>
        )}
      </div>
    </form>
  );
}
