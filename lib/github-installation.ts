import "server-only";

import { getSupabase } from "./supabase";

/*ユーザーのGitHub AppのインストールIDを保存。
 * 呼び出し元でユーザー認証とインストールの所有権を確認。
 */

export async function savaInstallationId(
  userId: string,
  installationId: number,
): Promise<void> {
  if (!userId) {
    throw new Error("ユーザーIDが設定されていません");
  }
  if (!Number.isSafeInteger(installationId) || installationId <= 0) {
    throw new Error("Installation IDが正しくありません");
  }
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("users")
    .update({
      github_installation_id: installationId,
    })
    .eq("id", userId)
    .is("github_installation_id", null)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error("Installation IDの保存に失敗しました");
  }
}
/*ユーザーのGithub AppのインストールIDを取得
 *呼び出し元でユーザー認証
 */

export async function getInstallationId(
  userId: string,
): Promise<number | null> {
  if (!userId) {
    throw new Error("ユーザーIDが設定されていません");
  }
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("user")
    .select("github_installation_id")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error("Installation IDの取得に失敗しました");
  }
  return data.github_installation_id;
}
