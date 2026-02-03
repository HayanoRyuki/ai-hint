'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Megaphone, Palette, Briefcase, MessageCircle, Users, BookOpen, BarChart3, Lightbulb, FileText, Target, ClipboardList, Sparkles } from 'lucide-react';

const iconMap = {
  'Megaphone': Megaphone,
  'Palette': Palette,
  'Briefcase': Briefcase,
  'MessageCircle': MessageCircle,
  'Users': Users,
  'BookOpen': BookOpen,
  'BarChart3': BarChart3,
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Faq {
  id: string;
  question: string;
  answer: string;
  domain?: {
    nameJa: string;
    emoji: string;
  };
}

interface Diagnosis {
  domain: string;
  keywords: string[];
  summary: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [matchedFaqs, setMatchedFaqs] = useState<Faq[]>([]);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 初回メッセージ
  useEffect(() => {
    sendInitialMessage();
  }, []);

  // スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendInitialMessage = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [] }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages([{ role: 'assistant', content: data.message }]);
      }
    } catch (error) {
      console.error('初期メッセージエラー:', error);
      setMessages([{
        role: 'assistant',
        content: 'こんにちは！業務のお悩みを聞かせてください。AIで解決できるかもしれません。どんなことでお困りですか？'
      }]);
    }
    setIsLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();

      if (data.success) {
        // 診断結果のJSONブロックを除去して表示
        const cleanMessage = data.message.replace(/```diagnosis[\s\S]*?```/g, '').trim();
        setMessages(prev => [...prev, { role: 'assistant', content: cleanMessage }]);

        if (data.diagnosis) {
          setDiagnosis(data.diagnosis);
        }
        if (data.matchedFaqs?.length > 0) {
          setMatchedFaqs(data.matchedFaqs);
        }
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '申し訳ありません、エラーが発生しました。もう一度お試しください。'
        }]);
      }
    } catch (error) {
      console.error('送信エラー:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '通信エラーが発生しました。ネットワーク接続を確認してください。'
      }]);
    }
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ヘッダー */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-primary-600 transition">
            それ、AIで解決できるかも。
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/faq" className="text-gray-600 hover:text-gray-900">Q&A一覧</Link>
            <Link href="/chat" className="text-primary-600 font-medium">AIに相談</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：使い方・質問例 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* 使い方 */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary-600" />
                  <span>使い方</span>
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-xs">1</span>
                    <p>お悩みを自由に入力してください</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-xs">2</span>
                    <p>AIが状況をヒアリングします</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-xs">3</span>
                    <p>最適な解決策を提案します</p>
                  </div>
                </div>
              </div>

              {/* 質問例 */}
              <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-6 border border-primary-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <span>質問例</span>
                </h3>
                <div className="space-y-2">
                  {[
                    'SNS投稿のネタが尽きてしまった',
                    '採用の面接評価がバラバラで困っている',
                    '問い合わせ対応に時間がかかりすぎる',
                    'デザイン素材の管理が大変',
                    '営業資料の品質を統一したい',
                  ].map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(example)}
                      className="block w-full text-left px-4 py-2 bg-white rounded-lg text-sm text-gray-700 hover:bg-primary-100 hover:text-primary-700 transition"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              {/* 対応領域 */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary-600" />
                  <span>対応領域</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'マーケティング', icon: 'Megaphone' },
                    { name: 'デザイン', icon: 'Palette' },
                    { name: '営業', icon: 'Briefcase' },
                    { name: 'CS', icon: 'MessageCircle' },
                    { name: '採用', icon: 'Users' },
                    { name: '教育', icon: 'BookOpen' },
                    { name: '経営企画', icon: 'BarChart3' },
                  ].map((domain, idx) => {
                    const Icon = iconMap[domain.icon as keyof typeof iconMap];
                    return (
                      <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                        {Icon && <Icon className="w-3 h-3" />}
                        {domain.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 右側：チャットボックス */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
              {/* チャットエリア */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
          {messages.length === 0 && !isLoading && (
            <div className="text-center text-gray-500 py-12">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-primary-300" />
              <p>読み込み中...</p>
            </div>
          )}

          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white rounded-br-md'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

                <div ref={messagesEndRef} />
              </div>

              {/* 診断結果 & マッチしたFAQ */}
              {(diagnosis || matchedFaqs.length > 0) && (
                <div className="px-6 pb-4 border-t bg-gray-50">
            {diagnosis && (
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-4 mb-4">
                <h3 className="font-bold text-primary-700 mb-2 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  <span>診断結果</span>
                </h3>
                <p className="text-gray-700 mb-2">{diagnosis.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {diagnosis.keywords.map((kw, idx) => (
                    <span key={idx} className="bg-white px-3 py-1 rounded-full text-sm text-primary-700">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {matchedFaqs.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                  <span>関連するQ&A</span>
                </h3>
                <div className="space-y-3">
                  {matchedFaqs.map((faq) => {
                    const Icon = faq.domain?.emoji ? iconMap[faq.domain.emoji as keyof typeof iconMap] : null;
                    return (
                      <Link
                        key={faq.id}
                        href={`/faq/${faq.id}`}
                        className="block p-3 bg-gray-50 rounded-lg hover:bg-primary-50 transition group"
                      >
                        <p className="text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                          {Icon && <Icon className="w-3.5 h-3.5" />}
                          <span>{faq.domain?.nameJa}</span>
                        </p>
                        <p className="text-gray-900 group-hover:text-primary-600 line-clamp-2">
                          {faq.question}
                        </p>
                      </Link>
                    );
                  })}
                </div>
                </div>
              )}
            </div>
          )}

              {/* 入力エリア */}
              <div className="border-t bg-gradient-to-r from-primary-50 via-blue-50 to-primary-50 px-6 py-6">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 via-blue-400 to-primary-400 rounded-xl opacity-30 blur animate-pulse"></div>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="お悩みを入力してください..."
                rows={1}
                className="relative flex-1 w-full px-5 py-4 text-base border-2 border-primary-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-300 focus:border-primary-500 resize-none shadow-lg bg-white"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="relative px-8 py-4 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-xl hover:from-primary-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition font-bold text-base shadow-lg"
            >
              送信
            </button>
          </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Shift + Enter で改行 / Enter で送信
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
