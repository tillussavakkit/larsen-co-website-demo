import { AdminLogout } from '@/components/admin/admin-logout';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { requireCmsAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export default async function AdminCmsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireCmsAdmin('/admin');

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <span className="admin-topbar__eyebrow">Larsen &amp; Co. CMS</span>
            <strong>{user.displayName}</strong>
          </div>
          <AdminLogout />
        </header>
        <main className="admin-main" id="main-content">
          <div className="admin-main__inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
