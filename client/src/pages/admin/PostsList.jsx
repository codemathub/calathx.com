import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Sparkles, Video, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function PostsList() {
  const queryClient = useQueryClient();
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'featured', 'videos'
  const [editingOrder, setEditingOrder] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ['admin-posts-all'],
    queryFn: async () => (await api.posts.getAll({ status: 'all', limit: 100 })).data.data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.posts.delete(id),
    onSuccess: () => {
      toast.success('Post deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-posts-all'] });
    },
    onError: () => toast.error('Failed to delete post'),
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: (id) => api.posts.toggleFeature(id),
    onSuccess: (res) => {
      toast.success(res.data.isFeatured ? 'Post marked as Featured ⭐' : 'Post removed from Featured');
      queryClient.invalidateQueries({ queryKey: ['admin-posts-all'] });
    },
    onError: () => toast.error('Failed to update featured status'),
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, homeOrder }) => api.posts.updateOrder(id, homeOrder),
    onSuccess: (res) => {
      toast.success(`Position updated to #${res.data.homeOrder}! Live on homepage.`);
      queryClient.invalidateQueries({ queryKey: ['admin-posts-all'] });
    },
    onError: () => toast.error('Failed to update order position'),
  });

  const allPosts = data || [];

  // Filter posts based on active tab
  const filteredPosts = allPosts.filter((post) => {
    if (filterTab === 'featured') return post.isFeatured;
    if (filterTab === 'videos') return Boolean(post.videoUrl);
    return true;
  });

  // Sort: when viewing featured or videos, sort strictly by homeOrder then publishedAt
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (filterTab === 'featured' || filterTab === 'videos') {
      const orderA = a.homeOrder ?? 999;
      const orderB = b.homeOrder ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    }
    return new Date(b.publishedAt) - new Date(a.publishedAt);
  });

  const handleOrderSave = (id, currentVal) => {
    const val = editingOrder[id];
    if (val === undefined || val === '') return;
    const num = Number(val);
    if (isNaN(num)) return;
    updateOrderMutation.mutate({ id, homeOrder: num });
    setEditingOrder((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleQuickStep = (post, delta) => {
    const current = post.homeOrder ?? 999;
    const next = Math.max(1, current + delta);
    updateOrderMutation.mutate({ id: post._id, homeOrder: next });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Manage Posts &amp; Homepage Order</h1>
          <p className="text-xs text-gray-500">
            Feature posts, set homepage card order, and control which video appears in the big hero card.
          </p>
        </div>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center gap-1.5 self-start rounded-lg bg-brand-primary px-4 py-2 text-xs font-black uppercase tracking-wider text-black shadow-sm transition-all hover:bg-brand-hover hover:text-white sm:self-auto"
        >
          + New Post
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setFilterTab('all')}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
            filterTab === 'all'
              ? 'bg-black text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Posts ({allPosts.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('featured')}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
            filterTab === 'featured'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Featured on Home ({allPosts.filter((p) => p.isFeatured).length})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('videos')}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
            filterTab === 'videos'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
          }`}
        >
          <Video className="h-3.5 w-3.5" />
          <span>Video Section Posts ({allPosts.filter((p) => p.videoUrl).length})</span>
        </button>
      </div>

      {/* Helper Banner for Order */}
      <div className="rounded-xl border border-brand-primary/40 bg-brand-primary/10 p-3.5 text-xs text-gray-800">
        <div className="flex items-start gap-2.5">
          <Award className="h-4 w-4 shrink-0 text-brand-hover mt-0.5" />
          <div>
            <strong className="font-bold text-black">How Homepage Ordering Works:</strong>
            <p className="mt-0.5 text-gray-600">
              Posts with <strong>Priority / Order #1</strong> appear in the <strong>Big Tall Card</strong> (e.g. for Video Tutorials). Positions #2, #3, #4, and #5 appear in the small stacked cards. Lower numbers appear first!
            </p>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3">Order / Position</th>
              <th className="px-4 py-3">Title &amp; Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Featured ⭐</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Loading posts...
                </td>
              </tr>
            ) : sortedPosts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No posts found in this tab.
                </td>
              </tr>
            ) : (
              sortedPosts.map((post) => {
                const isBigVideo = post.homeOrder === 1 && Boolean(post.videoUrl);
                const isFirstFeatured = post.homeOrder === 1 && post.isFeatured;
                const currentOrder = post.homeOrder ?? 999;
                const inputValue = editingOrder[post._id] ?? currentOrder;

                return (
                  <tr key={post._id} className="hover:bg-gray-50/80 transition-colors">
                    
                    {/* Position / Home Order Input & Controls */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center rounded-lg border border-gray-300 bg-white shadow-xs focus-within:border-brand-primary">
                          <input
                            type="number"
                            min="1"
                            max="999"
                            value={inputValue}
                            onChange={(e) =>
                              setEditingOrder({ ...editingOrder, [post._id]: e.target.value })
                            }
                            onBlur={() => handleOrderSave(post._id, currentOrder)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleOrderSave(post._id, currentOrder);
                            }}
                            className="w-14 px-2 py-1 text-center text-xs font-black text-gray-900 focus:outline-none"
                            title="Type a number and press Enter or click away to save"
                          />
                        </div>

                        {/* Quick Up/Down buttons */}
                        <div className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => handleQuickStep(post, -1)}
                            className="p-0.5 text-gray-400 hover:text-black leading-none"
                            title="Move Up (Lower number = Higher Priority)"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickStep(post, 1)}
                            className="p-0.5 text-gray-400 hover:text-black leading-none"
                            title="Move Down (Higher number)"
                          >
                            ▼
                          </button>
                        </div>

                        {/* Badges for Position 1 */}
                        {isBigVideo ? (
                          <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-xs">
                            🏆 Big Video
                          </span>
                        ) : isFirstFeatured ? (
                          <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase text-amber-900">
                            #1 Top Card
                          </span>
                        ) : currentOrder < 999 ? (
                          <span className="ml-1 text-[11px] font-bold text-gray-400">
                            Pos #{currentOrder}
                          </span>
                        ) : null}
                      </div>
                    </td>

                    {/* Title & Type */}
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="line-clamp-1">{post.title}</span>
                          {post.videoUrl && (
                            <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-800">
                              <Video className="h-3 w-3" />
                              <span>Video</span>
                            </span>
                          )}
                        </div>
                        {post.slug && (
                          <span className="text-[10px] font-mono text-gray-400">
                            /{post.slug}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                          post.status === 'publish'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>

                    {/* Featured on Home Toggle */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => toggleFeatureMutation.mutate(post._id)}
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                          post.isFeatured
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 shadow-xs'
                            : 'bg-gray-100 text-gray-400 border border-gray-200 hover:bg-gray-200 hover:text-gray-700'
                        }`}
                        title={post.isFeatured ? 'Featured (Click to unfeature)' : 'Click to feature on home'}
                      >
                        <span>{post.isFeatured ? '⭐ Featured' : '☆ Feature'}</span>
                      </button>
                    </td>

                    {/* Views */}
                    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                      {post.viewCount || 0}
                    </td>

                    {/* Published Date */}
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="space-x-3 px-4 py-3 text-right whitespace-nowrap">
                      <Link
                        to={`/admin/posts/edit/${post.slug}`}
                        className="font-bold text-brand-hover hover:underline text-xs"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete "${post.title}"?`)) {
                            deleteMutation.mutate(post._id);
                          }
                        }}
                        className="font-bold text-red-600 hover:underline text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
