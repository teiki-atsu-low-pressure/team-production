"use client";

import Link from "next/link";
import { useState } from "react";

type Category = "GitHub" | "ターミナル" | "Gitコマンド" | "その他";

type Term = {
  id: string;
  name: string;
  category: Category;
  description: string;
  points: string[];
  relatedIds: string[];
};

const CATEGORIES: Category[] = [
  "GitHub",
  "ターミナル",
  "Gitコマンド",
  "その他",
];

const TERMS: Term[] = [
  {
    id: "github",
    name: "GitHub",
    category: "GitHub",
    description:
      "コードの管理や共同開発ができる、世界最大級の開発プラットフォームです。リポジトリを作成して、コードを保存したり、他の人と共有したりできます。",
    points: [
      "開発者同士でコードを共有できる",
      "プルリクエストで変更を提案できる",
      "学習や開発に幅広く使われている",
    ],
    relatedIds: ["repository", "pr", "issue"],
  },
  {
    id: "repository",
    name: "リポジトリ",
    category: "GitHub",
    description:
      "ソースコードやファイルの変更履歴をまとめて保存しておく保管庫のことです。",
    points: [
      "自分のPCにある「ローカルリポジトリ」と、GitHub上の「リモートリポジトリ」がある",
      "プロジェクトごとに1つのリポジトリを作るのが基本",
    ],
    relatedIds: ["github", "commit", "fork"],
  },
  {
    id: "commit",
    name: "コミット",
    category: "GitHub",
    description:
      "ファイルの追加や変更を、ローカルリポジトリに記録する操作のことです。",
    points: [
      "セーブポイントを作るイメージで記録を残せる",
      "「何を変更したか」のメッセージを添えて記録する",
    ],
    relatedIds: ["repository", "branch"],
  },
  {
    id: "pr",
    name: "プルリクエスト (PR)",
    category: "GitHub",
    description:
      "自分が変更したコードを「メインのコードに取り込んでください」とチームメンバーに依頼・提案する機能です。",
    points: [
      "取り込む前に他のメンバーにコードを確認（レビュー）してもらえる",
      "チーム開発でのバグやミスを防ぐために使われる",
    ],
    relatedIds: ["github", "branch", "merge"],
  },
  {
    id: "issue",
    name: "イシュー",
    category: "GitHub",
    description:
      "やること（タスク）やバグ報告、機能追加の相談などを管理するための掲示板のような機能です。",
    points: [
      "誰がどの作業を担当するかを明確にできる",
      "番号（#23など）で管理され、プルリクエストと紐づけられる",
    ],
    relatedIds: ["github", "pr"],
  },
  {
    id: "branch",
    name: "ブランチ",
    category: "GitHub",
    description:
      "開発の履歴を枝分かれさせて、本番用のコードに影響を与えずに作業するための仕組みです。",
    points: [
      "機能追加や修正ごとにブランチを分けて並行作業できる",
      "作業が終わったら元のブランチへ合流（マージ）させる",
    ],
    relatedIds: ["commit", "merge", "pr"],
  },
  {
    id: "merge",
    name: "マージ",
    category: "GitHub",
    description:
      "枝分かれさせたブランチでの作業内容を、別のブランチに統合（合流）させることです。",
    points: [
      "プルリクエストが承認された後に行うのが一般的",
      "同じ箇所を複数人が編集していると競合（コンフリクト）が起きることがある",
    ],
    relatedIds: ["branch", "pr"],
  },
  {
    id: "fork",
    name: "フォーク",
    category: "GitHub",
    description:
      "他の人のGitHubリポジトリを、自分のGitHubアカウントに丸ごとコピーする機能です。",
    points: [
      "元のリポジトリを壊す心配なく自由に改造・練習できる",
      "変更した内容を元のリポジトリへプルリクエストで送ることもできる",
    ],
    relatedIds: ["github", "repository"],
  },
  {
    id: "terminal-cd",
    name: "cd（ディレクトリ移動）",
    category: "ターミナル",
    description: "作業するフォルダ（ディレクトリ）を移動するコマンドです。",
    points: ["cd フォルダ名 で中に入る", "cd .. で1つ上の階層に戻る"],
    relatedIds: ["cmd-push"],
  },
  {
    id: "cmd-push",
    name: "git push",
    category: "Gitコマンド",
    description:
      "ローカルでコミットした変更をGitHubへアップロードするコマンドです。",
    points: ["チームメンバーと変更を共有するために必須の操作"],
    relatedIds: ["commit", "github"],
  },
  {
    id: "other-readme",
    name: "README.md",
    category: "その他",
    description: "リポジトリの説明書となるマークダウンファイルです。",
    points: ["プロジェクトの概要や起動方法を書いておく"],
    relatedIds: ["repository"],
  },
];

