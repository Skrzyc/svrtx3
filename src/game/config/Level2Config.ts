import type { LevelConfig } from "../LevelConfig";

const Level2Config: LevelConfig = {
  baseFallSpeed: 1.3,
  note: "should be balanced",
  pointsMultiplier: 2,
  heroHp: 6,
} as const;

export { Level2Config };
