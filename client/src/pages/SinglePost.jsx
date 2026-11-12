import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../services/api';
import SEOHead from '../components/Common/SEOHead';
import Sidebar from '../layouts/Sidebar/Sidebar';

export default function SinglePost() {
  const { category, slug } = useParams();
  const [commentForm, setCommentForm] = useState({ authorName: '', authorEmail: '', content: '' });

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => (await api.posts.getBySlug(slug)).data.data,
  });

  const { data: related = [] } = useQuery({
    queryKey: ['related-posts', post?._id],
    enabled: Boolean(post?._id),
    queryFn: async () => (await api.posts.getRelated(post._id)).data.data,
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', post?._id],
    enabled: Boolean(post?._id),
    queryFn: async () => (await api.comments.getByPost(post._id)).data.data,
  });

  useEffect(() => {
    if (post?._id) {
      api.posts.incrementView(post._id).catch(() => {});
    }
  }, [post?._id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.comments.create(post._id, commentForm);
      toast.success(res.data.message || 'Comment submitted!');
      setCommentForm({ authorName: '', authorEmail: '', content: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit comment.');
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="h-96 animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-brand-black">Article Not Found</h1>
        <Link to="/" className="mt-4 inline-block text-brand-hover underline">
          Return Home
        </Link>
      </div>
    );
  }

  const featuredImg = post.featuredImage?.url || post.featuredImageUrl;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seo?.description || post.excerpt,
    image: featuredImg,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Person', name: post.author?.displayName || 'CalathX' },
  };

  return (
    <>
      <SEOHead
        title={post.seo?.title || `${post.title} - CalathX`}
        description={post.seo?.description || post.excerpt}
        image={featuredImg}
        url={`/${category || post.categories?.[0]?.slug || 'blog'}/${post.slug}`}
        type="article"
        schema={articleSchema}
      />

      {/* Page Title Bar */}
      <div className="bg-brand-green2 py-5 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-white/90">
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            {post.categories?.[0] && (
              <>
                <Link to={`/${post.categories[0].slug}`} className="hover:underline">
                  {post.categories[0].name}
                </Link>
                <span>/</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold md:text-3xl">{post.title}</h1>
          <p className="mt-1 text-xs text-white/85">
            By {post.author?.displayName || 'CalathX'} ·{' '}
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="mx-auto my-10 max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Article Body */}
          <article className="lg:col-span-9">
            {featuredImg && (
              <img
                src={featuredImg}
                alt={post.title}
                className="mb-6 max-h-[460px] w-full rounded object-cover shadow"
              />
            )}

            <div
              className="prose prose-lg max-w-none text-justify prose-headings:font-heading prose-headings:text-brand-black prose-a:text-brand-hover prose-img:mx-auto prose-img:rounded"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-5">
                <span className="text-xs font-bold uppercase text-gray-500">Tags:</span>
                {post.tags.map((tag) => (
                  <Link
                    key={tag._id}
                    to={`/tag/${tag.slug}`}
                    className="rounded bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-brand-primary hover:text-brand-black"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Related Posts */}
            {related.length > 0 && (
              <div className="mt-10 border-t border-gray-200 pt-8">
                <h3 className="mb-4 text-xl font-bold uppercase text-brand-black">Related Articles</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {related.map((rel) => (
                    <Link
                      key={rel._id}
                      to={`/${rel.categories?.[0]?.slug || 'fitness-workouts'}/${rel.slug}`}
                      className="flex items-center gap-3 rounded border border-gray-200 p-3 hover:border-brand-primary"
                    >
                      <img
                        src={rel.featuredImage?.url || rel.featuredImageUrl || '/images/2018/10/1.jpg'}
                        alt={rel.title}
                        className="h-16 w-20 shrink-0 rounded object-cover"
                      />
                      <span className="line-clamp-2 text-sm font-bold text-gray-800 hover:text-brand-hover">
                        {rel.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="mt-10 border-t border-gray-200 pt-8">
              <h3 className="mb-4 text-xl font-bold text-brand-black">
                Comments ({comments.length})
              </h3>
              {comments.length > 0 && (
                <ul className="mb-6 space-y-4">
                  {comments.map((c) => (
                    <li key={c._id} className="rounded border border-gray-200 bg-gray-50 p-4">
                      <div className="mb-1 flex items-center justify-between">
                        <strong className="text-sm text-brand-black">{c.authorName}</strong>
                        <span className="text-xs text-gray-400">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{c.content}</p>
                    </li>
                  ))}
                </ul>
              )}

              <form onSubmit={handleCommentSubmit} className="space-y-4 rounded border border-gray-200 p-5">
                <h4 className="font-bold text-brand-black">Leave a Comment</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={commentForm.authorName}
                    onChange={(e) => setCommentForm({ ...commentForm, authorName: e.target.value })}
                    className="rounded-[5px] border border-gray-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your Email *"
                    value={commentForm.authorEmail}
                    onChange={(e) => setCommentForm({ ...commentForm, authorEmail: e.target.value })}
                    className="rounded-[5px] border border-gray-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
                  />
                </div>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your comment..."
                  value={commentForm.content}
                  onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                  className="w-full rounded-[5px] border border-gray-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-[5px] bg-brand-primary px-6 py-2 text-sm font-bold text-brand-black transition-colors hover:bg-brand-hover hover:text-white"
                >
                  Post Comment
                </button>
              </form>
            </div>
          </article>

          <div className="lg:col-span-3">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
}

