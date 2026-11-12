import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import SEOHead from '../components/Common/SEOHead';
import PostCardMasonry from '../components/Posts/PostCardMasonry';
import Sidebar from '../layouts/Sidebar/Sidebar';

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
      <div className="bg-brand-green2 py-6 text-center text-white">
        <h1 className="text-2xl font-bold uppercase">Search Results for: “{q}”</h1>
      </div>

      <div className="mx-auto my-10 max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-9">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {[1, 2].map((n) => (
                  <div key={n} className="h-72 animate-pulse rounded bg-gray-200" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <p className="py-12 text-center text-gray-500">No articles matched your search.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {posts.map((post) => (
                  <PostCardMasonry key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>
          <div className="lg:col-span-3">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
}

