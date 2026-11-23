import { betterAuth } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { admin } from 'better-auth/plugins';
import { getDb } from '@/db';
import * as authSchema from '@/db/auth-schema';

function createAuth() {
  return betterAuth({
    database: drizzleAdapter(getDb(), {
      provider: 'pg',
      schemaName: 'larsen_cms',
      schema: authSchema,
    }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      minPasswordLength: 12,
      resetPasswordTokenExpiresIn: 60 * 60,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => {
        const apiKey = process.env.RESEND_API_KEY;
        const from = process.env.RESEND_FROM_EMAIL;
        if (!apiKey || !from) {
          throw new Error('Resend er ikke konfigureret til adgangskoder.');
        }

        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from,
            to: [user.email],
            subject: 'Opret eller nulstil adgangskode – Larsen & Co.',
            text: [
              'Hej,',
              '',
              'Brug dette sikre link til at vælge din adgangskode til Larsen & Co.s administration:',
              url,
              '',
              'Linket udløber efter 1 time og kan kun bruges én gang.',
              'Hvis du ikke har bedt om denne mail, kan du se bort fra den.',
              '',
              'Larsen & Co. / BB Digital ApS',
            ].join('\n'),
          }),
        });
        if (!response.ok) {
          throw new Error('Kunne ikke sende e-mail med adgangskodelink.');
        }
      },
    },
    plugins: [admin()],
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
  });
}

let authInstance: ReturnType<typeof createAuth> | undefined;

export function getAuth() {
  authInstance ??= createAuth();
  return authInstance;
}
