'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Notice } from './notice';
import { responseError, type MediaRecord } from './types';

type MediaPickerDialogProps = {
  open: boolean;
  title: string;
  onSelect: (media: MediaRecord) => void;
  onCancel: () => void;
};

export function MediaPickerDialog({
  open,
  title,
  onSelect,
  onCancel,
}: MediaPickerDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const [media, setMedia] = useState<MediaRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

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
      setLoaded(true);
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
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open || loaded) return;
    const controller = new AbortController();
    queueMicrotask(() => {
      if (!controller.signal.aborted) void loadMedia(controller.signal);
    });
    return () => controller.abort();
  }, [loadMedia, loaded, open]);

  return (
    <dialog
      ref={dialogRef}
      className="admin-dialog admin-media-picker"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div className="admin-dialog__panel">
        <div className="admin-media-picker__header">
          <div>
            <p className="admin-kicker">Mediebibliotek</p>
            <h2 id={titleId}>{title}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="admin-icon-button"
            onClick={onCancel}
            aria-label="Luk mediebibliotek"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {error ? (
          <Notice variant="error">
            {error}{' '}
            <button
              type="button"
              className="admin-text-button"
              onClick={() => void loadMedia()}
            >
              Prøv igen
            </button>
          </Notice>
        ) : null}

        {loading ? (
          <div className="admin-loading" role="status">
            <span className="admin-spinner" aria-hidden="true" />
            <span>Henter billeder…</span>
          </div>
        ) : media.length ? (
          <div className="admin-media-picker__grid">
            {media.map((item) => (
              <button
                type="button"
                key={item.id}
                className="admin-media-picker__item"
                onClick={() => onSelect(item)}
              >
                {/* Runtime media URLs are not available to Next Image. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt="" />
                <span>
                  <strong>{item.filename}</strong>
                  <small>{item.altText || 'Ingen alternativ tekst'}</small>
                </span>
              </button>
            ))}
          </div>
        ) : loaded ? (
          <div className="admin-empty admin-empty--compact">
            <strong>Mediebiblioteket er tomt</strong>
            <p>Upload et billede under Medier, og prøv igen.</p>
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
