'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Announcement {
  id: number;
  date: string;
  title: string;
}

const ANNOUNCEMENTS: Announcement[] = [
  { id: 1, date: '2026.11.24', title: '新しいクエスト「第3章 ブランチの冒険」を追加しました！' },
  { id: 2, date: '2026.11.20', title: 'メンテナンスのお知らせ（11/22 14:00〜16:00）' },
  { id: 3, date: '2026.11.15', title: '報酬に新しいバッジが追加されました！' },
];

type IconProps = { className?: string };

const Icons = {
  Home: ({ className = 'w-5 h-5' }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  ),
  BookOpen: ({ className = 'w-5 h-5' }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </svg>
  ),
  Trophy: ({ className = 'w-5 h-5' }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  Settings: ({ className = 'w-5 h-5' }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  User: ({ className = 'w-6 h-6' }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Flag: ({ className = 'w-5 h-5' }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  ),
  BarChart3: ({ className = 'w-5 h-5' }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  ),
  Gift: ({ className = 'w-5 h-5' }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  ),
  Info: ({ className = 'w-5 h-5' }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  ),
  TrendingUp: ({ className = 'w-5 h-5' }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  Megaphone: ({ className = 'w-5 h-5' }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  ),
  Star: ({ className = 'w-5 h-5' }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Pencil: ({ className = 'w-5 h-5' }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      <path d="m15 5 4 4" />
    </svg>
  ),
  ChevronRight: ({ className = 'w-4 h-4' }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  GitBranch: ({ className = 'w-9 h-9' }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="6" x2="6" y1="3" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  ),
};

export default function HomePage() {
  const [activeSideNav, setActiveSideNav] = useState<'home' | 'quests' | 'progress' | 'rewards' | 'news'>('home');

  const progress = 11;
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#eef3fc] text-[#1e3a8a] font-sans select-none flex flex-col">
      <header className="h-[76px] bg-gradient-to-r from-[#f8faff] via-[#f2f6ff] to-[#ebf1fd] border-b border-blue-200/70 px-6 flex items-center justify-between shadow-sm z-20">
        <Link href="/" className="flex items-center gap-3.5">
          <img
            src="/images/logo-teikiatsu.png"
            alt="低気圧ロゴ"
            className="w-14 h-14 rounded-2xl object-cover shadow-md"
          />
          <div>
            <h1 className="text-[26px] font-extrabold text-[#1e3a8a] leading-tight tracking-tight">
              GitBuddy
            </h1>
            <p className="text-[11px] font-semibold text-[#4763a8] tracking-wide">
              GitHubでつながる、みんなの学習冒険
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-8 h-full">
          <Link href="/" className="relative h-full px-3 flex items-center gap-2 text-[15px] font-bold text-[#3b76f6]">
            <Icons.Home className="w-5 h-5 text-[#3b76f6]" />
            <span>ホーム</span>
            <span className="absolute bottom-0 left-0 right-0 h-[3.5px] bg-[#4a85f6] rounded-t-full" />
          </Link>
          <Link href="/quest/1" className="relative h-full px-3 flex items-center gap-2 text-[15px] font-bold text-[#5b719e] hover:text-[#2b4c8c] transition-colors">
            <Icons.BookOpen className="w-5 h-5 text-[#6c82b0]" />
            <span>クエスト</span>
          </Link>
          <Link href="/study" className="relative h-full px-3 flex items-center gap-2 text-[15px] font-bold text-[#5b719e] hover:text-[#2b4c8c] transition-colors">
            <Icons.Trophy className="w-5 h-5 text-[#6c82b0]" />
            <span>マイページ</span>
          </Link>
          <Link href="/login" className="relative h-full px-3 flex items-center gap-2 text-[15px] font-bold text-[#5b719e] hover:text-[#2b4c8c] transition-colors">
            <Icons.Settings className="w-5 h-5 text-[#6c82b0]" />
            <span>設定</span>
          </Link>
        </nav>

        <Link href="/login" aria-label="ユーザープロフィール" className="w-11 h-11 rounded-full bg-[#d9e4f8] border-2 border-white shadow-sm flex items-center justify-center hover:bg-[#cad8f5] transition">
          <Icons.User className="w-6 h-6 text-white" />
        </Link>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-[216px] bg-gradient-to-b from-[#f3f7fe] to-[#e9effb] border-r border-blue-200/50 py-6 px-3.5 flex flex-col gap-2.5 shrink-0">
          {[
            { id: 'home', label: 'ホーム', Icon: Icons.Home, href: '/' },
            { id: 'quests', label: 'クエスト一覧', Icon: Icons.Flag, href: '/quest/1' },
            { id: 'progress', label: '進捗確認', Icon: Icons.BarChart3, href: '/study' },
            { id: 'rewards', label: '報酬一覧', Icon: Icons.Gift, href: '/quest/1/clear' },
            { id: 'news', label: 'お知らせ', Icon: Icons.Info, href: '/' },
          ].map((item) => {
            const IconComponent = item.Icon;
            const isActive = activeSideNav === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveSideNav(item.id as typeof activeSideNav)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-full font-extrabold text-[15px] transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#528ef8] to-[#6ea3fc] text-white shadow-[0_4px_12px_rgba(74,133,246,0.32)]'
                    : 'text-[#325194] hover:bg-white/60'
                }`}
              >
                <IconComponent className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-[#325194]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </aside>

        <main className="flex-1 overflow-y-auto p-5 bg-gradient-to-br from-[#e7effd] via-[#eef3fc] to-[#dde7fa]">
          <div className="max-w-[1160px] mx-auto space-y-5">
            <section className="relative h-[265px] rounded-3xl overflow-hidden border border-white/80 shadow-[0_6px_24px_rgba(30,58,138,0.08)] bg-gradient-to-r from-[#dfeafd] via-[#ebf2fe] to-[#d4e3fc]">
              <img
                src="/images/gitbuddy-characters.jpg"
                alt="4人の仲間キャラクターイラスト"
                className="absolute right-0 top-0 h-full w-[70%] object-cover object-top pointer-events-none select-none"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#e3ecfd] via-[#e3ecfd]/85 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-center pl-10 pr-6 max-w-md -rotate-2">
                <h2 className="text-[38px] font-black text-[#264b9e] leading-[1.22] tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.95)] mb-4">
                  さあ、
                  <br />
                  はじめようー！
                </h2>
                <p className="text-[17px] font-extrabold text-[#2b4d96] leading-relaxed pl-3 drop-shadow-[0_1px_6px_rgba(255,255,255,0.95)]">
                  GitHubで広がる、
                  <br />
                  新しい学びの世界
                </p>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <section className="lg:col-span-5 bg-white/90 backdrop-blur-md rounded-2xl border border-white shadow-[0_4px_20px_rgba(30,58,138,0.05)] p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icons.TrendingUp className="w-5 h-5 text-[#2c52a8]" />
                    <h3 className="text-[17px] font-extrabold text-[#1e3a8a]">現在の進捗</h3>
                  </div>
                  <span className="text-[13px] font-extrabold text-[#3b76f6]">全9章中 1章クリア！</span>
                </div>

                <div className="flex items-center gap-5 my-1">
                  <div className="relative w-[108px] h-[108px] shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 108 108">
                      <circle cx="54" cy="54" r={radius} stroke="#dbe5f7" strokeWidth="10" fill="transparent" />
                      <circle cx="54" cy="54" r={radius} stroke="#5b95fa" strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" fill="transparent" />
                    </svg>
                    <span className="absolute text-[26px] font-black text-[#2b52a8] tracking-tight">{progress}%</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-[#3b5998]">第2章</div>
                    <div className="text-[20px] font-black text-[#1e3a8a] leading-snug truncate">はじめてのGit</div>
                    <p className="text-[12px] font-bold text-[#4a649d] mt-1 mb-3">Gitの基本を学んで、実際に使ってみよう！</p>
                    <div className="flex justify-end">
                      <Link href="/quest/2" className="px-5 py-2 rounded-full bg-gradient-to-b from-[#669efa] to-[#427ef0] hover:from-[#5491f7] hover:to-[#336fe0] active:scale-[0.98] text-white font-extrabold text-[14px] shadow-[0_4px_12px_rgba(66,126,240,0.35)] flex items-center gap-1 transition">
                        <span>つづきから</span>
                        <Icons.ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              <section className="lg:col-span-7 bg-white/90 backdrop-blur-md rounded-2xl border border-white shadow-[0_4px_20px_rgba(30,58,138,0.05)] p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icons.Megaphone className="w-5 h-5 text-[#2c52a8]" />
                    <h3 className="text-[17px] font-extrabold text-[#1e3a8a]">お知らせ</h3>
                  </div>
                  <button type="button" className="flex items-center gap-0.5 text-[13px] font-bold text-[#3b76f6] hover:underline cursor-pointer">
                    <span>一覧を見る</span>
                    <Icons.ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <ul className="divide-y divide-blue-100/80">
                  {ANNOUNCEMENTS.map((item) => (
                    <li key={item.id}>
                      <button type="button" className="w-full py-2.5 flex items-center gap-4 text-left hover:bg-blue-50/50 rounded-lg px-1.5 transition cursor-pointer">
                        <span className="w-2 h-2 rounded-full bg-[#689ef8] shrink-0" />
                        <span className="text-[13px] font-bold text-[#6c82b0] shrink-0 tabular-nums">{item.date}</span>
                        <span className="text-[14px] font-bold text-[#254287] truncate">{item.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="lg:col-span-5 bg-white/90 backdrop-blur-md rounded-2xl border border-white shadow-[0_4px_20px_rgba(30,58,138,0.05)] p-5">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <Icons.Star className="w-5 h-5 text-[#2c52a8]" />
                    <h3 className="text-[17px] font-extrabold text-[#1e3a8a]">おすすめクエスト</h3>
                  </div>
                  <Link href="/quest/1" className="flex items-center gap-0.5 text-[13px] font-bold text-[#3b76f6] hover:underline">
                    <span>もっと見る</span>
                    <Icons.ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <Link href="/quest/2" className="w-full flex items-center justify-between gap-3.5 p-2.5 rounded-2xl bg-[#f5f8ff] hover:bg-[#ebf2ff] border border-blue-100/80 transition text-left group">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-[104px] h-[68px] rounded-xl bg-gradient-to-br from-[#618ee8] via-[#4a74cf] to-[#395eb3] flex items-center justify-center shrink-0 shadow-inner relative overflow-hidden">
                      <span className="absolute top-1.5 left-2.5 text-white/40 text-xs">✦</span>
                      <span className="absolute bottom-2 right-2.5 text-white/40 text-xs">✦</span>
                      <Icons.GitBranch className="w-9 h-9 text-white/90 -rotate-12" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[15.5px] font-black text-[#1e3a8a] truncate">第2章 はじめてのGit</div>
                      <div className="text-[12.5px] font-bold text-[#4a649d] truncate mt-0.5 mb-1.5">Gitの基本操作をマスターしよう！</div>
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#dce8fc] text-[#2e5bb8] text-[11px] font-extrabold">初心者向け</span>
                    </div>
                  </div>
                  <Icons.ChevronRight className="w-5 h-5 text-[#4a85f6] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </Link>
              </section>

              <section className="lg:col-span-7 bg-white/90 backdrop-blur-md rounded-2xl border border-white shadow-[0_4px_20px_rgba(30,58,138,0.05)] p-5 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-3">
                  <Icons.Pencil className="w-5 h-5 text-[#2c52a8]" />
                  <h3 className="text-[17px] font-extrabold text-[#1e3a8a]">今日の学習メモ</h3>
                </div>

                <div className="relative flex-1 min-h-[82px] rounded-2xl bg-gradient-to-r from-[#f8faff] via-[#f2f6ff] to-[#eef3fe] border border-blue-100/90 px-6 py-3 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_50%,rgba(255,255,255,0.9),transparent_60%)] pointer-events-none" />
                  <p className="relative z-10 text-[18px] font-extrabold text-[#3c60ad] tracking-wider leading-relaxed text-center -rotate-1">
                    一歩ずつで大丈夫。
                    <br />
                    <span className="inline-block pl-12">一緒に頑張ろう！</span>
                  </p>
                  <svg viewBox="0 0 90 65" className="w-20 h-14 absolute right-4 bottom-0 text-[#496bb5] pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 64 C16 48, 20 38, 23 32 L21 14 L35 24 C41 22, 49 22, 55 24 L69 14 L67 32 C70 38, 74 48, 74 64" fill="#ffffff" />
                    <circle cx="35" cy="40" r="2" fill="currentColor" stroke="none" />
                    <circle cx="55" cy="40" r="2" fill="currentColor" stroke="none" />
                    <path d="M40 44 Q42.5 48 45 44 Q47.5 48 50 44" />
                    <line x1="76" y1="22" x2="83" y2="16" strokeWidth="2" />
                    <line x1="79" y1="30" x2="87" y2="29" strokeWidth="2" />
                  </svg>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}