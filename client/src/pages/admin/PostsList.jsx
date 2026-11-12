import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function PostsList() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-posts-all'],
    queryFn: async () => (await api.posts.getAll({ status: 'all', limit: 50 })).data.data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.posts.delete(id),
    onSuccess: () => {
      toast.success('Post deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-posts-all'] });
    },
    onError: () => toast.error('Failed to delete post'),
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-black">All Posts</h1>
        <Link
          to="/admin/posts/new"
          className="rounded bg-brand-primary px-4 py-2 text-sm font-bold text-brand-black hover:bg-brand-hover hover:text-white"
        >
          + New Post
        </Link>
      </div>

      <div className="overflow-x-auto rounded bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : (
              (data || []).map((post) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-800">{post.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-bold ${
                        post.status === 'publish'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{post.viewCount || 0}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </td>
                  <td className="space-x-3 px-4 py-3 text-right">
                    <Link
                      to={`/admin/posts/edit/${post.slug}`}
                      className="font-semibold text-brand-hover hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Delete this post?')) deleteMutation.mutate(post._id);
                      }}
                      className="font-semibold text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

