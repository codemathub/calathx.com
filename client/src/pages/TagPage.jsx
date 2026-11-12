import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import SEOHead from '../components/Common/SEOHead';
import PostCardMasonry from '../components/Posts/PostCardMasonry';
import Sidebar from '../layouts/Sidebar/Sidebar';

export default function TagPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['tag-archive', slug, page],
    queryFn: async () => (await api.posts.getByTag(slug, { page, limit: 10 })).data,
  });

  const tag = data?.tag;
  const posts = data?.data || [];

  return (
    <>
      <SEOHead title={`Tag: ${tag?.name || slug} - CalathX`} url={`/tag/${slug}`} />
      <div className="bg-brand-green2 py-6 text-center text-white">
        <h1 className="text-3xl font-bold uppercase tracking-wide">Tag: {tag?.name || slug}</h1>
      </div>

      <div className="mx-auto my-10 max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-9">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-72 animate-pulse rounded bg-gray-200" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <p className="py-12 text-center text-gray-500">No articles found for this tag.</p>
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

