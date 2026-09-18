import { AnimatedSprite, Texture } from "pixi.js";
import logger from "../../utils/logger";
import { GameSettings } from "../config/gameSettings";
import { HeroAnimConfig, type AnimConfig } from "../config/HeroAnimConfig";
import type GameScene from "../GameScene";
import { GameUtils } from "./GameUtils";

type HeroMove = "left" | "right" | "idle";
type CollectedAt = false | "top" | "bottom" | "left" | "right";

const { platformWidthPer, floorHeightPer } = GameSettings;

const MOVE_TO_ANIM: Record<HeroMove, string> = {
  idle: "idle",
  left: "moveLeft",
  right: "moveRight",
};

const COLLECTED_TO_SLICE_ANIM: Record<Exclude<CollectedAt, false>, string> = {
  top: "sliceUp",
  bottom: "sliceDown", // to remove
  left: "sliceLeft",
  right: "sliceRight",
};

export class Hero {
  private scene!: GameScene;
  sprite!: AnimatedSprite;

  private animTextures: Record<string, Texture[]> = {};
  private currentAnim: string = "idle";
  private baseScale = { x: 1.3, y: 1.3 };

  // true while a priority (slice) animation is playing and shouldn't be interrupted
  private isPlayingPriorityAnim = false;
  // last movement state, so we can resume the right anim once slice finishes
  private lastHeroMove: HeroMove = "idle";

  readonly config = {
    baseFrame: "hero_idle_1.png",
    heroSpeed: 800,
    animationSpeed: 0.15,
    sliceAnimationSpeed: 0.25,
    startPos: {
      x: 0,
    },
  };

  constructor() {}

  init(scene: GameScene) {
    logger.log("Hero :: init");
    this.scene = scene;

    const { startPos, animationSpeed } = this.config;
    this.buildAllAnimTextures(scene);

    const sprite = new AnimatedSprite(this.animTextures["idle"]);
    this.sprite = sprite;
    this.currentAnim = "idle";

    sprite.animationSpeed = animationSpeed;
    sprite.play();

    // set up pos and anchor
    this.sprite.anchor.set(0.5, 1);
    const { globalScale: gS } = this.scene;
    this.sprite.scale.set(this.baseScale.x * gS, this.baseScale.y * gS);

    const { top, bottom } = this.scene.getBounds();
    this.sprite.y = bottom - (bottom - top) * floorHeightPer;
    this.sprite.x = startPos.x;

    // add to game container
    scene.mainContainer.addChild(sprite);
  }

  private buildAllAnimTextures(scene: GameScene) {
    Object.entries(HeroAnimConfig).forEach(([key, animConfig]) => {
      this.animTextures[key] = this.buildTexturesForAnim(scene, animConfig);
    });
  }

  private buildTexturesForAnim(
    scene: GameScene,
    animConfig: AnimConfig,
  ): Texture[] {
    const { basePath, startAtFrame, frameCount } = animConfig;
    const textures: Texture[] = [];

    for (let i = startAtFrame; i < startAtFrame + frameCount; i++) {
      const frameName = `${basePath}${i}.png`;
      const texture = scene.heroSheet.textures[frameName];
      if (!texture) {
        logger.log(`Hero :: missing texture frame "${frameName}"`);
        continue;
      }
      textures.push(texture);
    }
    return textures;
  }

  update(
    delta: number,
    isLeft: boolean,
    isRight: boolean,
    collectedAt: CollectedAt = false,
  ) {
    const heroMove: HeroMove =
      isLeft && !isRight ? "left" : isRight && !isLeft ? "right" : "idle";

    this.updatePosition(delta, heroMove);
    this.updateAnimation(heroMove, collectedAt);
  }

  updateAnimation(heroMove: HeroMove, collectedAt: CollectedAt = false) {
    if (collectedAt !== false) {
      this.playSliceAnim(collectedAt);
      return;
    }

    if (this.isPlayingPriorityAnim) {
      this.lastHeroMove = heroMove;
      return;
    }

    this.lastHeroMove = heroMove;
    this.playAnim(MOVE_TO_ANIM[heroMove]);
  }

  private playSliceAnim(collectedAt: Exclude<CollectedAt, false>) {
    const animKey = COLLECTED_TO_SLICE_ANIM[collectedAt];

    if (this.isPlayingPriorityAnim && this.currentAnim === animKey) return;

    const textures = this.animTextures[animKey];
    if (!textures || textures.length === 0) {
      logger.log(`Hero :: no textures found for anim "${animKey}"`);
      return;
    }

    const animConfig = HeroAnimConfig[animKey];

    this.isPlayingPriorityAnim = true;
    this.currentAnim = animKey;

    this.sprite.loop = false;
    this.sprite.animationSpeed = this.config.sliceAnimationSpeed;
    this.sprite.textures = textures;
    this.applyFlip(!!animConfig.flipX);

    // guard against stacking multiple anims
    this.sprite.onComplete = () => this.onSliceAnimComplete();

    this.sprite.gotoAndPlay(0);
  }

  private onSliceAnimComplete() {
    this.isPlayingPriorityAnim = false;
    this.sprite.loop = true;
    this.sprite.animationSpeed = this.config.animationSpeed;
    this.sprite.onComplete = undefined;

    // resume whatever movement animation is currently relevant
    this.playAnim(MOVE_TO_ANIM[this.lastHeroMove], true);
  }

  private playAnim(animKey: string, force = false) {
    if (!force && animKey === this.currentAnim) return;

    const animConfig = HeroAnimConfig[animKey];
    const textures = this.animTextures[animKey];

    if (!textures || textures.length === 0) {
      logger.log(`Hero :: no textures found for anim "${animKey}"`);
      return;
    }

    this.currentAnim = animKey;
    this.sprite.textures = textures;
    this.sprite.gotoAndPlay(0);
    this.applyFlip(!!animConfig.flipX);
  }

  private applyFlip(shouldFlip: boolean) {
    const { globalScale: gS } = this.scene;
    this.sprite.scale.x = shouldFlip
      ? -Math.abs(this.baseScale.x) * gS
      : Math.abs(this.baseScale.x) * gS;
  }

  updatePosition(delta: number, heroMove: HeroMove) {
    if (heroMove === "idle") return;

    const direction = heroMove === "left" ? -1 : 1;
    const speed = this.scene.globalScale * this.config.heroSpeed;
    const distance = GameUtils.calcDistance(speed, delta);

    const finalPosition = this.sprite.x + distance * direction;

    const { left, right } = this.scene.getBounds();
    const platformOffset = ((1 - platformWidthPer) * (right - left)) / 2;
    const [totalLeft, totalRight] = [
      left + platformOffset,
      right - this.sprite.width / 3 - platformOffset,
    ];

    this.sprite.x = GameUtils.clamp(totalLeft, totalRight, finalPosition);
  }

  resize() {
    const { left, right, top, bottom } = this.scene.getBounds();

    // set y pos
    this.sprite.y =
      bottom - this.sprite.height / 2 - (bottom - top) * floorHeightPer;

    // set x pos
    const platformOffset = ((1 - platformWidthPer) * (right - left)) / 2;
    const [totalLeft, totalRight] = [
      left + platformOffset,
      right - this.sprite.width / 3 - platformOffset,
    ];

    this.sprite.x = GameUtils.clamp(totalLeft, totalRight, this.sprite.x);
  }

  playDead() {}
}
