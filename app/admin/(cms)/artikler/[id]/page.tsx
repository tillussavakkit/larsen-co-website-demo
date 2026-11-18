import { ArticleEditor } from '@/components/admin/article-editor';

type PageProps = { params: Promise<{ id: string }> };

export default async function EditArticleAdminPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <>
      <header className="admin-page-header admin-page-header--compact">
        <div>
          <p className="admin-kicker">Artikler</p>
          <h1>Rediger artikel</h1>
          <p>Ændringer bliver først synlige, når artiklen er udgivet.</p>
        </div>
      </header>
      <ArticleEditor articleId={id} />
    </>
  );
}
