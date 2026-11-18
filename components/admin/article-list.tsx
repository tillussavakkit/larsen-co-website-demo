'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfirmationDialog } from './confirmation-dialog';
import { Notice } from './notice';
import {
  articleStatusLabel,
  formatAdminDate,
  responseError,
  type AdminArticle,
} from './types';

type LoadState = 'loading' | 'ready' | 'error';

function effectiveStatus(article: AdminArticle) {
  if (
    article.status === 'published' &&
    article.publicationDate &&
    new Date(article.publicationDate).getTime() > Date.now()
  ) {
    return 'scheduled';
  }
  return article.status;
}

type ArticleListProps = {
  initialStatus?: 'all' | 'draft' | 'scheduled' | 'published';
};

type ArticleListStatus = NonNullable<ArticleListProps['initialStatus']>;

export function ArticleList({ initialStatus = 'all' }: ArticleListProps) {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [pendingDelete, setPendingDelete] = useState<AdminArticle | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadArticles = useCallback(async (signal?: AbortSignal) => {
    setLoadState('loading');
    setError('');
    try {
      const response = await fetch('/api/admin/articles', {
        signal,
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error(
          await responseError(response, 'Artiklerne kunne ikke hentes.'),
        );
      }
      const data = (await response.json()) as { articles?: AdminArticle[] };
      setArticles(Array.isArray(data.articles) ? data.articles : []);
      setLoadState('ready');
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === 'AbortError') return;
      setError(
        caught instanceof Error
          ? caught.message
          : 'Artiklerne kunne ikke hentes.',
      );
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      if (!controller.signal.aborted) void loadArticles(controller.signal);
    });
    return () => controller.abort();
  }, [loadArticles]);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('da-DK');
    return articles.filter((article) => {
      const matchesStatus =
        status === 'all' || effectiveStatus(article) === status;
      const matchesQuery =
        !normalizedQuery ||
        article.title.toLocaleLowerCase('da-DK').includes(normalizedQuery) ||
        article.slug.toLocaleLowerCase('da-DK').includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [articles, query, status]);

  async function deleteArticle() {
    if (!pendingDelete) return;
    setDeleting(true);
    setError('');
    try {
      const response = await fetch(
        `/api/admin/articles/${encodeURIComponent(pendingDelete.id)}`,
        { method: 'DELETE' },
      );
      if (!response.ok) {
        throw new Error(
          await responseError(response, 'Artiklen kunne ikke slettes.'),
        );
      }
      setArticles((current) =>
        current.filter((article) => article.id !== pendingDelete.id),
      );
      setSuccess(`“${pendingDelete.title}” er slettet.`);
      setPendingDelete(null);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Artiklen kunne ikke slettes.',
      );
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  if (loadState === 'loading') {
    return (
      <div className="admin-loading" role="status">
        <span className="admin-spinner" aria-hidden="true" />
        <span>Henter artikler…</span>
      </div>
    );
  }

  if (loadState === 'error') {
    return (
      <div className="admin-state-card">
        <p className="admin-kicker">Forbindelsesfejl</p>
        <h2>Artiklerne kunne ikke hentes</h2>
        <p>{error}</p>
        <button
          type="button"
          className="admin-button admin-button--primary"
          onClick={() => void loadArticles()}
        >
          Prøv igen
        </button>
      </div>
    );
  }

  return (
    <div className="admin-article-list">
      {success ? (
        <Notice variant="success" onDismiss={() => setSuccess('')}>
          {success}
        </Notice>
      ) : null}
      {error ? (
        <Notice variant="error" onDismiss={() => setError('')}>
          {error}
        </Notice>
      ) : null}

      <div className="admin-list-tools">
        <div className="admin-search-field">
          <label htmlFor="article-search">Søg i artikler</label>
          <div>
            <span aria-hidden="true">⌕</span>
            <input
              id="article-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Søg på titel eller URL…"
            />
          </div>
        </div>
        <div className="admin-filter-field">
          <label htmlFor="article-status">Status</label>
          <select
            id="article-status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as ArticleListStatus)
            }
          >
            <option value="all">Alle</option>
            <option value="draft">Kladder</option>
            <option value="scheduled">Planlagte</option>
            <option value="published">Udgivne</option>
          </select>
        </div>
        <Link href="/admin/artikler/ny" className="admin-button admin-button--primary">
          Ny artikel <span aria-hidden="true">+</span>
        </Link>
      </div>

      {filteredArticles.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Artikel</th>
                <th scope="col">Status</th>
                <th scope="col">Udgivelse</th>
                <th scope="col">Senest ændret</th>
                <th scope="col">
                  <span className="admin-visually-hidden">Handlinger</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article) => {
                const shownStatus = effectiveStatus(article);
                return (
                  <tr key={article.id}>
                    <td data-label="Artikel">
                      <Link
                        className="admin-table__title"
                        href={`/admin/artikler/${article.id}`}
                      >
                        <strong>{article.title || 'Uden titel'}</strong>
                        <span>/nyheder/{article.slug || '—'}</span>
                      </Link>
                    </td>
                    <td data-label="Status">
                      <span
                        className={`admin-status admin-status--${shownStatus}`}
                      >
                        {articleStatusLabel(shownStatus)}
                      </span>
                    </td>
                    <td data-label="Udgivelse">
                      {formatAdminDate(article.publicationDate)}
                    </td>
                    <td data-label="Senest ændret">
                      {formatAdminDate(article.updatedAt, true)}
                    </td>
                    <td className="admin-table__actions">
                      <Link
                        href={`/admin/artikler/${article.id}`}
                        className="admin-icon-button"
                        aria-label={`Rediger ${article.title || 'artikel'}`}
                      >

                      </Link>
                      <button
                        type="button"
                        className="admin-icon-button admin-icon-button--danger"
                        aria-label={`Slet ${article.title || 'artikel'}`}
                        onClick={() => setPendingDelete(article)}
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty">
          <span className="admin-empty__symbol" aria-hidden="true">
            ≡
          </span>
          <h2>{articles.length ? 'Ingen artikler matcher' : 'Ingen artikler endnu'}</h2>
          <p>
            {articles.length
              ? 'Prøv at ændre din søgning eller det valgte statusfilter.'
              : 'Opret den første artikel og gem den som kladde eller udgiv den med det samme.'}
          </p>
          {!articles.length ? (
            <Link
              href="/admin/artikler/ny"
              className="admin-button admin-button--primary"
            >
              Opret artikel
            </Link>
          ) : null}
        </div>
      )}

      <ConfirmationDialog
        open={pendingDelete !== null}
        title="Slet artikel?"
        confirmLabel="Slet artikel"
        danger
        busy={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => void deleteArticle()}
      >
        <p>
          <strong>{pendingDelete?.title}</strong> slettes permanent. Handlingen kan
          ikke fortrydes.
        </p>
      </ConfirmationDialog>
    </div>
  );
}
