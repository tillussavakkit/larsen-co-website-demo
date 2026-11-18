'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { MediaPickerDialog } from './media-picker-dialog';
import { Notice } from './notice';
import {
  responseError,
  type AdminArticle,
  type MediaRecord,
} from './types';
import { useUnsavedChangesGuard } from './use-unsaved-changes-guard';

type ArticleEditorProps = {
  articleId?: string;
};

function emptyArticle(): AdminArticle {
  return {
    id: '',
    title: '',
    slug: '',
    excerpt: '',
    coverImageId: null,
    coverImageUrl: '',
    contentHtml: '',
    author: '',
    publicationDate: null,
    status: 'draft',
    seoTitle: '',
    seoDescription: '',
    version: 1,
  };
}

function normalizeArticle(article: Partial<AdminArticle>): AdminArticle {
  const fallback = emptyArticle();
  return {
    ...fallback,
    ...article,
    id: article.id ? String(article.id) : '',
    title: article.title ?? '',
    slug: article.slug ?? '',
    excerpt: article.excerpt ?? '',
    coverImageId: article.coverImageId ?? null,
    coverImageUrl: article.coverImageUrl ?? '',
    contentHtml: article.contentHtml ?? '',
    author: article.author ?? '',
    publicationDate: article.publicationDate ?? null,
    status: article.status ?? 'draft',
    seoTitle: article.seoTitle ?? '',
    seoDescription: article.seoDescription ?? '',
    version: Number(article.version) || 1,
  };
}

function slugify(value: string) {
  return value
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'oe')
    .replace(/å/g, 'aa')
    .replace(/Æ/g, 'Ae')
    .replace(/Ø/g, 'Oe')
    .replace(/Å/g, 'Aa')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('da-DK')
    .replace(/&/g, '-og-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 160);
}

