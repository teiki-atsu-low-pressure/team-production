import type { Condition } from "../quest-check/conditions.ts";

/** クエスト 1 つ分の定義。表示用の情報（タイトルなど）は DB の quests テーブルに持つ */
export type QuestDefinition = {
  /** DB の quests.id と同じ（例: chapter1-first-pr） */
  id: string;
  /** すべて満たすとクリアになる */
  conditions: Condition[];
};
