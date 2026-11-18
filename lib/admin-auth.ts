import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAuth } from '@/lib/auth';
import type { CmsUser } from '@/lib/cms-user';

export function isCmsAdminEmail(email: string) {
  const allowed = (process.env.CMS_ADMIN_EMAILS ?? '')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);

  return allowed.includes(email.trim().toLowerCase());
}

export async function getCmsAdmin(): Promise<CmsUser | null> {
  const session = await getAuth().api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  const user = session.user;

  if (!isCmsAdminEmail(user.email)) return null;

  return {
    userId: user.id,
    email: user.email,
    displayName: user.name || user.email,
    fullName: user.name || null,
  };
}

export async function requireCmsAdmin(returnTo = '/admin') {
  const user = await getCmsAdmin();

  if (!user) {
    const path =
      returnTo.startsWith('/') && !returnTo.startsWith('//')
        ? returnTo
        : '/admin';

    redirect(`/admin/login?return_to=${encodeURIComponent(path)}`);
  }

  return user;
}

export async function authorizeAdminApi(): Promise<
  | { ok: true; user: CmsUser }
  | { ok: false; response: Response }
> {
  const user = await getCmsAdmin();

  if (!user) {
    return {
      ok: false,
      response: Response.json(
        { error: 'Du har ikke administratoradgang.' },
        { status: 401 },
      ),
    };
  }

  return { ok: true, user };
}
