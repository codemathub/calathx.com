import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

export default function LatestBlogRow() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['latest-blog-row'],
    queryFn: async () => (await api.posts.getLatest(8)).data.data,
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-[2px] flex-1 bg-gray-200" />
        <h3 className="border-2 border-gray-200 px-5 py-1.5 text-xl font-bold uppercase tracking-wide text-brand-black">
          Latest Blog
        </h3>
        <span className="h-[2px] flex-1 bg-gray-200" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-60 animate-pulse rounded bg-gray-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => {
            const catSlug = post.categories?.[0]?.slug || 'fitness-workouts';
            const img = post.featuredImage?.url || post.featuredImageUrl || '/images/2018/10/1.jpg';
            return (
              <Link
                key={post._id}
                to={`/${catSlug}/${post.slug}`}
                className="group relative block h-64 overflow-hidden rounded shadow-md"
              >
                <img
                  src={img}
                  alt={post.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:blur-[2px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <span className="mb-1 block text-[11px] font-semibold uppercase text-brand-primary">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                  <h4 className="line-clamp-2 text-sm font-bold uppercase leading-snug">
                    {post.title}
                  </h4>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

