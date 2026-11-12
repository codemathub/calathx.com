import { Link } from 'react-router-dom';

export default function PostCardMasonry({ post, categorySlug }) {
  const catSlug = categorySlug || post.categories?.[0]?.slug || 'fitness-workouts';
  const img = post.featuredImage?.url || post.featuredImageUrl || '/images/2018/10/1.jpg';

  return (
    <Link
      to={`/${catSlug}/${post.slug}`}
      className="group relative block overflow-hidden rounded shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={img}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex min-h-[93px] flex-col justify-center bg-[rgba(23,14,14,0.85)] p-4 text-white">
        <span className="mb-1.5 inline-block w-fit rounded bg-brand-primary px-2 py-0.5 text-[10px] font-bold uppercase text-brand-black">
          {post.categories?.[0]?.name || 'Article'}
        </span>
        <h4 className="line-clamp-2 text-base font-bold leading-snug text-white group-hover:text-brand-primary">
          {post.title}
        </h4>
        {post.excerpt && (
          <p className="mt-1.5 line-clamp-2 text-xs text-gray-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}

