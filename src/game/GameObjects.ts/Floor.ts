import { Sprite } from "pixi.js";
import type GameScene from "../GameScene";
import { GameSettings } from "../config/gameSettings";

const { platformWidthPer, floorHeightPer } = GameSettings;

export class Floor {
  private scene!: GameScene;
  private sprite!: Sprite;

  constructor() {}

  init(scene: GameScene) {
    this.scene = scene;

    const floor = new Sprite(this.scene.floorTexture);
    this.sprite = floor;

    // set anchor
    this.sprite.anchor.set(0.5, 0);

    scene.mainContainer.addChild(this.sprite);
    this.resize();
  }

  resize() {
    const { left, right, top, bottom } = this.scene.getBounds();

    // set pos
    this.sprite.y = bottom + (top - bottom) * floorHeightPer;
    this.sprite.x = 0;

    // set width
    const destinationWidth = (right - left) * platformWidthPer;
    this.sprite.scale.set(destinationWidth / this.sprite.width, 1);
  }
}
