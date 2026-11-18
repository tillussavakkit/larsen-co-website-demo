'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
} from 'react';
import { ConfirmationDialog } from './confirmation-dialog';
import { Notice } from './notice';
import {
  formatAdminDate,
  responseError,
  type MediaRecord,
} from './types';

const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const maxImageBytes = 8 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toLocaleString('da-DK', {
    maximumFractionDigits: 1,
  })} MB`;
}

export function MediaManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<MediaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingDelete, setPendingDelete] = useState<MediaRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filteredMedia = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('da-DK');
    if (!normalizedQuery) return media;
    return media.filter(
      (item) =>
        item.filename.toLocaleLowerCase('da-DK').includes(normalizedQuery) ||
        item.altText.toLocaleLowerCase('da-DK').includes(normalizedQuery),
    );
  }, [media, query]);
  const previewUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : ''),
    [selectedFile],
  );

  const loadMedia = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/media', {
        signal,
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error(
          await responseError(response, 'Mediebiblioteket kunne ikke hentes.'),
        );
      }
      const data = (await response.json()) as { media?: MediaRecord[] };
      setMedia(Array.isArray(data.media) ? data.media : []);
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === 'AbortError') return;
      setError(
        caught instanceof Error
          ? caught.message
          : 'Mediebiblioteket kunne ikke hentes.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      if (!controller.signal.aborted) void loadMedia(controller.signal);
    });
    return () => controller.abort();
  }, [loadMedia]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function chooseFile(file?: File) {
    setError('');
    setSuccess('');
    if (!file) {
      setSelectedFile(null);
      return;
    }
    if (!acceptedImageTypes.includes(file.type)) {
      setError('Brug JPG, PNG, WebP eller AVIF.');
      return;
    }
    if (file.size > maxImageBytes) {
      setError('Billedet må højst fylde 8 MB.');
      return;
    }
    setSelectedFile(file);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    chooseFile(event.dataTransfer.files[0]);
  }

  async function uploadMedia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedFile) {
      setError('Vælg et billede at uploade.');
      return;
    }
    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('altText', altText.trim());

    try {
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(
          await responseError(response, 'Billedet kunne ikke uploades.'),
        );
      }
      const data = (await response.json()) as { media?: MediaRecord };
      if (!data.media) throw new Error('Uploaden returnerede ingen mediefil.');
      setMedia((current) => [data.media as MediaRecord, ...current]);
      setSelectedFile(null);
      setAltText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setSuccess(`“${data.media.filename}” er uploadet.`);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Billedet kunne ikke uploades.',
      );
    } finally {
      setUploading(false);
    }
  }

  async function deleteMedia() {
    if (!pendingDelete) return;
    setDeleting(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(
        `/api/admin/media/${encodeURIComponent(pendingDelete.id)}`,
        { method: 'DELETE' },
      );
      if (!response.ok) {
        throw new Error(
          await responseError(response, 'Billedet kunne ikke slettes.'),
        );
      }
      setMedia((current) =>
        current.filter((item) => item.id !== pendingDelete.id),
      );
      setSuccess(`“${pendingDelete.filename}” er slettet.`);
      setPendingDelete(null);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Billedet kunne ikke slettes.',
      );
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  async function copyUrl(item: MediaRecord) {
    try {
      await navigator.clipboard.writeText(item.url);
      setSuccess(`Adressen til “${item.filename}” er kopieret.`);
      setError('');
    } catch {
      setError('Adressen kunne ikke kopieres automatisk.');
    }
  }

  if (loading) {
    return (
      <div className="admin-loading" role="status">
        <span className="admin-spinner" aria-hidden="true" />
        <span>Henter mediebibliotek…</span>
      </div>
    );
  }

  return (
    <div className="admin-media-manager">
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

      <section className="admin-panel admin-upload" aria-labelledby="upload-heading">
        <div className="admin-upload__intro">
          <p className="admin-kicker">Nyt medie</p>
          <h2 id="upload-heading">Upload et billede</h2>
          <p>JPG, PNG, WebP eller AVIF. Højst 8 MB.</p>
        </div>
        <form className="admin-upload__form" onSubmit={uploadMedia}>
          <label
            className={`admin-dropzone${dragging ? ' is-dragging' : ''}`}
            htmlFor="media-file"
            onDragEnter={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setDragging(false);
              }
            }}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Valgt billede" />
            ) : (
              <span className="admin-dropzone__symbol" aria-hidden="true">↑</span>
            )}
            <span className="admin-dropzone__copy">
              <strong>
                {selectedFile ? selectedFile.name : 'Vælg eller træk et billede hertil'}
              </strong>
              <span>
                {selectedFile
                  ? formatBytes(selectedFile.size)
                  : 'Klik for at åbne dine filer'}
              </span>
            </span>
            <input
              ref={fileInputRef}
              id="media-file"
              className="admin-visually-hidden"
              type="file"
              accept={acceptedImageTypes.join(',')}
              onChange={(event) => chooseFile(event.target.files?.[0])}
            />
          </label>
          <div className="admin-field">
            <div className="admin-field__label-row">
              <label htmlFor="media-alt">Alternativ tekst</label>
              <span>{altText.length}/240</span>
            </div>
            <input
              id="media-alt"
              value={altText}
              maxLength={240}
              required
              placeholder="Beskriv motivet kort og præcist"
              onChange={(event) => setAltText(event.target.value)}
            />
            <p className="admin-field__help">
              Beskriv billedets indhold og funktion for personer, der ikke kan se det.
            </p>
          </div>
          <button
            type="submit"
            className="admin-button admin-button--primary"
            disabled={uploading || !selectedFile}
          >
            {uploading ? 'Uploader…' : 'Upload billede'}
          </button>
        </form>
      </section>

      <section className="admin-media-library" aria-labelledby="library-heading">
        <div className="admin-media-library__header">
          <div>
            <p className="admin-kicker">Bibliotek</p>
            <h2 id="library-heading">Alle medier</h2>
          </div>
          <div className="admin-search-field">
            <label htmlFor="media-search">Søg i medier</label>
            <div>
              <span aria-hidden="true">⌕</span>
              <input
                id="media-search"
                type="search"
                value={query}
                placeholder="Filnavn eller beskrivelse…"
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>
        </div>

        {filteredMedia.length ? (
          <div className="admin-media-grid">
            {filteredMedia.map((item) => (
              <article className="admin-media-card" key={item.id}>
                <div className="admin-media-card__image">
                  {/* CMS media uses runtime URLs, so Next Image cannot know the source. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.altText || ''} loading="lazy" />
                </div>
                <div className="admin-media-card__content">
                  <strong title={item.filename}>{item.filename}</strong>
                  <p>{item.altText || 'Ingen alternativ tekst'}</p>
                  <span>
                    {formatBytes(item.sizeBytes)} · {formatAdminDate(item.createdAt)}
                  </span>
                </div>
                <div className="admin-media-card__actions">
                  <button
                    type="button"
                    className="admin-text-button"
                    onClick={() => void copyUrl(item)}
                  >
                    Kopiér adresse
                  </button>
                  <button
                    type="button"
                    className="admin-icon-button admin-icon-button--danger"
                    onClick={() => setPendingDelete(item)}
                    aria-label={`Slet ${item.filename}`}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            <span className="admin-empty__symbol" aria-hidden="true">◇</span>
            <h2>{media.length ? 'Ingen medier matcher' : 'Biblioteket er tomt'}</h2>
            <p>
              {media.length
                ? 'Prøv en anden søgning.'
                : 'Upload det første billede med formularen ovenfor.'}
            </p>
          </div>
        )}
      </section>

      <ConfirmationDialog
        open={pendingDelete !== null}
        title="Slet billede?"
        confirmLabel="Slet billede"
        danger
        busy={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => void deleteMedia()}
      >
        <p>
          <strong>{pendingDelete?.filename}</strong> slettes permanent. Billedet kan
          kun slettes, hvis det ikke bruges af en artikel.
        </p>
      </ConfirmationDialog>
    </div>
  );
}
