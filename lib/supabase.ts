import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

/**
 * Supabase に接続するためのクライアントを返す。
 *
 * Secret key を使うので Row Level Security を通り抜け、すべてのテーブルを読み書きできる。
 * サーバー側（Route Handler や Server Component）からだけ呼ぶこと。
 */
export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    throw new Error(
      "SUPABASE_URL と SUPABASE_SECRET_KEY を .env.local に設定してください（README を参照）",
    );
  }

  client = createClient(url, secretKey);
  return client;
}
