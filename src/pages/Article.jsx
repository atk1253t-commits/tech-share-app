import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Article() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/articles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm('この記事を削除しますか？');
    if (!confirmed) return;

    await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'DELETE',
    });
    navigate('/');
  };

  if (loading) {
    return <p className="text-gray-500">読み込み中...</p>;
  }

  if (!article) {
    return <p className="text-gray-500">記事が見つかりません。</p>;
  }

  const isAuthor = Boolean(user?.name && article.author === user.name);

  return (
    <article className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">{article.title}</h1>
        {isAuthor && (
          <div className="flex gap-2">
            <Link
              to={`/edit/${article.id}`}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              編集
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              削除
            </button>
          </div>
        )}
      </div>
      <p className="text-gray-500 text-sm mb-6">
        {article.author} {article.createdAt || article.date}
      </p>
      <div className="text-gray-700 space-y-2">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>
    </article>
  );
}