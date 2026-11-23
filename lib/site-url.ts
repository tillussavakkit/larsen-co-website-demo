const fallbackSiteUrl =
  'https://larsenco.gl';

function trustedSiteOrigin(value: string | undefined) {
  const configured = value?.trim();
  if (!configured) return fallbackSiteUrl;

  try {
    const url = new URL(configured);
    const isHttp = url.protocol === 'https:' || url.protocol === 'http:';
    const isOriginOnly =
      url.pathname === '/' && !url.search && !url.hash && !url.username && !url.password;

    return isHttp && isOriginOnly ? url.origin : fallbackSiteUrl;
  } catch {
    return fallbackSiteUrl;
  }
}

export const siteUrl = trustedSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL);
