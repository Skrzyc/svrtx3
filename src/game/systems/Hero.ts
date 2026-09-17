import { Sprite } from "pixi.js";
import logger from "../../utils/logger";
import type GameScene from "../GameScene";
import { GameUtils } from "./GameUtils";

type HeroMove = "left" | "right" | "idle";

export class Hero {
  private scene!: GameScene;
  sprite!: Sprite;

  readonly config = {
    baseFrame: "hero_idle_1.png",
    heroSpeed: 800,
    startPos: {
      x: 0,
    },
  };

  constructor() {}

  init(scene: GameScene) {
    logger.log("Hero :: init");
    this.scene = scene;

    const { startPos, baseFrame } = this.config;

    // create hero
    const texture = scene.heroSheet.textures[baseFrame];
    const sprite = new Sprite({ texture: texture });
    this.sprite = sprite;

    // set up pos and anchor
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.y = this.scene.getBounds().bottom - this.sprite.height;
    this.sprite.x = startPos.x;
    // this.sprite.scale.set(1.3, 1.3);

    // add to game container
    scene.mainContainer.addChild(sprite);
  }

  update(delta: number, isLeft: boolean, isRight: boolean) {
    const heroMove: HeroMove =
      isLeft && !isRight ? "left" : isRight && !isLeft ? "right" : "idle";

    this.updatePosition(delta, heroMove);
    this.updateAnimation(heroMove);
  }

  updateAnimation(heroMove: HeroMove) {}

  updatePosition(delta: number, heroMove: HeroMove) {
    if (heroMove === "idle") return;

    const direction = heroMove === "left" ? -1 : 1;
    const distance = GameUtils.calcDistance(this.config.heroSpeed, delta);

    const finalPosition = this.sprite.x + distance * direction;
    const { left, right } = this.scene.getBounds();
    const [totalLeft, totalRight] = [left, right - this.sprite.width / 3];

    if (finalPosition >= totalRight) {
      this.sprite.x = totalRight;
    } else if (finalPosition <= totalLeft) {
      this.sprite.x = totalLeft;
    } else {
      this.sprite.x = finalPosition;
    }
  }

  // fix
  placeInBounds() {
    const { left, right } = this.scene.getBounds();
    const [totalLeft, totalRight] = [left, right - this.sprite.width / 3];
    if (this.sprite.x < totalLeft) {
      this.sprite.x = totalLeft;
    } else if (this.sprite.x > totalRight) {
      this.sprite.x = totalRight;
    }
  }

  playDead() {}

  // destroy() {}
}
