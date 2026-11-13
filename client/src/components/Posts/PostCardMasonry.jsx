import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, Video } from 'lucide-react';

export default function PostCardMasonry({ post, categorySlug }) {
  const catSlug = categorySlug || post.categories?.[0]?.slug || 'fitness-workouts';
  const img = post.featuredImage?.url || post.featuredImageUrl || '/images/2018/10/1.jpg';
  const catName = post.categories?.[0]?.name || 'Article';

  return (
    <Link
      to={`/${catSlug}/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 ease-out hover:scale-[1.08] hover:-translate-y-3 hover:z-20 hover:border-brand-primary hover:ring-4 hover:ring-brand-primary/80 hover:shadow-[0_20px_50px_rgba(202,240,49,0.35)] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:shadow-[0_20px_50px_rgba(202,240,49,0.25)]"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
        <img
          src={img}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-95"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {post.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-primary px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-black shadow-md">
              <Sparkles className="h-3 w-3" />
              <span>Featured</span>
            </span>
          )}
          {post.videoUrl && (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-sm shadow-md">
              <Video className="h-3 w-3 text-brand-primary" />
              <span>Video</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-brand-hover dark:text-brand-primary">
              {catName}
            </span>
            <span className="text-[11px] text-gray-400">
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          <h4 className="text-base font-bold leading-snug text-gray-900 transition-colors line-clamp-2 group-hover:text-brand-hover dark:text-white dark:group-hover:text-brand-primary">
            {post.title}
          </h4>

          {post.excerpt && (
            <p className="mt-2 text-xs leading-relaxed text-gray-500 line-clamp-2 dark:text-gray-400">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Footer with Circular Arrow */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-zinc-800">
          <span className="text-xs font-semibold text-gray-600 group-hover:text-brand-hover dark:text-gray-400 dark:group-hover:text-brand-primary">
            Read article
          </span>

          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-black dark:bg-zinc-800 dark:text-gray-300">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
