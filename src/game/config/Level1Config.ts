import type { LevelConfig } from "../LevelConfig";

const Level1Config: LevelConfig = {
  baseFallSpeed: 1,
  note: "so easy",
  heroHp: 9,
} as const;

export { Level1Config };
