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
    <aside className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-gray-100">
      {/* Latest / Popular Tabs */}
      <div>
        <div className="mb-4 flex border-b border-gray-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab('latest')}
            className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'latest'
                ? 'border-b-2 border-brand-primary text-brand-black dark:text-brand-primary font-extrabold'
                : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Latest
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('popular')}
            className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'popular'
                ? 'border-b-2 border-brand-primary text-brand-black dark:text-brand-primary font-extrabold'
                : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
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
              <li key={post._id} className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0 dark:border-zinc-800/80">
                <Link to={`/${catSlug}/${post.slug}`} className="shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={img}
                    alt={post.title}
                    className="h-14 w-16 rounded-lg object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </Link>
                <div className="min-w-0">
                  <Link
                    to={`/${catSlug}/${post.slug}`}
                    className="line-clamp-2 text-xs font-semibold text-gray-800 hover:text-brand-hover dark:text-gray-200 dark:hover:text-brand-primary transition-colors"
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
        <h4 className="mb-3 border-b border-gray-200 pb-2 text-xs font-bold uppercase tracking-wider text-brand-black dark:border-zinc-800 dark:text-white">
          Categories
        </h4>
        <ul className="space-y-2 text-sm">
          {categories.map((cat) => (
            <li key={cat._id}>
              <Link
                to={`/${cat.slug}`}
                className="flex items-center justify-between text-xs font-medium text-gray-600 hover:text-brand-hover dark:text-gray-300 dark:hover:text-brand-primary py-1 transition-colors"
              >
                <span>{cat.name}</span>
                <span className="text-[10px] text-gray-400">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Subscribe Newsletter */}
      <div className="rounded-xl bg-gray-50 p-4 text-center dark:bg-zinc-800/60 dark:border dark:border-zinc-700/50">
        <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-black dark:text-white">
          Subscribe Newsletter
        </h4>
        <p className="text-[11px] text-gray-500 mb-3 dark:text-gray-400">
          Weekly workouts, nutrition &amp; wellness guides
        </p>
        <form onSubmit={handleSubscribe} className="space-y-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-brand-primary focus:outline-none dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-brand-primary py-2 text-xs font-bold uppercase text-brand-black transition-all hover:bg-brand-hover hover:text-white shadow-sm"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Brand Logo */}
      <div className="flex justify-center border-t border-gray-100 pt-4 dark:border-zinc-800">
        <Link to="/" className="rounded-xl bg-black px-4 py-2 border border-gray-800 shadow-sm">
          <img
            src="/images/calathx-logo-white.png"
            alt="CalathX"
            className="h-7 w-auto object-contain"
          />
        </Link>
      </div>
    </aside>
  );
}
