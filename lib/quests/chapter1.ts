import type { QuestDefinition } from "./types.ts";

/**
 * 第 1 章のクエストと達成条件。
 *
 * ※ 仮の定義。クエストの ID・数・順番は、第 1 章のシナリオ（#16）が決まったら合わせる。
 * ID は DB の quests.id と URL の /quest/[id] にも使う。
 */
export const chapter1Quests: QuestDefinition[] = [
  {
    id: "chapter1-first-push",
    conditions: [{ type: "commits_pushed", minCount: 1 }],
  },
  {
    id: "chapter1-create-branch",
    conditions: [{ type: "branch_created" }],
  },
  {
    id: "chapter1-first-pr",
    conditions: [{ type: "branch_created" }, { type: "pull_request_created" }],
  },
];
