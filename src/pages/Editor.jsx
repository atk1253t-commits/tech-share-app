import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit && !user) {
      navigate('/', { replace: true });
    }
  }, [isEdit, user, navigate]);

  useEffect(() => {
    if (!id) return;

    fetch(`${API_BASE_URL}/articles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title || '');
        setAuthor(data.author || '');
        setContent(data.content || '');
        // 元の作成日を保持（createdAt または date に対応）
        setCreatedAt(data.createdAt || data.date || '');
      });
  }, [id]);

  useEffect(() => {
    if (!isEdit && user?.name && !author) {
      setAuthor(user.name);
    }
  }, [isEdit, user, author]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const url = isEdit
      ? `${API_BASE_URL}/articles/${id}`
      : `${API_BASE_URL}/articles`;
    const method = isEdit ? 'PUT' : 'POST';
    const today = new Date().toISOString().slice(0, 10);

    // 編集時は元の作成日を維持し、新規作成時のみ今日の日付を設定
    const payload = isEdit
      ? {
          title,
          author,
          content,
          createdAt: createdAt || today,
        }
      : {
          title,
          author,
          content,
          createdAt: today,
        };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        navigate(isEdit ? `/articles/${id}` : '/');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isEdit && !user) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">
        {isEdit ? '記事の編集' : '新規記事投稿'}
      </h1>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          タイトル
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          投稿者
        </label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          本文
        </label>
        <textarea
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div>
        <p className="block text-sm font-medium text-gray-700 mb-1">
          プレビュー
        </p>
        <div className="p-4 border rounded-lg bg-gray-50 text-gray-800 min-h-[120px]">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mt-2 mb-2">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-bold mt-2 mb-2">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-bold mt-2 mb-1">{children}</h3>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 my-2 space-y-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 my-2 space-y-1">{children}</ol>
              ),
              p: ({ children }) => (
                <p className="my-2 whitespace-pre-line">{children}</p>
              ),
            }}
          >
            {content || '（ここに本文のプレビューが表示されます）'}
          </ReactMarkdown>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? '保存中...' : isEdit ? '更新する' : '投稿する'}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
