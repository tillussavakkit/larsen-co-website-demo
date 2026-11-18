'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Notice } from './notice';
import { responseError } from './types';
import { useUnsavedChangesGuard } from './use-unsaved-changes-guard';

type ContentField = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'tel' | 'number' | string;
  value: string;
  maxLength?: number;
};

type ContentSection = {
  label: string;
  fields: ContentField[];
};

type ContentPage = {
  id: string;
  label: string;
  sections: ContentSection[];
};

function isContentPages(value: unknown): value is ContentPage[] {
  return (
    Array.isArray(value) &&
    value.every(
      (page) =>
        page &&
        typeof page === 'object' &&
        typeof (page as ContentPage).id === 'string' &&
        typeof (page as ContentPage).label === 'string' &&
        Array.isArray((page as ContentPage).sections),
    )
  );
}

function valuesFromPages(pages: ContentPage[]) {
  return Object.fromEntries(
    pages.flatMap((page) =>
      page.sections.flatMap((section) =>
        section.fields.map((field) => [field.key, field.value] as const),
      ),
    ),
  );
}

export function ContentManager() {
  const [pages, setPages] = useState<ContentPage[] | null>(null);
  const [baseline, setBaseline] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const values = useMemo(() => (pages ? valuesFromPages(pages) : {}), [pages]);
  const dirty = pages !== null && JSON.stringify(values) !== baseline;
  useUnsavedChangesGuard(dirty);

  const loadContent = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/content', {
        signal,
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error(
          await responseError(response, 'Sideindholdet kunne ikke hentes.'),
        );
      }
      const data = (await response.json()) as { pages?: unknown };
      if (!isContentPages(data.pages)) {
        throw new Error('Sideindholdet har et ukendt format.');
      }
      setPages(data.pages);
      setBaseline(JSON.stringify(valuesFromPages(data.pages)));
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === 'AbortError') return;
      setError(
        caught instanceof Error
          ? caught.message
          : 'Sideindholdet kunne ikke hentes.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      if (!controller.signal.aborted) void loadContent(controller.signal);
    });
    return () => controller.abort();
  }, [loadContent]);

  function changeField(key: string, value: string) {
    setPages((current) =>
      current?.map((page) => ({
        ...page,
        sections: page.sections.map((section) => ({
          ...section,
          fields: section.fields.map((field) =>
            field.key === key ? { ...field, value } : field,
          ),
        })),
      })) ?? null,
    );
    setSuccess('');
  }

  async function saveContent() {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      });
      if (!response.ok) {
        throw new Error(
          await responseError(response, 'Sideindholdet kunne ikke gemmes.'),
        );
      }
      const data = (await response.json()) as { pages?: unknown };
      if (!isContentPages(data.pages)) {
        throw new Error('Serveren returnerede et ukendt indholdsformat.');
      }
      setPages(data.pages);
      setBaseline(JSON.stringify(valuesFromPages(data.pages)));
      setSuccess('Sideindholdet er gemt.');
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Sideindholdet kunne ikke gemmes.',
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-loading" role="status">
        <span className="admin-spinner" aria-hidden="true" />
        <span>Henter sideindhold…</span>
      </div>
    );
  }

  if (error && pages === null) {
    return (
      <div className="admin-state-card">
        <p className="admin-kicker">Forbindelsesfejl</p>
        <h2>Sideindholdet kunne ikke hentes</h2>
        <p>{error}</p>
        <button
          type="button"
          className="admin-button admin-button--primary"
          onClick={() => void loadContent()}
        >
          Prøv igen
        </button>
      </div>
    );
  }

  return (
    <div className="admin-content-manager">
      <div className="admin-editor__bar">
        <div className="admin-editor__save-state" aria-live="polite">
          <span className={dirty ? 'is-dirty' : 'is-saved'} aria-hidden="true" />
          {dirty ? 'Ugemte ændringer' : 'Alle ændringer er gemt'}
        </div>
        <button
          type="button"
          className="admin-button admin-button--primary"
          disabled={!dirty || saving}
          onClick={() => void saveContent()}
        >
          {saving ? 'Gemmer…' : 'Gem sider'}
        </button>
      </div>

      {success ? (
        <Notice variant="success" onDismiss={() => setSuccess('')}>
          {success}
        </Notice>
      ) : null}
      {error ? (
        <Notice
          variant="error"
          title="Indholdet blev ikke gemt"
          onDismiss={() => setError('')}
        >
          {error}
        </Notice>
      ) : null}

      {pages?.length ? (
        <div className="admin-content-groups">
          {pages.map((page, pageIndex) => (
            <section className="admin-panel admin-form-section" key={page.id}>
              <div className="admin-form-section__heading">
                <span>{String(pageIndex + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{page.label}</h2>
                  <p>Rediger de faste tekstfelter uden at ændre sidens layout.</p>
                </div>
              </div>

              <div className="admin-content-sections">
                {page.sections.map((section) => (
                  <fieldset
                    className="admin-content-section"
                    key={`${page.id}-${section.label}`}
                  >
                    <legend>{section.label}</legend>
                    <div className="admin-content-fields">
                      {section.fields.map((field) => {
                        const inputId = `content-${field.key.replace(/[^a-z0-9]/gi, '-')}`;
                        const inputType =
                          field.type === 'tel' || field.type === 'number'
                            ? field.type
                            : 'text';
                        return (
                          <div className="admin-field" key={field.key}>
                            <div className="admin-field__label-row">
                              <label htmlFor={inputId}>{field.label}</label>
                              {field.maxLength ? (
                                <span>
                                  {field.value.length}/{field.maxLength}
                                </span>
                              ) : null}
                            </div>
                            {field.type === 'textarea' ? (
                              <textarea
                                id={inputId}
                                value={field.value}
                                maxLength={field.maxLength}
                                rows={4}
                                onChange={(event) =>
                                  changeField(field.key, event.target.value)
                                }
                              />
                            ) : (
                              <input
                                id={inputId}
                                type={inputType}
                                value={field.value}
                                maxLength={field.maxLength}
                                onChange={(event) =>
                                  changeField(field.key, event.target.value)
                                }
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="admin-empty">
          <span className="admin-empty__symbol" aria-hidden="true">□</span>
          <h2>Ingen faste sider endnu</h2>
          <p>Når sideindhold er oprettet, kan de faste felter redigeres her.</p>
        </div>
      )}
    </div>
  );
}
