import { Level1Config } from "../game/config/Level1Config";
import { Level2Config } from "../game/config/Level2Config";
import { Level3Config } from "../game/config/Level3Config";
import { Level4Config } from "../game/config/Level4Config";

export const settings = {
  gameName: "Knightmare Snacks",
  gameNameShort: "KS",
  showGameOverScreenAfterMs: 1000,
  displayDevModeTagInDev: true,
  gameModes: {
    easy: Level1Config,
    medium: Level2Config,
    hard: Level3Config,
    hell: Level4Config,
  },
};
