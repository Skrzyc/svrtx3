import type { LevelConfig } from "../LevelConfig";

const Level3Config: LevelConfig = {
  baseFallSpeed: 1.6,
  note: "here its getting kind of hard",
  pointsMultiplier: 3,
  heroHp: 3,
} as const;

export { Level3Config };
