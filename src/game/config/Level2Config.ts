import type { LevelConfig } from "../types/LevelConfig";

const Level2Config: LevelConfig = {
  baseFallSpeed: 2.3,
  note: "should be balanced",
  pointsMultiplier: 2,
  backgroundAccent: 0x113333,
  assets: [
    "Eggs",
    "Honeycomb",
    "Pineapple",
    "Bacon",
    "Beer",
    "Steak",
    "Wine",
    "Fish",
    "Cheese",
    "Chicken",
    "Bread",
    "Eggplant",
    "PepperRed",
    "PepperGreen",
    "Grubs",
    "Grub",
  ],
  heroHp: 6,
} as const;

export { Level2Config };
