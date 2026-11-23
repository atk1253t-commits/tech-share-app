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

  // ステップ4: 新規作成（/create）で未ログインの場合はトップページへ戻す
  useEffect(() => {
    if (!isEdit && !user) {
      navigate('/', { replace: true });
    }
  }, [isEdit, user, navigate]);

  // 編集時: 既存の記事データを取得してフォームと作成日をセットする
  useEffect(() => {
    if (!id) return;

    fetch(`${API_BASE_URL}/articles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title || '');
        setAuthor(data.author || '');
        setContent(data.content || '');
        setCreatedAt(data.createdAt || '');
      });
  }, [id]);

  // 新規作成時: ログイン中ユーザー名を投稿者の初期値にする
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

    const payload = {
      title,
      author,
      content,
      createdAt: isEdit
        ? createdAt || new Date().toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        navigate('/');
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
        <div className="p-4 border rounded-lg bg-gray-50 text-gray-700 space-y-2 min-h-[120px]">
          <ReactMarkdown>{content || '（ここに本文のプレビューが表示されます）'}</ReactMarkdown>
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