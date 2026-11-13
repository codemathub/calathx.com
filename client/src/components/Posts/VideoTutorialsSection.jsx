import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Play, X, ArrowRight, Video, ArrowUpRight } from 'lucide-react';
import api from '../../services/api';

function getEmbedUrl(url) {
  if (!url) return 'https://www.youtube-nocookie.com/embed/cbKkB3POqaY?autoplay=1';
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
    return 'https://www.youtube-nocookie.com/embed/cbKkB3POqaY?autoplay=1';
  }
}

export default function VideoTutorialsSection() {
  const [activeVideo, setActiveVideo] = useState(null);

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['home-videos-5'],
    queryFn: async () => {
      const res = await api.posts.getVideos(5);
      return res.data.data;
    },
  });

  const bigPost = videos[0];
  const col1Posts = videos.slice(1, 3);
  const col2Posts = videos.slice(3, 5);

  return (
    <section className="relative w-full pt-1 pb-6 sm:pt-2 sm:pb-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16 xl:px-20">
        
        {/* Section Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-gray-100 pb-3 dark:border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-hover dark:bg-brand-primary/30 dark:text-brand-primary mb-2">
              <Video className="h-3.5 w-3.5" />
              <span>Watch &amp; Train</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              Video Tutorials &amp; Workouts
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Follow along with full breakdown routines, form checks, and quick workouts.
            </p>
          </div>

          <Link
            to="/video-tutorials"
            className="group inline-flex items-center gap-2 self-start rounded-full border border-gray-300 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-800 shadow-sm transition-all duration-300 hover:border-brand-primary hover:bg-brand-primary hover:text-black hover:shadow-md sm:self-auto dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-200 dark:hover:bg-brand-primary dark:hover:text-black"
          >
            <span>View More</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 1 Big + 4 Small Cards Layout (Matches Reference Image Exactly) */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="h-[520px] animate-pulse rounded-3xl bg-gray-200 dark:bg-zinc-800" />
            <div className="flex flex-col gap-5">
              <div className="h-[250px] animate-pulse rounded-3xl bg-gray-200 dark:bg-zinc-800" />
              <div className="h-[250px] animate-pulse rounded-3xl bg-gray-200 dark:bg-zinc-800" />
            </div>
            <div className="flex flex-col gap-5">
              <div className="h-[250px] animate-pulse rounded-3xl bg-gray-200 dark:bg-zinc-800" />
              <div className="h-[250px] animate-pulse rounded-3xl bg-gray-200 dark:bg-zinc-800" />
            </div>
          </div>
        ) : videos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center dark:border-zinc-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">No video tutorials found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            
            {/* ================= COLUMN 1: ONE BIG TALL CARD ================= */}
            {bigPost && (
              <div
                onClick={() => setActiveVideo(bigPost)}
                className="group relative flex min-h-[460px] lg:min-h-[520px] h-full cursor-pointer flex-col justify-end overflow-hidden rounded-3xl border border-gray-200/80 bg-zinc-950 p-6 shadow-md transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-2 hover:border-brand-primary hover:shadow-2xl hover:ring-2 hover:ring-brand-primary/60 dark:border-zinc-800"
              >
                {/* Background Image */}
                <img
                  src={bigPost.featuredImage?.url || bigPost.featuredImageUrl || '/images/2018/10/pexels-photo-841130.jpeg'}
                  alt={bigPost.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-85 transition-opacity duration-300 group-hover:opacity-100"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

                {/* Top Right Play Button (Matches Reference Screenshot) */}
                <div className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary text-black shadow-lg shadow-brand-primary/40 transition-all duration-300 group-hover:scale-115 group-hover:bg-white">
                  <Play className="ml-0.5 h-5 w-5 fill-current text-black" />
                </div>

                {/* Big Center Glowing Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary text-black shadow-xl shadow-brand-primary/50 transition-all duration-300 group-hover:scale-115 group-hover:bg-white">
                    <Play className="ml-1 h-7 w-7 fill-current text-black" />
                  </div>
                </div>

                {/* Top Video Pill */}
                <div className="absolute top-5 left-5 flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md border border-white/20">
                  <Video className="h-3.5 w-3.5 text-brand-primary" />
                  <span>FEATURED WORKOUT</span>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10">
                  <span className="mb-2 block text-xs font-black uppercase tracking-wider text-brand-primary">
                    {bigPost.categories?.[0]?.name || 'FITNESS'}
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-black leading-tight text-white transition-colors group-hover:text-brand-primary line-clamp-3">
                    {bigPost.title}
                  </h3>

                  <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-3">
                    <span className="text-xs font-medium text-gray-300">
                      Tap to play workout
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-black shadow-md transition-all duration-300 group-hover:scale-115 group-hover:bg-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= COLUMN 2: 2 STACKED CARDS ================= */}
            <div className="flex flex-col gap-5">
              {col1Posts.map((post) => (
                <div
                  key={post._id}
                  onClick={() => setActiveVideo(post)}
                  className="group relative flex h-[220px] sm:h-[248px] cursor-pointer flex-col justify-end overflow-hidden rounded-3xl border border-gray-200/80 bg-zinc-950 p-5 shadow-md transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1.5 hover:border-brand-primary hover:shadow-2xl hover:ring-2 hover:ring-brand-primary/60 dark:border-zinc-800"
                >
                  <img
                    src={post.featuredImage?.url || post.featuredImageUrl || '/images/2018/10/2.jpg'}
                    alt={post.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-85 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                  {/* Top Right Play Icon Button (Matches Reference Screenshot) */}
                  <div className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-black shadow-md transition-all duration-300 group-hover:scale-115 group-hover:bg-white">
                    <Play className="ml-0.5 h-4 w-4 fill-current text-black" />
                  </div>

                  <div className="relative z-10">
                    <span className="mb-1 block text-[10px] font-black uppercase tracking-wider text-brand-primary">
                      {post.categories?.[0]?.name || 'FITNESS'}
                    </span>
                    <h4 className="text-base sm:text-lg font-black leading-snug text-white transition-colors group-hover:text-brand-primary line-clamp-2">
                      {post.title}
                    </h4>

                    <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-2">
                      <span className="text-[11px] font-medium text-gray-300">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary text-black shadow-sm transition-transform duration-300 group-hover:scale-115 group-hover:bg-white">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= COLUMN 3: 2 STACKED CARDS ================= */}
            <div className="flex flex-col gap-5">
              {col2Posts.map((post) => (
                <div
                  key={post._id}
                  onClick={() => setActiveVideo(post)}
                  className="group relative flex h-[220px] sm:h-[248px] cursor-pointer flex-col justify-end overflow-hidden rounded-3xl border border-gray-200/80 bg-zinc-950 p-5 shadow-md transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1.5 hover:border-brand-primary hover:shadow-2xl hover:ring-2 hover:ring-brand-primary/60 dark:border-zinc-800"
                >
                  <img
                    src={post.featuredImage?.url || post.featuredImageUrl || '/images/2018/10/1.jpg'}
                    alt={post.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-85 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                  {/* Top Right Play Icon Button (Matches Reference Screenshot) */}
                  <div className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-black shadow-md transition-all duration-300 group-hover:scale-115 group-hover:bg-white">
                    <Play className="ml-0.5 h-4 w-4 fill-current text-black" />
                  </div>

                  <div className="relative z-10">
                    <span className="mb-1 block text-[10px] font-black uppercase tracking-wider text-brand-primary">
                      {post.categories?.[0]?.name || 'FITNESS'}
                    </span>
                    <h4 className="text-base sm:text-lg font-black leading-snug text-white transition-colors group-hover:text-brand-primary line-clamp-2">
                      {post.title}
                    </h4>

                    <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-2">
                      <span className="text-[11px] font-medium text-gray-300">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary text-black shadow-sm transition-transform duration-300 group-hover:scale-115 group-hover:bg-white">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* ================= Video Player Modal ================= */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md transition-all duration-300"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-zinc-950 shadow-2xl border border-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
              <div className="min-w-0 pr-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary">
                  {activeVideo.categories?.[0]?.name || 'Video Tutorial'}
                </span>
                <h3 className="truncate text-base font-bold text-white">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                aria-label="Close video"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video Player Container */}
            <div className="relative aspect-video w-full bg-black">
              {activeVideo.videoUrl?.endsWith('.mp4') ? (
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  className="h-full w-full object-contain"
                />
              ) : (
                <iframe
                  src={getEmbedUrl(activeVideo.videoUrl)}
                  title={activeVideo.title}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between bg-zinc-900 px-5 py-3">
              <span className="text-xs text-zinc-400">
                Published on {new Date(activeVideo.publishedAt).toLocaleDateString()}
              </span>
              <Link
                to={`/${activeVideo.categories?.[0]?.slug || 'video-tutorials'}/${activeVideo.slug}`}
                onClick={() => setActiveVideo(null)}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-4 py-1.5 text-xs font-bold uppercase text-black hover:bg-brand-green3 transition-colors"
              >
                <span>Read Full Article</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
