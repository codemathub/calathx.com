import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import PostCardMasonry from './PostCardMasonry';
import PostCardOverlay from './PostCardOverlay';

export default function CategorySection({ title, slug, icon, variant = 'masonry' }) {
  const { data, isLoading } = useQuery({
    queryKey: ['category-posts', slug],
    queryFn: async () => (await api.posts.getByCategory(slug, { limit: 4 })).data.data,
  });

  const posts = data || [];

  return (
    <section className="mb-10">
      {/* Section Title */}
      <div className="mb-5 flex items-center gap-3">
        <span className="h-[1px] flex-1 bg-gray-200 dark:bg-zinc-800" />
        <Link
          to={`/${slug}`}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2 text-base font-bold uppercase tracking-wider text-brand-black transition-all hover:border-brand-primary hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:border-brand-primary"
        >
          {icon && <img src={icon} alt={title} className="h-5 w-5 object-contain" />}
          <span>{title}</span>
        </Link>
        <span className="h-[1px] flex-1 bg-gray-200 dark:bg-zinc-800" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 animate-pulse rounded-xl bg-gray-200 dark:bg-zinc-800" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">No posts in {title} yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {posts.map((post) =>
            variant === 'masonry' ? (
              <PostCardMasonry key={post._id} post={post} categorySlug={slug} />
            ) : (
              <PostCardOverlay key={post._id} post={post} categorySlug={slug} />
            )
          )}
        </div>
      )}
    </section>
  );
}
