import type { LevelConfig } from "../types/LevelConfig";

const Level3Config: LevelConfig = {
  baseFallSpeed: 1.6,
  note: "here its getting kind of hard",
  pointsMultiplier: 3,
  heroHp: 3,
  assets: [
    "Tomato",
    "Strawberry",
    "Peach",
    "Lemon",
    "PiePumpkin",
    "PieLemon",
    "PieApple",
    "Pickle",
    "Pretzel",
    "Pepperoni",
    "FishFillet",
    "Honey",
    "Jerky",
    "PotatoRed",
    "MelonHoneydew",
    "MelonCantaloupe",
  ],
  backgroundAccent: 0x331133,
} as const;

export { Level3Config };
