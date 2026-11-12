import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

export default function SubscribersList() {
  const { data: subscribers = [] } = useQuery({
    queryKey: ['admin-subscribers'],
    queryFn: async () => (await api.subscribers.getAll()).data.data,
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-black">Newsletter Subscribers ({subscribers.length})</h1>
      <div className="overflow-x-auto rounded bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Subscribed At</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {subscribers.map((s) => (
              <tr key={s._id}>
                <td className="px-4 py-3 font-medium">{s.email}</td>
                <td className="px-4 py-3">{s.status}</td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {new Date(s.subscribedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

