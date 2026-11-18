import { ArticleList } from '@/components/admin/article-list';

type PageProps = { searchParams: Promise<{ status?: string }> };

export default async function ArticlesAdminPage({ searchParams }: PageProps) {
  const { status } = await searchParams;
  const initialStatus =
    status === 'draft' || status === 'scheduled' || status === 'published'
      ? status
      : 'all';
  return (
    <>
      <header className="admin-page-header">
        <div>
          <p className="admin-kicker">Indhold</p>
          <h1>Artikler og nyheder</h1>
          <p>Opret kladder, planlæg udgivelse og vedligehold publicerede artikler.</p>
        </div>
      </header>
      <ArticleList initialStatus={initialStatus} />
    </>
  );
}
