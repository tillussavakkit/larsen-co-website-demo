import { ContentManager } from '@/components/admin/content-manager';

export default function PagesAdminPage() {
  return (
    <>
      <header className="admin-page-header">
        <div>
          <p className="admin-kicker">Hjemmesiden</p>
          <h1>Faste sider</h1>
          <p>Rediger hjemmesidens godkendte tekstfelter uden at ændre design eller kode.</p>
        </div>
      </header>
      <ContentManager />
    </>
  );
}
