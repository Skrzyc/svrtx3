import { isMobile } from "pixi.js";
import type GameScene from "../GameScene";

/**
 * @todo
 * - on 'p' pause game - emit event
 * - diff logic for mobile
 */
export class InputManager {
  private keys: Record<string, boolean> = {};
  private isMobile = isMobile.any;
  private scene!: GameScene;

  state = {
    destroyed: false,
  };

  constructor() {}

  init(scene: GameScene) {
    this.scene = scene;

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keys[e.code] = true;

    if (e.code === "KeyP" && !e.repeat) {
      this.scene.onGameTogglePause();
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
  };

  isLeftDown(): boolean {
    return !!this.keys["ArrowLeft"];
  }

  isRightDown(): boolean {
    return !!this.keys["ArrowRight"];
  }

  destroy() {
    if (this.state.destroyed) return;
    this.state.destroyed = true;

    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }
}
