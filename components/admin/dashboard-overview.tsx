import Link from 'next/link';
import {
  articleStatusLabel,
  formatAdminDate,
  type DashboardCounts,
  type RecentAdminItem,
} from './types';

type DashboardOverviewProps = {
  counts: DashboardCounts;
  recent: RecentAdminItem[];
};

export function DashboardOverview({ counts, recent }: DashboardOverviewProps) {
  const cards = [
    {
      label: 'Artikler',
      value: counts.articles ?? 0,
      detail: `${counts.published ?? 0} udgivet`,
      href: '/admin/artikler',
    },
    {
      label: 'Kladder',
      value: counts.drafts ?? 0,
      detail: 'Afventer redigering',
      href: '/admin/artikler?status=draft',
    },
    {
      label: 'Sider',
      value: counts.pages ?? 0,
      detail: 'Faste indholdssider',
      href: '/admin/sider',
    },
    {
      label: 'Medier',
      value: counts.media ?? 0,
      detail: 'Filer i biblioteket',
      href: '/admin/medier',
    },
  ];

  return (
    <div className="admin-dashboard">
      <section className="admin-stat-grid" aria-label="Indholdsoversigt">
        {cards.map((card) => (
          <Link href={card.href} className="admin-stat-card" key={card.label}>
            <span className="admin-stat-card__label">{card.label}</span>
            <strong>{card.value}</strong>
            <span className="admin-stat-card__detail">
              {card.detail}
            </span>
          </Link>
        ))}
      </section>

      <div className="admin-dashboard__lower">
        <section
          className="admin-panel admin-recent"
          aria-labelledby="recent-heading"
        >
          <div className="admin-panel__header">
            <div>
              <p className="admin-kicker">Seneste aktivitet</p>
              <h2 id="recent-heading">Senest ændret</h2>
            </div>
            <Link href="/admin/artikler" className="admin-text-link">
              Se alle
            </Link>
          </div>

          {recent.length ? (
            <ul className="admin-recent__list">
              {recent.map((item) => {
                const href =
                  item.href ||
                  (item.type === 'page'
                    ? '/admin/sider'
                    : `/admin/artikler/${item.id}`);
                return (
                  <li key={`${item.type ?? 'article'}-${item.id}`}>
                    <Link href={href}>
                      <span className="admin-recent__main">
                        <strong>{item.title}</strong>
                        <span>
                          {item.type === 'page' ? 'Side' : 'Artikel'}
                          {item.updatedAt
                            ? ` · ${formatAdminDate(item.updatedAt, true)}`
                            : ''}
                        </span>
                      </span>
                      {item.status ? (
                        <span
                          className={`admin-status admin-status--${item.status}`}
                        >
                          {articleStatusLabel(item.status)}
                        </span>
                      ) : null}
                      <span className="admin-recent__arrow" aria-hidden="true">

                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="admin-empty admin-empty--compact">
              <strong>Ingen aktivitet endnu</strong>
              <p>Nye og opdaterede indholdselementer vises her.</p>
            </div>
          )}
        </section>

        <aside
          className="admin-panel admin-quick-actions"
          aria-labelledby="quick-heading"
        >
          <p className="admin-kicker">Genveje</p>
          <h2 id="quick-heading">Kom hurtigt videre</h2>
          <div className="admin-quick-actions__links">
            <Link href="/admin/artikler/ny">
              <span>Opret ny artikel</span>
              <span aria-hidden="true">+</span>
            </Link>
            <Link href="/admin/sider">
              <span>Rediger faste sider</span>

            </Link>
            <Link href="/admin/medier">
              <span>Upload medie</span>
              <span aria-hidden="true">↑</span>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
