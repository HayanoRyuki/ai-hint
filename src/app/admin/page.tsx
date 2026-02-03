'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, Megaphone, Palette, Briefcase, MessageCircle, Users, BookOpen, BarChart3 } from 'lucide-react';

// ビルド時の静的生成をスキップ（データベースが必要なため）
export const dynamic = 'force-dynamic';

const iconMap = {
  'Megaphone': Megaphone,
  'Palette': Palette,
  'Briefcase': Briefcase,
  'MessageCircle': MessageCircle,
  'Users': Users,
  'BookOpen': BookOpen,
  'BarChart3': BarChart3,
};

interface Domain {
  id: string;
  slug: string;
  nameJa: string;
  emoji: string;
}

interface Keyword {
  id: string;
  name: string;
  category: string;
}

interface Faq {
  id: string;
  question: string;
  answer: string;
  status: string;
  order: number;
  domain: Domain;
  keywords: { keyword: Keyword }[];
}

export default function AdminPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // 初期データ取得
  useEffect(() => {
    fetchData();
  }, [selectedDomain]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [faqRes, domainRes, keywordRes] = await Promise.all([
        fetch(`/api/admin/faq${selectedDomain ? `?domain=${selectedDomain}` : ''}`),
        fetch('/api/admin/domains'),
        fetch('/api/admin/keywords'),
      ]);

      const faqData = await faqRes.json();
      const domainData = await domainRes.json();
      const keywordData = await keywordRes.json();

      if (faqData.success) setFaqs(faqData.data);
      if (domainData.success) setDomains(domainData.data);
      if (keywordData.success) setKeywords(keywordData.data);
    } catch (error) {
      console.error('データ取得エラー:', error);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('このQ&Aを削除しますか？')) return;

    try {
      const res = await fetch(`/api/admin/faq/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setFaqs(faqs.filter(f => f.id !== id));
      }
    } catch (error) {
      console.error('削除エラー:', error);
    }
  };

  const handleStatusToggle = async (faq: Faq) => {
    const newStatus = faq.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/admin/faq/${faq.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setFaqs(faqs.map(f => f.id === faq.id ? { ...f, status: newStatus } : f));
      }
    } catch (error) {
      console.error('ステータス更新エラー:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="w-6 h-6" />
              管理画面
            </Link>
            <span className="text-sm text-gray-500">AI Solution Hint</span>
          </div>
          <nav className="flex gap-4 text-sm">
            <Link href="/" className="text-gray-600 hover:text-gray-900">トップ</Link>
            <Link href="/faq" className="text-gray-600 hover:text-gray-900">Q&A一覧</Link>
            <Link href="/chat" className="text-gray-600 hover:text-gray-900">チャット</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">総Q&A数</p>
            <p className="text-3xl font-bold text-gray-900">{faqs.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">公開中</p>
            <p className="text-3xl font-bold text-green-600">
              {faqs.filter(f => f.status === 'published').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">下書き</p>
            <p className="text-3xl font-bold text-yellow-600">
              {faqs.filter(f => f.status === 'draft').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">領域数</p>
            <p className="text-3xl font-bold text-blue-600">{domains.length}</p>
          </div>
        </div>

        {/* フィルター & 新規作成 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white"
            >
              <option value="">すべての領域</option>
              {domains.map(d => (
                <option key={d.id} value={d.slug}>{d.nameJa}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            ＋ 新規Q&A作成
          </button>
        </div>

        {/* Q&A一覧テーブル */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500">読み込み中...</div>
          ) : faqs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              Q&Aがありません
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">領域</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">質問</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">キーワード</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">状態</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="text-sm flex items-center gap-2">
                        {(() => {
                          const Icon = faq.domain?.emoji ? iconMap[faq.domain.emoji as keyof typeof iconMap] : null;
                          return Icon ? <Icon className="w-4 h-4 text-gray-600" /> : null;
                        })()}
                        {faq.domain?.nameJa}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 line-clamp-2 max-w-md">
                        {faq.question}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {faq.keywords?.slice(0, 2).map(({ keyword }) => (
                          <span
                            key={keyword.id}
                            className="text-xs bg-gray-100 px-2 py-1 rounded"
                          >
                            {keyword.category}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleStatusToggle(faq)}
                        className={`text-xs px-3 py-1 rounded-full ${
                          faq.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {faq.status === 'published' ? '公開中' : '下書き'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditingFaq(faq)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          削除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 編集モーダル */}
      {(editingFaq || isCreating) && (
        <FaqModal
          faq={editingFaq}
          domains={domains}
          keywords={keywords}
          onClose={() => {
            setEditingFaq(null);
            setIsCreating(false);
          }}
          onSave={() => {
            setEditingFaq(null);
            setIsCreating(false);
            fetchData();
          }}
        />
      )}
    </main>
  );
}

// 編集・新規作成モーダル
function FaqModal({
  faq,
  domains,
  keywords,
  onClose,
  onSave,
}: {
  faq: Faq | null;
  domains: Domain[];
  keywords: Keyword[];
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    domainId: faq?.domain?.id || '',
    question: faq?.question || '',
    answer: faq?.answer || '',
    status: faq?.status || 'draft',
    keywordIds: faq?.keywords?.map(k => k.keyword.id) || [],
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = faq ? `/api/admin/faq/${faq.id}` : '/api/admin/faq';
      const method = faq ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        onSave();
      } else {
        alert('保存に失敗しました');
      }
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました');
    }
    setIsSaving(false);
  };

  const toggleKeyword = (id: string) => {
    setFormData(prev => ({
      ...prev,
      keywordIds: prev.keywordIds.includes(id)
        ? prev.keywordIds.filter(k => k !== id)
        : [...prev.keywordIds, id],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">
            {faq ? 'Q&Aを編集' : '新規Q&A作成'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 領域 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              領域 *
            </label>
            <select
              value={formData.domainId}
              onChange={(e) => setFormData({ ...formData, domainId: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="">選択してください</option>
              {domains.map(d => (
                <option key={d.id} value={d.id}>{d.nameJa}</option>
              ))}
            </select>
          </div>

          {/* 質問 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              悩み（質問） *
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              required
              rows={3}
              placeholder="ユーザーの「あるある悩み」を記入..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg resize-none"
            />
          </div>

          {/* 回答 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              解決策（回答） *
            </label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              required
              rows={4}
              placeholder="AIでどう解決できるかを記入..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg resize-none"
            />
          </div>

          {/* キーワード */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              解決キーワード
            </label>
            <div className="flex flex-wrap gap-2">
              {keywords.map(kw => (
                <button
                  key={kw.id}
                  type="button"
                  onClick={() => toggleKeyword(kw.id)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    formData.keywordIds.includes(kw.id)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {kw.name}
                </button>
              ))}
            </div>
          </div>

          {/* ステータス */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              公開状態
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="published"
                  checked={formData.status === 'published'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                />
                <span>公開</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="draft"
                  checked={formData.status === 'draft'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                />
                <span>下書き</span>
              </label>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 transition"
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
