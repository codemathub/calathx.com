import { Navigate, Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderOpen, Image, Users, Mail, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ADMIN_NAV = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Posts', to: '/admin/posts', icon: FileText },
  { label: 'Categories', to: '/admin/categories', icon: FolderOpen },
  { label: 'Media Library', to: '/admin/media', icon: Image },
  { label: 'Subscribers', to: '/admin/subscribers', icon: Users },
  { label: 'Contacts', to: '/admin/contacts', icon: Mail },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="flex w-64 shrink-0 flex-col bg-brand-black text-white">
        <div className="flex h-16 items-center justify-center border-b border-gray-800 px-4">
          <img src="/images/2019/03/calathx-logo.png" alt="CalathX Admin" className="h-9 object-contain" />
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded px-3 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-brand-primary text-brand-black'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-gray-800 p-4">
          <p className="mb-2 text-xs text-gray-400">Signed in as {user.displayName}</p>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded bg-gray-800 py-2 text-xs font-bold text-gray-200 hover:bg-red-600 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}

