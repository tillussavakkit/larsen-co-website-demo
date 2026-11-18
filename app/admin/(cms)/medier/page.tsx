import { MediaManager } from '@/components/admin/media-manager';

export default function MediaAdminPage() {
  return (
    <>
      <header className="admin-page-header">
        <div>
          <p className="admin-kicker">Filer</p>
          <h1>Mediebibliotek</h1>
          <p>Upload, gennemse og fjern billeder til artikler og nyheder.</p>
        </div>
      </header>
      <MediaManager />
    </>
  );
}