export default function StudyPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("GitHub");
  const [selectedId, setSelectedId] = useState<string>("github");
  const [searchText, setSearchText] = useState<string>("");

  const keyword = searchText.trim().toLowerCase();

  // 検索中は全カテゴリから探し、未入力時は選択中のカテゴリで絞り込む
  const filteredTerms = TERMS.filter((term) =>
    keyword === ""
      ? term.category === selectedCategory
      : term.name.toLowerCase().includes(keyword) ||
        term.description.toLowerCase().includes(keyword),
  );

  // 右側の詳細は絞り込み結果の中から選ぶ（0件のときは undefined）
  const currentTerm =
    filteredTerms.find((term) => term.id === selectedId) ?? filteredTerms[0];

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setSearchText("");
    const firstTerm = TERMS.find((t) => t.category === category);
    if (firstTerm) {
      setSelectedId(firstTerm.id);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        // ▼ 背景画像が来たら下の background に url('/images/背景ファイル名') を足す
        background:
          "linear-gradient(135deg, #dce8fc 0%, #eef4ff 50%, #d8e5fb 100%)",
        color: "#1e3a8a",
        fontFamily:
          "'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', sans-serif",
      }}
    >
      {/* 共通レイアウトが完成したら共通ヘッダーに置き換える */}
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
          <div
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2b50b5" }}
          >
            GitBuddy
          </div>
          <div style={{ fontSize: "0.75rem", color: "#5b76b8" }}>
            GitHubでつながる、みんなの学習冒険
          </div>
        </div>

        <nav
          style={{
            display: "flex",
            gap: "2rem",
            fontSize: "0.95rem",
            fontWeight: "bold",
          }}
        >
          <Link href="/" style={{ color: "#4a65a8", textDecoration: "none" }}>
            ホーム
          </Link>
          <Link
            href="/quest/1"
            style={{ color: "#4a65a8", textDecoration: "none" }}
          >
            クエスト
          </Link>
          <Link
            href="/study"
            style={{
              color: "#2b50b5",
              textDecoration: "none",
              borderBottom: "3px solid #4e78e8",
              paddingBottom: "0.25rem",
            }}
          >
            用語集
          </Link>
          <Link
            href="/login"
            style={{ color: "#4a65a8", textDecoration: "none" }}
          >
            マイページ
          </Link>
          <Link
            href="/login"
            style={{ color: "#4a65a8", textDecoration: "none" }}
          >
            設定
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

      {/* 全体コンテナ（左サイドバー + 右メイン） */}
      <div
        style={{
          display: "flex",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "1.5rem 2rem",
          gap: "2rem",
        }}
      >
        {/* 左サイドメニュー */}
        <aside style={{ width: "160px", flexShrink: 0 }}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <div
              style={{
                padding: "0.65rem 1rem",
                borderRadius: "9999px",
                background: "linear-gradient(90deg, #5c85ee 0%, #7ba1f7 100%)",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "0.9rem",
                boxShadow: "0 4px 10px rgba(92, 133, 238, 0.3)",
              }}
            >
              📖 用語集
            </div>
            <div
              style={{
                padding: "0.65rem 1rem",
                color: "#5b76b8",
                fontWeight: "bold",
                fontSize: "0.9rem",
              }}
            >
              ★ お気に入り
            </div>
            <div
              style={{
                padding: "0.65rem 1rem",
                color: "#5b76b8",
                fontWeight: "bold",
                fontSize: "0.9rem",
              }}
            >
              🕒 履歴
            </div>
          </div>
        </aside>

        {/* メインコンテンツエリア */}
        <main style={{ flex: 1 }}>
          {/* タイトル＆検索バー行 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                  margin: 0,
                  color: "#23439c",
                }}
              >
                GitHub・ターミナル用語集
              </h1>
              <p
                style={{
                  fontSize: "0.85rem",
                  margin: "0.25rem 0 0",
                  color: "#5b76b8",
                }}
              >
                Gitやターミナルの基本用語を、わかりやすく解説！
              </p>
            </div>

            <input
              type="text"
              placeholder="🔍 用語を検索..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                padding: "0.6rem 1.2rem",
                borderRadius: "9999px",
                border: "1px solid rgba(255, 255, 255, 0.9)",
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                width: "240px",
                fontSize: "0.9rem",
                color: "#1e3a8a",
                outline: "none",
                boxShadow: "0 2px 8px rgba(30, 58, 138, 0.06)",
              }}
            />
          </div>

          {/* カテゴリタブ */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            {CATEGORIES.map((category) => {
              const isSelected =
                keyword === "" && selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleSelectCategory(category)}
                  style={{
                    padding: "0.55rem 1.4rem",
                    borderRadius: "9999px",
                    border: isSelected
                      ? "none"
                      : "1px solid rgba(255, 255, 255, 0.9)",
                    background: isSelected
                      ? "linear-gradient(90deg, #5c85ee 0%, #7ba1f7 100%)"
                      : "rgba(255, 255, 255, 0.7)",
                    color: isSelected ? "#ffffff" : "#4a65a8",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    boxShadow: isSelected
                      ? "0 4px 10px rgba(92, 133, 238, 0.3)"
                      : "0 2px 6px rgba(30, 58, 138, 0.05)",
                  }}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* 2カラムカード（左：用語リスト ／ 右：詳細カード） */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "320px 1fr",
              gap: "1.5rem",
              alignItems: "start",
            }}
          >
            {/* 左カラム：用語リストカード */}
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                padding: "1rem",
                border: "1px solid rgba(255, 255, 255, 0.9)",
                boxShadow: "0 8px 24px rgba(30, 58, 138, 0.08)",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {filteredTerms.length === 0 ? (
                <p
                  style={{
                    padding: "1rem",
                    fontSize: "0.9rem",
                    color: "#5b76b8",
                    margin: 0,
                  }}
                >
                  該当する用語がありません
                </p>
              ) : (
                filteredTerms.map((term) => {
                  const isActive = currentTerm?.id === term.id;
                  return (
                    <button
                      key={term.id}
                      type="button"
                      onClick={() => setSelectedId(term.id)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        padding: "0.8rem 1rem",
                        borderRadius: "10px",
                        border: isActive
                          ? "1px solid #93b4fc"
                          : "1px solid transparent",
                        backgroundColor: isActive
                          ? "#e6efff"
                          : "rgba(255, 255, 255, 0.85)",
                        color: "#23439c",
                        fontWeight: "bold",
                        fontSize: "0.95rem",
                        cursor: "pointer",
                        textAlign: "left",
                        boxShadow: "0 1px 3px rgba(30, 58, 138, 0.04)",
                      }}
                    >
                      <span>{term.name}</span>
                      <span style={{ color: "#7ba1f7" }}>&gt;</span>
                    </button>
                  );
                })
              )}
            </div>

            {/* 右カラム：選択中用語の詳細カード */}
            <article
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                padding: "1.75rem",
                border: "1px solid rgba(255, 255, 255, 0.95)",
                boxShadow: "0 8px 24px rgba(30, 58, 138, 0.08)",
              }}
            >
              {!currentTerm ? (
                <p
                  style={{
                    padding: "2rem 1rem",
                    fontSize: "0.95rem",
                    color: "#5b76b8",
                    margin: 0,
                  }}
                >
                  該当する用語が見つかりませんでした。別のキーワードで検索してみてください。
                </p>
              ) : (
                <>
                  {/* 用語タイトル＋カテゴリバッジ */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        margin: 0,
                        color: "#1e3a8a",
                      }}
                    >
                      {currentTerm.name}
                    </h2>
                    <span
                      style={{
                        padding: "0.25rem 0.85rem",
                        borderRadius: "9999px",
                        backgroundColor: "#e6efff",
                        color: "#4e78e8",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                      }}
                    >
                      {currentTerm.category}
                    </span>
                  </div>

                  {/* 説明文 */}
                  <p
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: "1.7",
                      color: "#334e8c",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {currentTerm.description}
                  </p>

                  {/* ポイント枠 */}
                  <div
                    style={{
                      backgroundColor: "#f4f8ff",
                      borderRadius: "12px",
                      padding: "1rem 1.25rem",
                      border: "1px solid #dce8fc",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                        color: "#2b50b5",
                        marginBottom: "0.6rem",
                      }}
                    >
                      💡 ポイント
                    </div>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: "1.2rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.4rem",
                        fontSize: "0.9rem",
                        color: "#334e8c",
                      }}
                    >
                      {currentTerm.points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  {/* 関連する用語枠 */}
                  <div
                    style={{
                      backgroundColor: "#f4f8ff",
                      borderRadius: "12px",
                      padding: "1rem 1.25rem",
                      border: "1px solid #dce8fc",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                        color: "#2b50b5",
                        marginBottom: "0.6rem",
                      }}
                    >
                      📖 関連する用語
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      {currentTerm.relatedIds.map((relId) => {
                        const target = TERMS.find((t) => t.id === relId);
                        if (!target) return null;
                        return (
                          <button
                            key={relId}
                            type="button"
                            onClick={() => {
                              setSearchText("");
                              setSelectedCategory(target.category);
                              setSelectedId(target.id);
                            }}
                            style={{
                              padding: "0.35rem 0.9rem",
                              borderRadius: "9999px",
                              border: "1px solid #c7d8fa",
                              backgroundColor: "#ffffff",
                              color: "#3b66d4",
                              fontSize: "0.85rem",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                          >
                            {target.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </article>
          </div>

          {/* 左下「＜ もどる」ボタン */}
          <div style={{ marginTop: "1.5rem" }}>
            <Link
              href="/"
              style={{
                display: "inline-block",
                padding: "0.55rem 1.4rem",
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                border: "1px solid rgba(255, 255, 255, 0.95)",
                color: "#2b50b5",
                fontWeight: "bold",
                fontSize: "0.9rem",
                textDecoration: "none",
                boxShadow: "0 4px 10px rgba(30, 58, 138, 0.08)",
              }}
            >
              ＜ もどる
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
