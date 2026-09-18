import { gameObject } from "../GameObject";
import type GameScene from "../GameScene";
// import { isMobile } from "pixi.js";

const isDev = import.meta.env.DEV;
// const isMobileAny = isMobile.any;

/**
 * - handles pause (on 'p')
 * - handle moving (on Arrows)
 * - handle mobile
 *
 * @todo
 * - on 'p' pause game - emit event
 * - diff logic for mobile
 */
export class InputManager {
  private keys: Record<string, boolean> = {};
  private scene!: GameScene;

  state = {
    destroyed: false,
  };

  constructor() {}

  init(scene: GameScene) {
    this.scene = scene;
    // if (isMobileAny) return;

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keys[e.code] = true;

    if (e.code === "KeyP" && !e.repeat) {
      this.scene.onGameTogglePause();
      return;
    }

    if (!isDev) return;

    // debug key commands (only in dev)
    if (e.code === "KeyR" && !e.repeat) {
      this.scene.destroy();
      gameObject.reset();
      window.location.href = "/loading?gameMode=easy";
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
