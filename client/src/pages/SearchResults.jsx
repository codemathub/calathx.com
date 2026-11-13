import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon, ChevronRight } from 'lucide-react';
import api from '../services/api';
import SEOHead from '../components/Common/SEOHead';
import PostCardMasonry from '../components/Posts/PostCardMasonry';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['search', q],
    enabled: Boolean(q.trim()),
    queryFn: async () => (await api.search.query(q)).data.data,
  });

  return (
    <>
      <SEOHead title={`Search: ${q} - CalathX`} url={`/search?q=${encodeURIComponent(q)}`} />

      {/* Header Banner */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50/80 to-white py-10 transition-colors duration-300 dark:border-zinc-800 dark:from-zinc-950 dark:to-[#09090b]">
        <div className="mx-auto max-w-7xl px-4 text-center">
          
          <div className="mb-3 flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-brand-hover dark:hover:text-brand-primary">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span>Search</span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-gray-800 dark:text-gray-200">“{q}”</span>
          </div>

          <div className="flex items-center justify-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/20 text-brand-hover dark:text-brand-primary">
              <SearchIcon className="h-5 w-5" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
              Search Results
            </h1>
          </div>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Showing matching articles for <span className="font-bold text-gray-900 dark:text-white">“{q}”</span>
          </p>

          {!isLoading && (
            <span className="mt-3 inline-block rounded-full bg-brand-primary/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-hover dark:bg-brand-primary/30 dark:text-brand-primary">
              {posts.length} {posts.length === 1 ? 'Result' : 'Results'} Found
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
              No articles matched your search query.
            </p>
            <Link
              to="/"
              className="mt-4 inline-block rounded-full bg-brand-primary px-5 py-2 text-xs font-bold uppercase text-black hover:bg-brand-green3 transition-colors"
            >
              Browse All Topics
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {posts.map((post) => (
              <PostCardMasonry key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
