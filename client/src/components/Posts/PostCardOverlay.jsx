import { Link } from 'react-router-dom';

export default function PostCardOverlay({ post, categorySlug }) {
  const catSlug = categorySlug || post.categories?.[0]?.slug || 'fuel';
  const img = post.featuredImage?.url || post.featuredImageUrl || '/images/2018/10/2.jpg';

  return (
    <Link
      to={`/${catSlug}/${post.slug}`}
      className="group relative block aspect-[4/3] overflow-hidden rounded shadow-md"
    >
      <img
        src={img}
        alt={post.title}
        loading="lazy"
        className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:blur-[2px]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
        <span className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-brand-primary">
          {new Date(post.publishedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
        <h4 className="line-clamp-3 text-base font-bold uppercase leading-snug text-white">
          {post.title}
        </h4>
        <span className="mt-3 rounded-[5px] border border-brand-primary bg-brand-primary/90 px-3 py-1 text-xs font-bold uppercase text-brand-black transition-colors group-hover:bg-brand-hover group-hover:text-white">
          Read More
        </span>
      </div>
    </Link>
  );
}

