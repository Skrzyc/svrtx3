import type { LevelConfig } from "../types/LevelConfig";

const Level4Config: LevelConfig = {
  baseFallSpeed: 2,
  note: "it`s hell ...",
  pointsMultiplier: 4,
  heroHp: 1,
  backgroundAccent: 0x660022,
  assets: [
    "MelonWater",
    "Waffles",
    "ChickenLeg",
    "Cherry",
    "Ribs",
    "Sardines",
    "DragonFruit",
    "Sausages",
    // "Avocado",
    "FishSteak",
    "Bug",
    "Olive",
    "PickledEggs",
    "Roll",
    "Onion",
    "Shrimp",
  ],
} as const;

export { Level4Config };
