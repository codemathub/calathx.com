import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

export default function LatestBlogRow() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['latest-blog-row'],
    queryFn: async () => (await api.posts.getLatest(8)).data.data,
  });

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16 xl:px-20 pt-3 pb-6 sm:pt-4 sm:pb-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-[1px] flex-1 bg-gray-200 dark:bg-zinc-800" />
        <h3 className="rounded-xl border border-gray-200 bg-white px-6 py-2 text-xl font-black uppercase tracking-wider text-gray-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-white">
          Latest Blog
        </h3>
        <span className="h-[1px] flex-1 bg-gray-200 dark:bg-zinc-800" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-60 animate-pulse rounded-2xl bg-gray-200 dark:bg-zinc-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => {
            const catSlug = post.categories?.[0]?.slug || 'fitness-workouts';
            const img = post.featuredImage?.url || post.featuredImageUrl || '/images/2018/10/1.jpg';
            return (
              <Link
                key={post._id}
                to={`/${catSlug}/${post.slug}`}
                className="group relative block h-64 overflow-hidden rounded-2xl border border-gray-100 shadow-md transition-all duration-300 ease-out hover:scale-[1.08] hover:-translate-y-3 hover:z-20 hover:border-brand-primary hover:ring-4 hover:ring-brand-primary/80 hover:shadow-[0_20px_50px_rgba(202,240,49,0.35)] dark:border-zinc-800 dark:hover:shadow-[0_20px_50px_rgba(202,240,49,0.25)]"
              >
                <img
                  src={img}
                  alt={post.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-95"
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

