import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function MediaLibrary() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['admin-media'],
    queryFn: async () => (await api.media.getAll({ limit: 60 })).data.data,
  });

  const deleteMut = useMutation({
    mutationFn: (id) => api.media.delete(id),
    onSuccess: () => {
      toast.success('Deleted from B2 & DB');
      qc.invalidateQueries({ queryKey: ['admin-media'] });
    },
  });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      await api.media.upload(fd);
      toast.success('Uploaded to Backblaze B2!');
      qc.invalidateQueries({ queryKey: ['admin-media'] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-black">Media Library (Backblaze B2)</h1>
        <label className="cursor-pointer rounded bg-brand-primary px-4 py-2 text-sm font-bold text-brand-black hover:bg-brand-hover hover:text-white">
          Upload Image
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
        {(data || []).map((item) => (
          <div key={item._id} className="group relative overflow-hidden rounded bg-white p-2 shadow-sm">
            <img src={item.url} alt={item.altText} className="aspect-square w-full rounded object-cover" />
            <p className="mt-1 truncate text-[11px] text-gray-600">{item.filename}</p>
            <button
              type="button"
              onClick={() => deleteMut.mutate(item._id)}
              className="mt-1 text-[11px] font-bold text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

