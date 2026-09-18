import type { LevelConfig } from "../types/LevelConfig";

const Level1Config: LevelConfig = {
  baseFallSpeed: 1.8,
  note: "so easy",
  assets: [
    "Cookie",
    "Brownie",
    "Stein",
    "Moonshine",
    "Whiskey",
    "Tart",
    "Sushi",
    "Sashimi",
    "Saki",
    "Boar",
    "Marmalade",
    "Jam",
    "Apple",
    "AppleWorm",
    "Turnip",
    "Potato",
  ],
  heroHp: 9,
} as const;

export { Level1Config };
