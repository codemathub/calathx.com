import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function Dashboard() {
  const { data: postsData } = useQuery({
    queryKey: ['admin-posts-count'],
    queryFn: async () => (await api.posts.getAll({ status: 'all', limit: 5 })).data,
  });

  const { data: subscribers = [] } = useQuery({
    queryKey: ['admin-subscribers'],
    queryFn: async () => (await api.subscribers.getAll()).data.data,
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: async () => (await api.contact.getAll()).data.data,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-black">Dashboard</h1>
        <Link
          to="/admin/posts/new"
          className="rounded bg-brand-primary px-4 py-2 text-sm font-bold text-brand-black hover:bg-brand-hover hover:text-white"
        >
          + New Post
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase text-gray-500">Total Posts</p>
          <p className="mt-2 text-3xl font-black text-brand-black">{postsData?.pagination?.total || 0}</p>
        </div>
        <div className="rounded bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase text-gray-500">Subscribers</p>
          <p className="mt-2 text-3xl font-black text-brand-black">{subscribers.length}</p>
        </div>
        <div className="rounded bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase text-gray-500">Unread Contacts</p>
          <p className="mt-2 text-3xl font-black text-brand-black">
            {contacts.filter((c) => !c.read).length}
          </p>
        </div>
      </div>

      <div className="rounded bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-brand-black">Recent Posts</h2>
        <ul className="divide-y divide-gray-100">
          {(postsData?.data || []).map((p) => (
            <li key={p._id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-semibold text-gray-800">{p.title}</p>
                <p className="text-xs text-gray-400">
                  {p.status} · {new Date(p.publishedAt).toLocaleDateString()}
                </p>
              </div>
              <Link
                to={`/admin/posts/edit/${p.slug}`}
                className="text-xs font-bold text-brand-hover hover:underline"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

