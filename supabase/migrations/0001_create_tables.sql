-- ユーザー、クエスト、クエストの進み具合の 3 テーブルを作る。
--
-- どのテーブルも Row Level Security を有効にし、ポリシーは 1 つも書かない。
-- こうすると公開用のキーでは読み書きできず、サーバー側のキーだけが通れる。
-- （Supabase にはサーバー側からだけアクセスする方針のため）

-- ユーザー。ログインした人 1 人につき 1 行
create table public.users (
  -- Clerk が発行するユーザー ID（例: user_2abc...）
  id text primary key,
  -- この行を作った日時（自動で入る）
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

-- クエストの一覧（マスタ）。クエスト 1 つにつき 1 行。ユーザーが増えても行は増えない
create table public.quests (
  -- クエストを区別する名前（例: chapter1-first-pr）。URL の /quest/[id] にも使う
  id text primary key,
  -- 何章のクエストか（第 1 章なら 1）
  chapter integer not null,
  -- 章の中での並び順（小さい順に表示する）
  sort_order integer not null,
  -- 一覧に表示するクエスト名
  title text not null
);

alter table public.quests enable row level security;

-- クエストの進み具合。「あるユーザーが、あるクエストを始めた」ごとに 1 行。
-- 行がなければ、そのクエストは未着手
create table public.user_quest_progress (
  -- 誰の記録か
  user_id text not null references public.users (id) on delete cascade,
  -- どのクエストの記録か
  quest_id text not null references public.quests (id),
  -- 進み具合（in_progress: 進行中、cleared: クリア済み）
  status text not null default 'in_progress'
    check (status in ('in_progress', 'cleared')),
  -- クエストを始めた日時（自動で入る）
  started_at timestamptz not null default now(),
  -- クリアした日時（クリアするまでは空）
  cleared_at timestamptz,
  -- 同じユーザーの同じクエストは 1 行だけ
  primary key (user_id, quest_id)
);

alter table public.user_quest_progress enable row level security;
