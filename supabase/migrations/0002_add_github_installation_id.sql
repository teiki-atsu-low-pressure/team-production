-- ユーザーに GitHub App のインストール ID を追加する。
-- GitHub App と連携するまでは空（null）にする。

alter table public.users
    add column github_installation_id bigint;