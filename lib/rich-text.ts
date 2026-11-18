import sanitizeHtml from 'sanitize-html';

const richTextOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    'p',
    'h2',
    'h3',
    'strong',
    'em',
    'ul',
    'ol',
    'li',
    'a',
    'br',
    'blockquote',
    'figure',
    'figcaption',
    'img',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'loading'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['https'] },
  allowProtocolRelative: false,
  transformTags: {
    a: (_tagName, attribs) => ({
      tagName: 'a',
      attribs: {
        href: attribs.href ?? '#',
        ...(attribs.target === '_blank'
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {}),
      },
    }),
    img: (_tagName, attribs) => ({
      tagName: 'img',
      attribs: {
        src: attribs.src ?? '',
        alt: attribs.alt ?? '',
        loading: 'lazy',
      },
    }),
  },
};

export function sanitizeRichText(value: string) {
  return sanitizeHtml(value, richTextOptions).trim();
}

export function richTextPlainText(value: string) {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, ' ')
    .trim();
}
