import { ArticleEditor } from '@/components/admin/article-editor';

export default function NewArticleAdminPage() {
  return (
    <>
      <header className="admin-page-header admin-page-header--compact">
        <div>
          <p className="admin-kicker">Artikler</p>
          <h1>Ny artikel</h1>
          <p>Gem som kladde, eller vælg en udgivelsesdato og publicer.</p>
        </div>
      </header>
      <ArticleEditor />
    </>
  );
}
