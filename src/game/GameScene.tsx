import type { LevelConfig } from "./LevelConfig";

/**
 * Game Scene class
 */
export default class GameScene {
  public config: LevelConfig;

  constructor(config: LevelConfig) {
    this.config = config;
  }

  preload() {}

  init() {}

  update() {}

  destroy() {}
}
