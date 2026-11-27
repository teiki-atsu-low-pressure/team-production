import { chapter1Quests } from "./chapter1.ts";
import type { QuestDefinition } from "./types.ts";

export type { QuestDefinition } from "./types.ts";

/** すべてのクエストの定義。章を追加したら、ここに足す */
export const quests: QuestDefinition[] = [...chapter1Quests];

/** ID からクエストの定義を探す。見つからなければ undefined */
export function findQuest(id: string): QuestDefinition | undefined {
  return quests.find((q) => q.id === id);
}
