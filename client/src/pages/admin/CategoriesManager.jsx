import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function CategoriesManager() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: '', slug: '', icon: '' });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.categories.getAll()).data.data,
  });

  const createMut = useMutation({
    mutationFn: (data) => api.categories.create(data),
    onSuccess: () => {
      toast.success('Category created');
      setForm({ name: '', slug: '', icon: '' });
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id) => api.categories.delete(id),
    onSuccess: () => {
      toast.success('Category deleted');
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-black">Categories</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createMut.mutate(form);
        }}
        className="grid grid-cols-1 gap-3 rounded bg-white p-4 shadow-sm sm:grid-cols-4"
      >
        <input
          type="text"
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded border px-3 py-2 text-sm"
        />
        <input
          type="text"
          required
          placeholder="Slug"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="rounded border px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Icon URL"
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          className="rounded border px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded bg-brand-primary font-bold text-brand-black hover:bg-brand-hover hover:text-white">
          Add Category
        </button>
      </form>

      <div className="rounded bg-white shadow-sm">
        <ul className="divide-y">
          {categories.map((cat) => (
            <li key={cat._id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                {cat.icon && <img src={cat.icon} alt={cat.name} className="h-6 w-6 object-contain" />}
                <div>
                  <p className="font-semibold">{cat.name}</p>
                  <p className="text-xs text-gray-400">/{cat.slug}/</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => deleteMut.mutate(cat._id)}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

