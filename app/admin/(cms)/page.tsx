import { DashboardOverview } from '@/components/admin/dashboard-overview';
import { contentDefinitions } from '@/lib/content-definitions';
import { getAdminOverview } from '@/lib/cms-repository';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const overview = await getAdminOverview();
  const pageCount = new Set(contentDefinitions.map((field) => field.page)).size;
  const articleCount =
    overview.counts.published + overview.counts.drafts + overview.counts.scheduled;

  return (
    <>
      <header className="admin-page-header">
        <div>
          <p className="admin-kicker">Overblik</p>
          <h1>God arbejdslyst</h1>
          <p>Her kan du holde hjemmesidens artikler, sider og billeder opdateret.</p>
        </div>
      </header>
      <DashboardOverview
        counts={{
          articles: articleCount,
          published: overview.counts.published,
          drafts: overview.counts.drafts,
          pages: pageCount,
          media: overview.counts.media,
        }}
        recent={overview.recentArticles.map((article) => ({
          id: article.id,
          title: article.title,
          type: 'article' as const,
          status:
            article.status === 'published' &&
            article.publicationDate &&
            article.publicationDate > overview.generatedAt
              ? 'scheduled'
              : article.status,
          updatedAt: article.updatedAt,
        }))}
      />
    </>
  );
}
