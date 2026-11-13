import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Tag as TagIcon } from 'lucide-react';
import api from '../services/api';
import SEOHead from '../components/Common/SEOHead';
import PostCardMasonry from '../components/Posts/PostCardMasonry';

export default function TagPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['tag-archive', slug, page],
    queryFn: async () => (await api.posts.getByTag(slug, { page, limit: 12 })).data,
  });

  const tag = data?.tag;
  const posts = data?.data || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };
  const tagName = tag?.name || slug;

  return (
    <>
      <SEOHead title={`#${tagName} - CalathX`} url={`/tag/${slug}`} />
      
      {/* Header Banner */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50/80 to-white py-10 transition-colors duration-300 dark:border-zinc-800 dark:from-zinc-950 dark:to-[#09090b]">
        <div className="mx-auto max-w-7xl px-4 text-center">
          
          <div className="mb-3 flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-brand-hover dark:hover:text-brand-primary">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span>Tags</span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-gray-800 dark:text-gray-200">#{tagName}</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/20 text-brand-hover dark:text-brand-primary">
              <TagIcon className="h-5 w-5" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
              #{tagName}
            </h1>
          </div>

          {pagination.total > 0 && (
            <span className="mt-3 inline-block rounded-full bg-brand-primary/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-hover dark:bg-brand-primary/30 dark:text-brand-primary">
              {pagination.total} {pagination.total === 1 ? 'Article' : 'Articles'}
            </span>
          )}
        </div>
      </section>

      {/* Main Aligned Grid */}
      <div className="mx-auto my-10 max-w-7xl px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 animate-pulse rounded-2xl bg-gray-200 dark:bg-zinc-800" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-16 text-center dark:border-zinc-800">
            <p className="text-base font-semibold text-gray-500 dark:text-gray-400">
              No articles found for this tag.
            </p>
            <Link
              to="/"
              className="mt-4 inline-block rounded-full bg-brand-primary px-5 py-2 text-xs font-bold uppercase text-black hover:bg-brand-green3 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {posts.map((post) => (
                <PostCardMasonry key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-12 flex justify-center gap-2 border-t border-gray-100 pt-8 dark:border-zinc-800">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setPage(p);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`h-10 w-10 rounded-xl font-bold text-xs transition-all shadow-sm ${
                      p === pagination.page
                        ? 'bg-brand-primary text-black ring-2 ring-brand-primary/40'
                        : 'border border-gray-200 bg-white text-gray-700 hover:border-brand-primary hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
