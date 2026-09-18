import { EventNames } from "../EventNames";
import type GameScene from "../GameScene";

export class EventHandler {
  private scene!: GameScene;

  constructor() {}

  init(scene: GameScene) {
    this.scene = scene;

    this.listen();
  }

  listen() {
    // register touch events
    window.addEventListener(EventNames.touchLeftDown, this.handleLeftDown);
    window.addEventListener(EventNames.touchLeftUp, this.handleLeftUp);
    window.addEventListener(EventNames.touchRightDown, this.handleRightDown);
    window.addEventListener(EventNames.touchRightUp, this.handleRightUp);

    // register pause
    window.addEventListener(EventNames.pauseClicked, this.togglePauseState);
  }

  togglePauseState = (_: Event) => this.scene.onGameTogglePause(true);
  handleLeftDown = (_: Event) => (this.scene.touchState.leftDown = true);
  handleLeftUp = (_: Event) => (this.scene.touchState.leftDown = false);
  handleRightDown = (_: Event) => (this.scene.touchState.rightDown = true);
  handleRightUp = (_: Event) => (this.scene.touchState.rightDown = false);

  destroy() {
    // remove touch events
    window.removeEventListener(EventNames.touchLeftDown, this.handleLeftDown);
    window.removeEventListener(EventNames.touchLeftUp, this.handleLeftUp);
    window.removeEventListener(EventNames.touchRightDown, this.handleRightDown);
    window.removeEventListener(EventNames.touchRightUp, this.handleRightUp);

    // remove pause event
    window.removeEventListener(EventNames.pauseClicked, this.togglePauseState);
  }
}
