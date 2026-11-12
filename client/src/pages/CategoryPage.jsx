import { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import SEOHead from '../components/Common/SEOHead';
import PostCardMasonry from '../components/Posts/PostCardMasonry';
import Sidebar from '../layouts/Sidebar/Sidebar';

export default function CategoryPage() {
  const params = useParams();
  const location = useLocation();
  const slug = params.slug || location.pathname.replace(/^\//, '').replace(/\/$/, '');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['category-archive', slug, page],
    queryFn: async () => (await api.posts.getByCategory(slug, { page, limit: 10 })).data,
  });

  const category = data?.category;
  const posts = data?.data || [];
  const pagination = data?.pagination || { page: 1, pages: 1 };

  return (
    <>
      <SEOHead
        title={`${category?.name || slug} - CalathX`}
        description={category?.description || `Explore ${category?.name || slug} articles on CalathX.`}
        url={`/${slug}`}
      />

      <div className="bg-brand-green2 py-6 text-center text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4">
          {category?.icon && <img src={category.icon} alt={category.name} className="h-8 w-8 object-contain" />}
          <h1 className="text-3xl font-bold uppercase tracking-wide">{category?.name || slug}</h1>
        </div>
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
              <p className="py-12 text-center text-gray-500">No articles found in this category.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {posts.map((post) => (
                    <PostCardMasonry key={post._id} post={post} categorySlug={slug} />
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <div className="mt-10 flex justify-center gap-2">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setPage(p);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`h-9 w-9 rounded border text-sm font-bold transition-colors ${
                          p === pagination.page
                            ? 'border-brand-primary bg-brand-primary text-white'
                            : 'border-gray-300 text-gray-700 hover:border-brand-primary hover:bg-brand-primary hover:text-white'
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

          <div className="lg:col-span-3">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
}