function toDateTimeLocal(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 16);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function escapeAttribute(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function ArticleEditor({ articleId }: ArticleEditorProps) {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const selectedRangeRef = useRef<Range | null>(null);
  const slugEditedRef = useRef(Boolean(articleId));
  const [article, setArticle] = useState<AdminArticle>(() => emptyArticle());
  const [baseline, setBaseline] = useState(() => JSON.stringify(emptyArticle()));
  const [editorHydration, setEditorHydration] = useState('');
  const [loading, setLoading] = useState(Boolean(articleId));
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [success, setSuccess] = useState('');
  const [mediaPicker, setMediaPicker] = useState<'cover' | 'inline' | null>(null);

  const dirty = useMemo(
    () => JSON.stringify(article) !== baseline,
    [article, baseline],
  );

  useUnsavedChangesGuard(dirty);

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = editorHydration;
  }, [editorHydration]);

  const loadArticle = useCallback(
    async (signal?: AbortSignal) => {
      if (!articleId) return;
      setLoading(true);
      setLoadError('');
      try {
        const response = await fetch(
          `/api/admin/articles/${encodeURIComponent(articleId)}`,
          { signal, cache: 'no-store' },
        );
        if (!response.ok) {
          throw new Error(
            await responseError(response, 'Artiklen kunne ikke hentes.'),
          );
        }
        const data = (await response.json()) as {
          article?: Partial<AdminArticle>;
        };
        if (!data.article) throw new Error('Artiklen blev ikke fundet.');
        const loaded = normalizeArticle(data.article);
        setArticle(loaded);
        setBaseline(JSON.stringify(loaded));
        setEditorHydration(loaded.contentHtml);
        slugEditedRef.current = true;
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === 'AbortError') return;
        setLoadError(
          caught instanceof Error
            ? caught.message
            : 'Artiklen kunne ikke hentes.',
        );
      } finally {
        setLoading(false);
      }
    },
    [articleId],
  );

  useEffect(() => {
    if (!articleId) return;
    const controller = new AbortController();
    queueMicrotask(() => {
      if (!controller.signal.aborted) void loadArticle(controller.signal);
    });
    return () => controller.abort();
  }, [articleId, loadArticle]);

  function updateField<K extends keyof AdminArticle>(
    field: K,
    value: AdminArticle[K],
  ) {
    setArticle((current) => ({ ...current, [field]: value }));
    setSuccess('');
  }

  function runEditorCommand(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    updateField('contentHtml', editorRef.current?.innerHTML ?? '');
  }

  function addLink() {
    const url = window.prompt('Indsæt linkets adresse (https://…)');
    if (!url) return;
    runEditorCommand('createLink', url);
  }

  function openInlineMediaPicker() {
    const selection = window.getSelection();
    selectedRangeRef.current =
      selection && selection.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
    setMediaPicker('inline');
  }

  function selectMedia(media: MediaRecord) {
    if (mediaPicker === 'cover') {
      setArticle((current) => ({
        ...current,
        coverImageId: media.id,
        coverImageUrl: media.url,
      }));
      setSuccess('');
    } else if (mediaPicker === 'inline') {
      editorRef.current?.focus();
      const selection = window.getSelection();
      if (selection && selectedRangeRef.current) {
        selection.removeAllRanges();
        selection.addRange(selectedRangeRef.current);
      }
      const html = `<img src="${escapeAttribute(media.url)}" alt="${escapeAttribute(media.altText)}">`;
      runEditorCommand('insertHTML', html);
    }
    selectedRangeRef.current = null;
    setMediaPicker(null);
  }

  async function saveArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaveError('');
    setSuccess('');

    const payload: AdminArticle = {
      ...article,
      title: article.title.trim(),
      slug: article.slug.trim(),
      excerpt: article.excerpt.trim(),
      coverImageUrl: article.coverImageUrl.trim(),
      author: article.author.trim(),
      seoTitle: article.seoTitle.trim(),
      seoDescription: article.seoDescription.trim(),
      publicationDate: article.publicationDate
        ? new Date(article.publicationDate).toISOString()
        : null,
      version: Math.max(1, Number(article.version) || 1),
    };
    const url = articleId
      ? `/api/admin/articles/${encodeURIComponent(articleId)}`
      : '/api/admin/articles';

    try {
      const response = await fetch(url, {
        method: articleId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(
          await responseError(response, 'Artiklen kunne ikke gemmes.'),
        );
      }
      const data = (await response.json()) as {
        article?: Partial<AdminArticle>;
      };
      const saved = normalizeArticle(data.article ?? payload);
      setArticle(saved);
      setBaseline(JSON.stringify(saved));
      setEditorHydration(saved.contentHtml);
      setSuccess('Artiklen er gemt.');

      if (!articleId && saved.id) {
        router.replace(`/admin/artikler/${saved.id}`);
      }
    } catch (caught) {
      setSaveError(
        caught instanceof Error
          ? caught.message
          : 'Artiklen kunne ikke gemmes.',
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-loading" role="status">
        <span className="admin-spinner" aria-hidden="true" />
        <span>Henter artikel…</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="admin-state-card">
        <p className="admin-kicker">Artiklen er ikke tilgængelig</p>
        <h2>Kunne ikke åbne editoren</h2>
        <p>{loadError}</p>
        <div className="admin-state-card__actions">
          <button
            type="button"
            className="admin-button admin-button--primary"
            onClick={() => void loadArticle()}
          >
            Prøv igen
          </button>
          <Link href="/admin/artikler" className="admin-button admin-button--secondary">
            Tilbage til artikler
          </Link>
        </div>
      </div>
    );
  }

  const previewId = article.id || articleId;
  const previewHref = previewId
    ? `/admin/artikler/preview/${encodeURIComponent(previewId)}`
    : '';

  return (
    <form className="admin-editor" onSubmit={saveArticle}>
      <div className="admin-editor__bar">
        <div className="admin-editor__save-state" aria-live="polite">
          <span className={dirty ? 'is-dirty' : 'is-saved'} aria-hidden="true" />
          {dirty ? 'Ugemte ændringer' : articleId ? 'Alle ændringer er gemt' : 'Ny artikel'}
        </div>
        <div className="admin-editor__bar-actions">
          {previewHref ? (
            <Link
              href={previewHref}
              target="_blank"
              rel="noreferrer"
              className="admin-button admin-button--secondary"
            >
              Forhåndsvis
            </Link>
          ) : (
            <span
              className="admin-button admin-button--secondary is-disabled"
              aria-disabled="true"
              title="Gem artiklen først"
            >
              Forhåndsvis
            </span>
          )}
          <button
            type="submit"
            className="admin-button admin-button--primary"
            disabled={saving || !dirty}
          >
            {saving ? 'Gemmer…' : 'Gem artikel'}
          </button>
        </div>
      </div>

      {success ? (
        <Notice variant="success" onDismiss={() => setSuccess('')}>
          {success}
        </Notice>
      ) : null}
      {saveError ? (
        <Notice
          variant="error"
          title="Artiklen blev ikke gemt"
          onDismiss={() => setSaveError('')}
        >
          {saveError}
        </Notice>
      ) : null}

      <div className="admin-editor__grid">
        <div className="admin-editor__content">
          <section className="admin-panel admin-form-section">
            <div className="admin-form-section__heading">
              <span>01</span>
              <div>
                <h2>Artikel</h2>
                <p>Titel, kort introduktion og hovedindhold.</p>
              </div>
            </div>

            <div className="admin-field">
              <label htmlFor="article-title">Titel</label>
              <input
                id="article-title"
                value={article.title}
                required
                maxLength={160}
                onChange={(event) => {
                  const title = event.target.value;
                  setArticle((current) => ({
                    ...current,
                    title,
                    slug: slugEditedRef.current ? current.slug : slugify(title),
                  }));
                  setSuccess('');
                }}
              />
            </div>

            <div className="admin-field">
              <div className="admin-field__label-row">
                <label htmlFor="article-slug">URL-nøgle</label>
                <span>/nyheder/{article.slug || '…'}</span>
              </div>
              <input
                id="article-slug"
                value={article.slug}
                required
                maxLength={160}
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                title="Brug små bogstaver, tal og bindestreger."
                spellCheck={false}
                onChange={(event) => {
                  slugEditedRef.current = true;
                  updateField('slug', slugify(event.target.value));
                }}
              />
              <p className="admin-field__help">
                Brug små bogstaver og bindestreger. Ændr den kun med omtanke efter
                udgivelse.
              </p>
            </div>

            <div className="admin-field">
              <div className="admin-field__label-row">
                <label htmlFor="article-excerpt">Resumé</label>
                <span>{article.excerpt.length}/400</span>
              </div>
              <textarea
                id="article-excerpt"
                value={article.excerpt}
                rows={4}
                maxLength={400}
                onChange={(event) => updateField('excerpt', event.target.value)}
              />
            </div>

            <div className="admin-field">
              <label id="article-content-label">Artikeltekst</label>
              <div className="admin-rich-text">
                <div className="admin-rich-text__toolbar" role="toolbar" aria-label="Formatering">
                  <button type="button" title="Overskrift 2" aria-label="Overskrift 2" onMouseDown={(event) => event.preventDefault()} onClick={() => runEditorCommand('formatBlock', 'h2')}>H2</button>
                  <button type="button" title="Overskrift 3" aria-label="Overskrift 3" onMouseDown={(event) => event.preventDefault()} onClick={() => runEditorCommand('formatBlock', 'h3')}>H3</button>
                  <button type="button" title="Brødtekst" aria-label="Brødtekst" onMouseDown={(event) => event.preventDefault()} onClick={() => runEditorCommand('formatBlock', 'p')}>P</button>
                  <span className="admin-rich-text__divider" aria-hidden="true" />
                  <button type="button" title="Fed" aria-label="Fed" onMouseDown={(event) => event.preventDefault()} onClick={() => runEditorCommand('bold')}><strong>F</strong></button>
                  <button type="button" title="Kursiv" aria-label="Kursiv" onMouseDown={(event) => event.preventDefault()} onClick={() => runEditorCommand('italic')}><em>K</em></button>
                  <button type="button" title="Punktopstilling" aria-label="Punktopstilling" onMouseDown={(event) => event.preventDefault()} onClick={() => runEditorCommand('insertUnorderedList')}>•≡</button>
                  <span className="admin-rich-text__divider" aria-hidden="true" />
                  <button type="button" title="Indsæt link" aria-label="Indsæt link" onMouseDown={(event) => event.preventDefault()} onClick={addLink}>Link</button>
                  <button type="button" title="Indsæt billede fra mediebibliotek" aria-label="Indsæt billede fra mediebibliotek" onMouseDown={(event) => event.preventDefault()} onClick={openInlineMediaPicker}>▣</button>
                </div>
                <div
                  ref={editorRef}
                  className="admin-rich-text__editor"
                  contentEditable
                  role="textbox"
                  aria-multiline="true"
                  aria-labelledby="article-content-label"
                  data-placeholder="Skriv artiklens indhold…"
                  suppressContentEditableWarning
                  onInput={(event) =>
                    updateField('contentHtml', event.currentTarget.innerHTML)
                  }
                />
              </div>
            </div>
          </section>

          <section className="admin-panel admin-form-section">
            <div className="admin-form-section__heading">
              <span>02</span>
              <div>
                <h2>SEO og deling</h2>
                <p>Tekster til søgemaskiner og sociale delinger.</p>
              </div>
            </div>
            <div className="admin-field">
              <div className="admin-field__label-row">
                <label htmlFor="article-seo-title">SEO-titel</label>
                <span>{article.seoTitle.length}/70</span>
              </div>
              <input
                id="article-seo-title"
                value={article.seoTitle}
                maxLength={70}
                placeholder={article.title || 'Artiklens titel bruges som standard'}
                onChange={(event) => updateField('seoTitle', event.target.value)}
              />
            </div>
            <div className="admin-field">
              <div className="admin-field__label-row">
                <label htmlFor="article-seo-description">Meta-beskrivelse</label>
                <span>{article.seoDescription.length}/170</span>
              </div>
              <textarea
                id="article-seo-description"
                value={article.seoDescription}
                rows={4}
                maxLength={170}
                onChange={(event) =>
                  updateField('seoDescription', event.target.value)
                }
              />
              <p className="admin-field__help">
                Skriv helst 140–160 tegn, som tydeligt opsummerer artiklen.
              </p>
            </div>
          </section>
        </div>

        <aside className="admin-editor__settings">
          <section className="admin-panel admin-form-section admin-form-section--compact">
            <h2>Udgivelse</h2>
            <div className="admin-field">
              <label htmlFor="article-status">Status</label>
              <select
                id="article-status"
                value={article.status}
                onChange={(event) => {
                  const status = event.target.value;
                  setArticle((current) => ({
                    ...current,
                    status,
                    publicationDate:
                      status === 'published' && !current.publicationDate
                        ? new Date().toISOString()
                        : current.publicationDate,
                  }));
                  setSuccess('');
                }}
              >
                <option value="draft">Kladde</option>
                <option value="published">Udgivet / planlagt</option>
              </select>
            </div>
            <div className="admin-field">
              <label htmlFor="article-publication-date">Udgivelsesdato</label>
              <input
                id="article-publication-date"
                type="datetime-local"
                value={toDateTimeLocal(article.publicationDate)}
                onChange={(event) =>
                  updateField('publicationDate', event.target.value || null)
                }
              />
              <p className="admin-field__help">
                Du vælger tidspunktet i din enheds tidszone; hjemmesiden viser datoen i
                Nuuk-tid.
              </p>
            </div>
            <div className="admin-field">
              <label htmlFor="article-author">Forfatter</label>
              <input
                id="article-author"
                value={article.author}
                maxLength={120}
                autoComplete="name"
                onChange={(event) => updateField('author', event.target.value)}
              />
            </div>
          </section>

          <section className="admin-panel admin-form-section admin-form-section--compact">
            <h2>Coverbillede</h2>
            <div className="admin-field">
              <label htmlFor="article-cover">Billedadresse</label>
              <input
                id="article-cover"
                type="text"
                inputMode="url"
                value={article.coverImageUrl}
                placeholder="Vælg et billede eller indsæt en https://-adresse"
                onChange={(event) => {
                  const coverImageUrl = event.target.value;
                  setArticle((current) => ({
                    ...current,
                    coverImageId: null,
                    coverImageUrl,
                  }));
                  setSuccess('');
                }}
              />
              <p className="admin-field__help">
                Vælg et billede fra mediebiblioteket, eller indsæt en sikker
                https://-adresse.
              </p>
            </div>
            {article.coverImageUrl ? (
              <div className="admin-cover-preview">
                {/* External CMS URLs cannot be known at build time. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={article.coverImageUrl} alt="Forhåndsvisning af cover" />
              </div>
            ) : null}
            <button
              type="button"
              className="admin-button admin-button--secondary admin-button--full"
              onClick={() => setMediaPicker('cover')}
            >
              Vælg fra mediebibliotek
            </button>
            <Link href="/admin/medier" className="admin-text-link">
              Åbn mediebibliotek
            </Link>
          </section>
        </aside>
      </div>

      <MediaPickerDialog
        open={mediaPicker !== null}
        title={mediaPicker === 'cover' ? 'Vælg coverbillede' : 'Indsæt billede'}
        onSelect={selectMedia}
        onCancel={() => {
          selectedRangeRef.current = null;
          setMediaPicker(null);
        }}
      />
    </form>
  );
}
