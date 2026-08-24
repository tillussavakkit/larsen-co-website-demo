'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { projects } from '@/data/site';

export function ProjectGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);
  const isOpen = selectedIndex !== null;

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedIndex(null);
      }
      if (event.key === 'ArrowLeft') {
        setSelectedIndex((current) =>
          current === null
            ? null
            : (current - 1 + projects.length) % projects.length,
        );
      }
      if (event.key === 'ArrowRight') {
        setSelectedIndex((current) =>
          current === null ? null : (current + 1) % projects.length,
        );
      }
      if (event.key === 'Tab') {
        const focusable = Array.from(
          modalRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? [],
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      returnFocusRef.current?.focus();
    };
  }, [isOpen]);

  const selectedProject =
    selectedIndex === null ? null : projects[selectedIndex];

  function openProject(index: number, button: HTMLButtonElement) {
    returnFocusRef.current = button;
    setSelectedIndex(index);
  }

  return (
    <>
      <div className="project-grid">
        {projects.map((project, index) => (
          <button
            type="button"
            className={`project-tile project-tile--${project.orientation}`}
            key={project.id}
            onClick={(event) => openProject(index, event.currentTarget)}
            aria-label={`Åbn billede: ${project.alt}`}
          >
            <Image
              src={project.image}
              alt={project.alt}
              fill
              sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
            />
            <span className="project-tile__overlay">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{project.label}</strong>
              <i aria-hidden="true">↗</i>
            </span>
          </button>
        ))}
      </div>

      {selectedProject && selectedIndex !== null && (
        <div
          ref={modalRef}
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedIndex(null);
          }}
        >
          <div className="lightbox__panel">
            <button
              ref={closeButtonRef}
              type="button"
              className="lightbox__close"
              onClick={() => setSelectedIndex(null)}
              aria-label="Luk billede"
            >
              Luk <span aria-hidden="true">×</span>
            </button>

            <div className="lightbox__image-wrap">
              <Image
                src={selectedProject.image}
                alt={selectedProject.alt}
                fill
                sizes="90vw"
                priority
              />
            </div>

            <div className="lightbox__footer">
              <div>
                <span>
                  {String(selectedIndex + 1).padStart(2, '0')} / {projects.length}
                </span>
                <h2 id="lightbox-title">{selectedProject.label}</h2>
              </div>
              <div className="lightbox__controls">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedIndex(
                      (selectedIndex - 1 + projects.length) % projects.length,
                    )
                  }
                  aria-label="Forrige billede"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedIndex((selectedIndex + 1) % projects.length)
                  }
                  aria-label="Næste billede"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
