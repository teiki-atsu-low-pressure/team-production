// Supabase に接続して読み書きできるかを確かめる。
// 実行方法: npm run db:check
import { createClient } from "@supabase/supabase-js";

const TABLES = ["users", "quests", "user_quest_progress"];

const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  console.error(
    "NG: SUPABASE_URL と SUPABASE_SECRET_KEY を .env.local に設定してください（README を参照）",
  );
  process.exit(1);
}

const supabase = createClient(url, secretKey);

/** 失敗した手順と原因を表示して終了する */
function fail(step, error) {
  console.error(`NG: ${step}`);
  console.error(`  ${error.message}`);
  process.exit(1);
}

// 1. 3 つのテーブルがあるか
for (const table of TABLES) {
  const { error } = await supabase.from(table).select("*").limit(1);
  if (error) fail(`${table} テーブルを読めません`, error);
  console.log(`OK: ${table} テーブルがある`);
}

// 2. 書き込み → 読み出し → 削除ができるか（テスト用の行は最後に必ず消す）
const testUserId = `db-check-${Date.now()}`;

const { error: insertError } = await supabase
  .from("users")
  .insert({ id: testUserId });
if (insertError) fail("users テーブルに書き込めません", insertError);
console.log("OK: 書き込みができる");

const { data, error: selectError } = await supabase
  .from("users")
  .select("id")
  .eq("id", testUserId)
  .maybeSingle();

const { error: deleteError } = await supabase
  .from("users")
  .delete()
  .eq("id", testUserId);

if (selectError) fail("書き込んだ行を読み出せません", selectError);
if (data?.id !== testUserId) {
  fail("書き込んだ行を読み出せません", new Error("行が見つかりません"));
}
console.log("OK: 読み出しができる");

if (deleteError) fail("テスト用の行を削除できません", deleteError);
console.log("OK: 削除ができる");

console.log("すべて OK。Supabase に接続できています");
