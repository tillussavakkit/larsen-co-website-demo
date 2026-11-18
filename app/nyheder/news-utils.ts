const newsDateFormatter = new Intl.DateTimeFormat('da-DK', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'America/Nuuk',
});

export function formatNewsDate(value: string | null) {
  if (!value) return '';

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : newsDateFormatter.format(date);
}

export function absoluteNewsImageUrl(value: string, siteUrl: string) {
  if (!value) return '';
  return value.startsWith('/') ? `${siteUrl}${value}` : value;
}
