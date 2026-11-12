import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export default function ContactSubmissions() {
  const qc = useQueryClient();
  const { data: contacts = [] } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: async () => (await api.contact.getAll()).data.data,
  });

  const markReadMut = useMutation({
    mutationFn: (id) => api.contact.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-contacts'] }),
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-black">Contact Submissions</h1>
      <div className="space-y-4">
        {contacts.map((c) => (
          <div key={c._id} className={`rounded bg-white p-5 shadow-sm ${!c.read ? 'border-l-4 border-brand-primary' : ''}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-brand-black">{c.name} ({c.email})</h3>
                <p className="text-xs text-gray-500">{c.subject} · {new Date(c.createdAt).toLocaleString()}</p>
              </div>
              {!c.read && (
                <button
                  type="button"
                  onClick={() => markReadMut.mutate(c._id)}
                  className="rounded bg-brand-primary px-3 py-1 text-xs font-bold text-brand-black"
                >
                  Mark Read
                </button>
              )}
            </div>
            <p className="mt-3 text-sm text-gray-700">{c.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

