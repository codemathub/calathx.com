import { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Play, X, Sparkles, Video, ArrowRight } from 'lucide-react';
import api from '../services/api';
import SEOHead from '../components/Common/SEOHead';
import PostCardMasonry from '../components/Posts/PostCardMasonry';

function getEmbedUrl(url) {
  if (!url) return '';
  try {
    if (url.includes('youtube.com/watch')) {
      const v = new URL(url).searchParams.get('v');
      return `https://www.youtube-nocookie.com/embed/${v}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('youtube.com/embed/')) {
      return url.includes('autoplay') ? url : `${url}?autoplay=1`;
    }
    return url;
  } catch {
    return url;
  }
}

export default function CategoryPage() {
  const params = useParams();
  const location = useLocation();
  const slug = params.slug || location.pathname.replace(/^\//, '').replace(/\/$/, '');
  const [page, setPage] = useState(1);
  const [activeVideo, setActiveVideo] = useState(null);

  const isVideosCategory = slug === 'myth-buster' || slug === 'video-tutorials';

  const { data, isLoading } = useQuery({
    queryKey: ['category-archive', slug, page],
    queryFn: async () => (await api.posts.getByCategory(slug, { page, limit: 12 })).data,
  });

  const category = data?.category;
  const posts = data?.data || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  const displayName = category?.name || slug.replace(/-/g, ' ').toUpperCase();

  return (
    <>
      <SEOHead
        title={`${displayName} - CalathX`}
        description={category?.description || `Explore ${displayName} videos and guides on CalathX.`}
        url={`/${slug}`}
      />

      {/* Header Banner */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50/80 to-white py-10 transition-colors duration-300 dark:border-zinc-800 dark:from-zinc-950 dark:to-[#09090b]">
        <div className="mx-auto max-w-7xl px-4 text-center">
          
          {/* Breadcrumb */}
          <div className="mb-3 flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-brand-hover dark:hover:text-brand-primary">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-gray-800 dark:text-gray-200">{displayName}</span>
          </div>

          {/* Title & Icon */}
          <div className="flex items-center justify-center gap-3">
            {category?.icon && (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 p-2.5 shadow-sm border border-gray-200 dark:border-zinc-800 dark:bg-zinc-900">
                <img
                  src={category.icon}
                  alt={displayName}
                  className="h-7 w-7 object-contain invert dark:invert-0 transition-all"
                />
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
              {displayName}
            </h1>
          </div>

          {category?.description && (
            <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              {category.description}
            </p>
          )}

          {pagination.total > 0 && (
            <span className="mt-3 inline-block rounded-full bg-brand-primary/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-hover dark:bg-brand-primary/30 dark:text-brand-primary">
              {pagination.total} {pagination.total === 1 ? (isVideosCategory ? 'Video' : 'Article') : (isVideosCategory ? 'Videos' : 'Articles')}
            </span>
          )}
        </div>
      </section>

      {/* Main Aligned Cards Grid */}
      <div className="mx-auto my-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="h-80 animate-pulse rounded-2xl bg-gray-200 dark:bg-zinc-800" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-16 text-center dark:border-zinc-800">
            <p className="text-base font-semibold text-gray-500 dark:text-gray-400">
              {isVideosCategory ? 'No videos found in this section yet.' : 'No articles found in this category yet.'}
            </p>
            <Link
              to="/"
              className="mt-4 inline-block rounded-full bg-brand-primary px-5 py-2 text-xs font-bold uppercase text-black hover:bg-brand-green3 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {posts.map((post) => {
                if (isVideosCategory) {
                  const img = post.featuredImage?.url || post.featuredImageUrl || '/images/2018/10/1.jpg';
                  return (
                    <div
                      key={post._id}
                      onClick={() => setActiveVideo(post)}
                      className="group relative flex h-full min-h-[340px] cursor-pointer flex-col overflow-hidden rounded-2xl md:rounded-3xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 ease-out hover:scale-[1.05] hover:-translate-y-2 hover:border-brand-primary hover:ring-4 hover:ring-brand-primary/60 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      {/* Thumbnail Container */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
                        <img
                          src={img}
                          alt={post.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-95"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Badges Overlay */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          {post.isFeatured && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-brand-primary px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-black shadow-md">
                              <Sparkles className="h-3 w-3" />
                              <span>Featured</span>
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-sm shadow-md">
                            <Video className="h-3 w-3 text-brand-primary" />
                            <span>Video</span>
                          </span>
                        </div>

                        {/* Top Right Play Button */}
                        <div className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-black shadow-md transition-all duration-300 group-hover:scale-115 group-hover:bg-white">
                          <Play className="ml-0.5 h-4 w-4 fill-current text-black" />
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-[11px] font-black uppercase tracking-wider text-brand-hover dark:text-brand-primary">
                              {displayName}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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

                        {/* Footer with Watch Video Action */}
                        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-zinc-800">
                          <span className="text-xs font-bold text-gray-800 group-hover:text-brand-hover dark:text-gray-200 dark:group-hover:text-brand-primary">
                            Watch video
                          </span>

                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary text-black transition-all duration-300 group-hover:scale-115 group-hover:bg-white shadow-xs">
                            <Play className="ml-0.5 h-3 w-3 fill-current text-black" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Standard article card for Fitness, Fuel, Health A-Z, Nutrition
                return <PostCardMasonry key={post._id} post={post} categorySlug={slug} />;
              })}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-12 flex justify-center gap-2 border-t border-gray-100 pt-8 dark:border-zinc-800">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setPage(p);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`h-10 w-10 rounded-xl font-bold text-xs transition-all shadow-sm ${
                      p === pagination.page
                        ? 'bg-brand-primary text-black ring-2 ring-brand-primary/40'
                        : 'border border-gray-200 bg-white text-gray-700 hover:border-brand-primary hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800'
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

      {/* ================= Interactive Video Player Modal ================= */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-zinc-950 shadow-2xl border border-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <span className="rounded-full bg-brand-primary/20 px-2.5 py-0.5 text-[10px] font-black uppercase text-brand-primary">
                  {displayName}
                </span>
                <h3 className="line-clamp-1 text-sm sm:text-base font-bold text-white">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black">
              {activeVideo.videoUrl?.match(/\.(mp4|webm|mov|ogg)($|\?)/i) ||
              activeVideo.videoUrl?.includes('backblazeb2.com') ? (
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  className="h-full w-full object-contain"
                />
              ) : activeVideo.videoUrl ? (
                <iframe
                  src={getEmbedUrl(activeVideo.videoUrl)}
                  title={activeVideo.title}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                  Video preview not available
                </div>
              )}
            </div>

            {/* Modal Description & Info */}
            <div className="bg-zinc-900 px-6 py-4">
              {activeVideo.excerpt && (
                <p className="text-xs sm:text-sm text-zinc-300 mb-2 leading-relaxed">
                  {activeVideo.excerpt}
                </p>
              )}
              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-800">
                <span>Published on {new Date(activeVideo.publishedAt).toLocaleDateString()}</span>
                <span className="text-brand-primary font-bold">CalathX Science-Backed</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
