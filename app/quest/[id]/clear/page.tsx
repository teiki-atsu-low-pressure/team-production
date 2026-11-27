"use client";

import Link from "next/link";

export default function ClearPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        // ▼ 背景画像が共有されたら backgroundImage: "url('/images/画像名.png')" に差し替え可能
        background: "linear-gradient(135deg, #dce8fc 0%, #eef4ff 50%, #d8e5fb 100%)",
        color: "#1e3a8a",
        fontFamily: "'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 上部ヘッダー */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 2.5rem",
          backgroundColor: "rgba(255, 255, 255, 0.65)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.8)",
        }}
      >
        <div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2b50b5" }}>
            GitBuddy
          </div>
          <div style={{ fontSize: "0.75rem", color: "#5b76b8" }}>
            GitHubでつながる、みんなの学習冒険
          </div>
        </div>

        <nav style={{ display: "flex", gap: "2rem", fontSize: "0.95rem", fontWeight: "bold" }}>
          <Link href="/" style={{ color: "#4a65a8", textDecoration: "none" }}>
            ホーム
          </Link>
          <Link
            href="/quest/1"
            style={{
              color: "#2b50b5",
              textDecoration: "none",
              borderBottom: "3px solid #4e78e8",
              paddingBottom: "0.25rem",
            }}
          >
            クエスト
          </Link>
          <Link href="/study" style={{ color: "#4a65a8", textDecoration: "none" }}>
            用語集
          </Link>
          <Link href="/login" style={{ color: "#4a65a8", textDecoration: "none" }}>
            マイページ
          </Link>
        </nav>

        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            backgroundColor: "#c7d8fa",
            border: "2px solid #fff",
          }}
        />
      </header>

      {/* メインエリア */}
      <main
        style={{
          flex: 1,
          maxWidth: "900px",
          width: "100%",
          margin: "0 auto",
          padding: "3rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {/* クエストクリア！タイトル */}
        <h1
          style={{
            fontSize: "2.6rem",
            fontWeight: "bold",
            color: "#3b66d4",
            margin: "0 0 0.75rem",
            letterSpacing: "0.05em",
          }}
        >
          ✨ クエストクリア！ ✨
        </h1>

        {/* 第1章バッジ */}
        <div
          style={{
            display: "inline-block",
            padding: "0.4rem 1.6rem",
            borderRadius: "9999px",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.95)",
            color: "#23439c",
            fontWeight: "bold",
            fontSize: "1rem",
            marginBottom: "2.5rem",
            boxShadow: "0 2px 8px rgba(30, 58, 138, 0.06)",
          }}
        >
          第1章 GitHubをはじめよう
        </div>

        {/* 中央のクリアメッセージカード */}
        <section
          style={{
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.88)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            padding: "2rem 2.5rem",
            border: "1px solid rgba(255, 255, 255, 0.95)",
            boxShadow: "0 10px 30px rgba(30, 58, 138, 0.08)",
            marginBottom: "2.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.45rem",
              fontWeight: "bold",
              color: "#1e3a8a",
              margin: "0 0 0.6rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                backgroundColor: "#5c85ee",
                color: "#fff",
                fontSize: "0.9rem",
              }}
            >
              ✓
            </span>
            第1章をクリアしました！
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#4a65a8", margin: 0 }}>
            GitHubの基本操作を学び、実際に使ってみることができました！
          </p>
        </section>

        {/* 下部ボタン（ホームに戻る） */}
        <div
          style={{
            display: "flex",
            width: "100%",
            maxWidth: "340px",
            justifyContent: "center",
          }}
        >
          <Link
            href="/"
            style={{
              width: "100%",
              padding: "0.95rem 1.5rem",
              borderRadius: "9999px",
              background: "linear-gradient(90deg, #5c85ee 0%, #7ba1f7 100%)",
              color: "#ffffff",
              fontWeight: "bold",
              fontSize: "1rem",
              textDecoration: "none",
              boxShadow: "0 6px 16px rgba(92, 133, 238, 0.35)",
            }}
          >
            ＜ ホームに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}