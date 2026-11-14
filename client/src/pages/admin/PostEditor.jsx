import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Upload, Video, Trash2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function PostEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(slug);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'publish',
    featuredImageUrl: '',
    videoUrl: '',
    isFeatured: false,
    homeOrder: 999,
    categories: [],
    seo: { title: '', description: '', focusKeyword: '' },
  });
  const [postId, setPostId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoUploading(true);
    const toastId = toast.loading('Uploading video to Backblaze B2... (this may take a few moments)');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await api.media.upload(fd);
      const url = res.data.data.url;
      setForm((prev) => ({ ...prev, videoUrl: url }));
      toast.success('Video uploaded to Backblaze B2!', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Video upload failed. Check file size.', { id: toastId });
    } finally {
      setVideoUploading(false);
      e.target.value = '';
    }
  };

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.categories.getAll()).data.data,
  });

  useEffect(() => {
    if (!isEditing) return;
    api.posts.getBySlug(slug).then((res) => {
      const p = res.data.data;
      setPostId(p._id);
      setForm({
        title: p.title || '',
        slug: p.slug || '',
        content: p.content || '',
        excerpt: p.excerpt || '',
        status: p.status || 'publish',
        featuredImageUrl: p.featuredImage?.url || p.featuredImageUrl || '',
        videoUrl: p.videoUrl || '',
        isFeatured: Boolean(p.isFeatured),
        homeOrder: p.homeOrder ?? 999,
        categories: (p.categories || []).map((c) => c._id),
        seo: p.seo || { title: '', description: '', focusKeyword: '' },
      });
    });
  }, [isEditing, slug]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await api.media.upload(fd);
      setForm((prev) => ({ ...prev, featuredImageUrl: res.data.data.url }));
      toast.success('Uploaded to Backblaze B2!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing && postId) {
        await api.posts.update(postId, form);
        toast.success('Post updated!');
      } else {
        await api.posts.create(form);
        toast.success('Post created!');
      }
      navigate('/admin/posts');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold text-brand-black">
        {isEditing ? 'Edit Post' : 'Create New Post'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5 rounded bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-gray-600">Title *</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((prev) => ({
                ...prev,
                title,
                slug: isEditing
                  ? prev.slug
                  : title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)/g, ''),
              }));
            }}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-gray-600">Slug *</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-gray-600">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
            >
              <option value="publish">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Featured Post Toggle, Home Order & Video URL */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 rounded-lg bg-gray-50 p-4 border border-gray-200">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isFeatured"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-brand-hover focus:ring-brand-primary"
              />
              <label htmlFor="isFeatured" className="text-xs font-bold uppercase text-gray-800 cursor-pointer">
                ⭐ Featured on Home
              </label>
            </div>
            <p className="mt-1 text-[11px] text-gray-500">
              Pins post to top of its category / video section.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-gray-600">
              Home Priority / Order
            </label>
            <input
              type="number"
              min="1"
              max="999"
              value={form.homeOrder}
              onChange={(e) => setForm({ ...form, homeOrder: Number(e.target.value) || 999 })}
              placeholder="1 (Big card), 2, 3..."
              className="w-full rounded border border-gray-300 px-3 py-1.5 text-xs focus:border-brand-primary focus:outline-none"
            />
            <span className="text-[10px] text-gray-400">1 = First / Big card on home</span>
          </div>

          {/* Video Upload Directly to Backblaze B2 */}
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-gray-800">
              Video (Upload to Backblaze B2)
            </label>

            {!form.videoUrl ? (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-3 text-center transition-all hover:border-brand-primary hover:bg-brand-primary/5">
                <Video className="mb-1 h-5 w-5 text-brand-hover" />
                <span className="text-xs font-bold text-gray-800">
                  {videoUploading ? 'Uploading to Backblaze B2...' : 'Upload Video File'}
                </span>
                <span className="text-[10px] text-gray-400">
                  Select MP4, WebM, MOV (Auto-stored in Backblaze B2)
                </span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/ogg,video/x-matroska"
                  onChange={handleVideoUpload}
                  disabled={videoUploading}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white p-2.5 shadow-xs">
                <div className="mb-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    <span>Video Uploaded</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, videoUrl: '' }))}
                    className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Remove</span>
                  </button>
                </div>

                {/* Video Player Preview */}
                <div className="relative aspect-video w-full overflow-hidden rounded bg-black">
                  <video
                    src={form.videoUrl}
                    controls
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="mt-1 block truncate font-mono text-[9px] text-gray-400" title={form.videoUrl}>
                  {form.videoUrl}
                </span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-gray-600">Categories</label>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <label key={cat._id} className="flex items-center gap-1.5 text-sm">
                <input
                  type="checkbox"
                  checked={form.categories.includes(cat._id)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...form.categories, cat._id]
                      : form.categories.filter((id) => id !== cat._id);
                    setForm({ ...form, categories: next });
                  }}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-gray-600">
            Featured Image (URL or Upload to Backblaze B2)
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={form.featuredImageUrl}
              onChange={(e) => setForm({ ...form, featuredImageUrl: e.target.value })}
              placeholder="/images/... or https://..."
              className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-gray-600">Content (HTML)</label>
          <textarea
            rows={14}
            required
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full rounded border border-gray-300 p-3 font-mono text-xs focus:border-brand-primary focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/posts')}
            className="rounded border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-brand-primary px-6 py-2 text-sm font-bold text-brand-black hover:bg-brand-hover hover:text-white"
          >
            {saving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

