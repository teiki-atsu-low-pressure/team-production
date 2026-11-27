// GitHub App のインストール ID を保存・取得できるか確かめる。
// 実行方法: npm run github:installation:check

import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
const installationId = Number(process.env.GITHUB_APP_INSTALLATION_ID);

if (!url || !secretKey) {
  console.error("NG: Supabaseの接続情報が設定されていません");
  process.exit(1);
}

if (!Number.isSafeInteger(installationId) || installationId <= 0) {
  console.error("NG: INstallation IDが正しくありません");
  process.exit(1);
}
const supabase = createClient(url, secretKey);
const testUserId = `github-check-${randomUUID()}`;
let created = false;

try {
  //1テストユーザーを作成
  const { error: insertError } = await supabase
    .from("users")
    .insert({ id: testUserId });

  if (insertError) throw insertError;

  created = true;
  console.log("OK: テスト用ユーザーを作成できる");

  //2Installation IDを保存
  const { error: updateError } = await supabase
    .from("users")
    .update({ github_installation_id: installationId })
    .eq("id", testUserId)
    .is("github_installation_id", null)
    .select("id")
    .single();

  if (updateError) throw updateError;
  console.log("OK: Installation IDを保存できる");

  //3Installation IDを取得
  const { data, error: selectError } = await supabase
    .from("users")
    .select("github_installation_id")
    .eq("id", testUserId)
    .single();

  if (selectError) throw selectError;

  if (data.github_installation_id !== installationId) {
    throw new Error("Installation IDが一致しません");
  }
  console.log("OK: Installation IDを取得できる");
} catch (error) {
  console.error(`NG: ${error.message}`);
  process.exitCode = 1;
} finally {
  //4テスト用ユーザー削除
  if (created) {
    const { error: deleteError } = await supabase
      .from("users")
      .delete()
      .eq("id", testUserId);

    if (deleteError) {
      console.error("NG: テスト用ユーザーを削除できません");
      console.error(`対象ユーザーID: ${testUserId}`);
      process.exitCode = 1;
    } else {
      console.log("OK: テスト用ユーザーを削除できる");
    }
  }
}
if (!process.exitCode) {
  console.log("すべてOK。Installation IDを保存・取得しました");
}
