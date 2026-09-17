import { Sprite } from "pixi.js";
import logger from "../../utils/logger";
import type GameScene from "../GameScene";
import { GameUtils } from "./GameUtils";

/**
 * Fruit Factory
 * - spawn & update existing fruits
 */
export class FruitFactory {
  readonly spawnEveryNMs = 1500;
  readonly spawnXOffset = 100;
  readonly rotSpeed = 45; // degrees per second

  readonly speedMultiplier = 75;
  fallSpeed!: number;

  private scene!: GameScene;

  readonly startDelayMs = 500;

  private _pool: Sprite[] = [];

  private state = {
    started: false,
    lastSpawned: 0,
    poolCount: 0,
  };

  constructor() {}

  init(scene: GameScene) {
    this.scene = scene;

    this.scene.scheduleMethod(
      () => this.start(),
      this.startDelayMs,
      "FruitFactory-delayed-start",
    );

    this.fallSpeed = this.scene.config.baseFallSpeed;

    this.createPool();
  }

  private start() {
    this.state.started = true;
    this.state.lastSpawned = this.scene.time;
  }

  private createPool() {
    const { assets } = this.scene.config;

    assets.forEach((assetName) => {
      const sprite = this.createSprite(assetName);
      this._pool.push(sprite);
    });
    this.state.poolCount = assets.length;
  }

  private createSprite(assetName: string) {
    const texture = this.scene.foodSheet.textures[`${assetName}.png`];
    const sprite = new Sprite({
      texture: texture,
      label: `fruit`,
    });
    sprite.visible = false;
    sprite.anchor.set(0.5, 0.5);
    sprite.scale.set(2, 2);
    return sprite;
  }

  private getFromPool(): Sprite {
    const sprite = this._pool.shift();
    if (sprite) return sprite;

    // on pool exhausted
    const { assets } = this.scene.config;
    const newSpriteIdx = this.state.poolCount;
    const newSprite = this.createSprite(assets[newSpriteIdx]);
    this.state.poolCount += 1;

    logger.log(
      `FruitFactory :: pool exhausted - created new object - current total pool count: ${this.state.poolCount}`,
    );

    return newSprite;
  }

  private putBackToPool(sprite: Sprite) {
    this._pool.push(sprite);
  }

  private spawnFruit() {
    // random x pos
    const { top, left, right } = this.scene.getBounds();
    const { spawnXOffset: offset } = this;
    const x = GameUtils.randomBetween(left + offset, right - offset);

    const sprite = this.getFromPool();
    sprite.position.set(x, top - 10);
    sprite.visible = true;

    // add to game container
    this.scene.mainContainer.addChild(sprite);
  }

  onFruitDead(sprite: Sprite) {
    sprite.visible = false;

    this.scene.mainContainer.removeChild(sprite);

    this.putBackToPool(sprite);
  }

  update(delta: number) {
    if (!this.state.started) return;

    this.updateExistingFruits(delta);
    this.updateSpawnLogic();
  }

  private updateExistingFruits(delta: number) {
    const { bottom } = this.scene.getBounds();
    const { speedMultiplier: speedMul, fallSpeed } = this;

    const dist = GameUtils.calcDistance(fallSpeed * speedMul, delta);
    const angleDiff = (delta / 1000) * this.rotSpeed;
    const yThreshold = bottom - this.scene.floorOffset;

    this.scene.mainContainer.getChildrenByLabel("fruit").forEach((con) => {
      const fruit = con as Sprite;
      if (fruit.y >= yThreshold) {
        this.onFruitDead(fruit);
        this.scene.onHpLoss();
        return;
      }

      fruit.y += dist;
      fruit.angle += angleDiff;
    });
  }

  private updateSpawnLogic() {
    const { time } = this.scene;

    if (time < this.state.lastSpawned + this.spawnEveryNMs) return;
    this.state.lastSpawned = time;
    this.spawnFruit();
  }
}
