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
      {/* Section Title matching Flatsome section-title-bold-center */}
      <div className="mb-5 flex items-center gap-3">
        <span className="h-[2px] flex-1 bg-gray-200" />
        <Link
          to={`/${slug}`}
          className="flex items-center gap-2 border-2 border-gray-200 px-4 py-1.5 text-lg font-bold uppercase tracking-wide text-brand-black transition-colors hover:border-brand-primary"
        >
          {icon && <img src={icon} alt={title} className="h-6 w-6 object-contain" />}
          <span>{title}</span>
        </Link>
        <span className="h-[2px] flex-1 bg-gray-200" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 animate-pulse rounded bg-gray-200" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500">No posts in {title} yet.</p>
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

