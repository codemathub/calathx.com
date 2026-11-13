import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import api from '../../services/api';

export default function CategoryCardsRow({ title, slug, icon, description }) {
  const { data, isLoading } = useQuery({
    queryKey: ['category-cards-row', slug],
    queryFn: async () => (await api.posts.getByCategory(slug, { limit: 4 })).data.data,
  });

  const posts = data || [];

  return (
    <section className="mb-8 sm:mb-10">
      {/* Category Section Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-3 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 p-2 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
              <img src={icon} alt={title} className="h-6 w-6 object-contain invert dark:invert-0 transition-all" />
            </div>
          )}
          <div>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        </div>

        <Link
          to={`/${slug}`}
          className="group inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 shadow-sm transition-all duration-300 hover:border-brand-primary hover:bg-brand-primary hover:text-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-brand-primary dark:hover:text-black"
        >
          <span>View All in {title}</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* 4 Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-80 animate-pulse rounded-2xl bg-gray-200 dark:bg-zinc-800" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center dark:border-zinc-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">No posts in {title} yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {posts.slice(0, 4).map((post) => {
            const catSlug = slug || post.categories?.[0]?.slug || 'fitness-workouts';
            const img = post.featuredImage?.url || post.featuredImageUrl || '/images/2018/10/1.jpg';

            return (
              <Link
                key={post._id}
                to={`/${catSlug}/${post.slug}`}
                className="group relative flex h-80 flex-col justify-end overflow-hidden rounded-2xl md:rounded-3xl border border-gray-200/80 bg-zinc-950 p-5 shadow-md transition-all duration-300 ease-out hover:scale-[1.08] hover:-translate-y-3 hover:z-20 hover:border-brand-primary hover:ring-4 hover:ring-brand-primary/80 hover:shadow-[0_20px_50px_rgba(202,240,49,0.35)] dark:border-zinc-800 dark:hover:shadow-[0_20px_50px_rgba(202,240,49,0.25)]"
              >
                {/* Background Image */}
                <img
                  src={img}
                  alt={post.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300 group-hover:opacity-85" />

                {/* Featured Badge if featured */}
                {post.isFeatured && (
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-1 rounded-full bg-brand-primary/95 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-black shadow-md backdrop-blur-sm">
                    <Sparkles className="h-3 w-3" />
                    <span>Featured</span>
                  </div>
                )}

                {/* Bottom content */}
                <div className="relative z-10">
                  {/* Category Pill / Tag */}
                  <div className="mb-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-brand-primary">
                      {title}
                    </span>
                  </div>

                  {/* Headline */}
                  <h4 className="text-lg font-black leading-snug text-white transition-colors duration-300 group-hover:text-brand-primary line-clamp-2">
                    {post.title}
                  </h4>

                  {/* Date & Circular Arrow Button */}
                  <div className="mt-4 flex items-center justify-between pt-2 border-t border-white/15">
                    <span className="text-[11px] font-medium text-gray-300">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>

                    {/* Circular Arrow Button (Matches Figma Design in Image 1) */}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30 transition-all duration-300 group-hover:scale-115 group-hover:bg-brand-primary group-hover:text-black group-hover:border-transparent shadow-sm">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

