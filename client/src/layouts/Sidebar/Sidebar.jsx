import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState('latest');
  const [email, setEmail] = useState('');

  const { data: latestPosts = [] } = useQuery({
    queryKey: ['sidebar-latest'],
    queryFn: async () => (await api.posts.getLatest(4)).data.data,
  });

  const { data: popularPosts = [] } = useQuery({
    queryKey: ['sidebar-popular'],
    queryFn: async () => (await api.posts.getPopular(4)).data.data,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.categories.getAll()).data.data,
  });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      const res = await api.subscribers.subscribe({ email: email.trim() });
      toast.success(res.data.message || 'Subscribed!');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to subscribe');
    }
  };

  const postsToShow = activeTab === 'latest' ? latestPosts : popularPosts;

  return (
    <aside className="space-y-6 rounded border border-gray-200 bg-white p-4 shadow-sm">
      {/* Latest / Popular Tabs */}
      <div>
        <div className="mb-3 flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('latest')}
            className={`flex-1 py-2 text-sm font-bold uppercase transition-colors ${
              activeTab === 'latest'
                ? 'border-b-2 border-brand-primary text-brand-black'
                : 'text-gray-500 hover:text-brand-black'
            }`}
          >
            Latest
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('popular')}
            className={`flex-1 py-2 text-sm font-bold uppercase transition-colors ${
              activeTab === 'popular'
                ? 'border-b-2 border-brand-primary text-brand-black'
                : 'text-gray-500 hover:text-brand-black'
            }`}
          >
            Popular
          </button>
        </div>

        <ul className="space-y-3">
          {postsToShow.map((post) => {
            const catSlug = post.categories?.[0]?.slug || 'fitness-workouts';
            const img = post.featuredImage?.url || post.featuredImageUrl || '/images/2018/10/1.jpg';
            return (
              <li key={post._id} className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0">
                <Link to={`/${catSlug}/${post.slug}`} className="shrink-0">
                  <img
                    src={img}
                    alt={post.title}
                    className="h-14 w-16 rounded object-cover"
                    loading="lazy"
                  />
                </Link>
                <div className="min-w-0">
                  <Link
                    to={`/${catSlug}/${post.slug}`}
                    className="line-clamp-2 text-xs font-semibold text-gray-800 hover:text-brand-hover"
                  >
                    {post.title}
                  </Link>
                  <span className="mt-1 block text-[11px] text-gray-400">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Categories Widget */}
      <div>
        <h4 className="mb-3 border-b border-gray-200 pb-2 text-sm font-bold uppercase tracking-wide text-brand-black">
          Categories
        </h4>
        <ul className="space-y-2 text-sm">
          {categories.map((cat) => (
            <li key={cat._id}>
              <Link
                to={`/${cat.slug}`}
                className="flex items-center justify-between text-gray-700 hover:text-brand-hover"
              >
                <span>{cat.name}</span>
                <span className="text-xs text-gray-400">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Subscribe Newsletter */}
      <div className="rounded bg-gray-50 p-4 text-center">
        <h4 className="mb-3 text-sm font-bold uppercase text-brand-black">Subscribe News Letter</h4>
        <form onSubmit={handleSubscribe} className="space-y-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full rounded-[5px] border border-gray-300 bg-white px-3 py-2 text-xs focus:border-brand-primary focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-[5px] bg-brand-primary py-2 text-xs font-bold uppercase text-brand-black transition-colors hover:bg-brand-green2 hover:text-white"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Brand Logo */}
      <div className="flex justify-center border-t border-gray-100 pt-4">
        <Link to="/">
          <img
            src="/images/2019/03/calathx-logo.png"
            alt="CalathX"
            className="w-44 object-contain"
          />
        </Link>
      </div>
    </aside>
  );
}

