import { Assets, type Sprite } from "pixi.js";
import type { Side } from "../types/Side";

export class GameUtils {
  /**
   * Calculates total distance traveled
   * @param speed - units per second
   * @param delta - travel time
   */
  static calcDistance(speed: number, delta: number): number {
    return (delta / 1000) * speed;
  }

  /**
   * Returns an inclusive random integer between {from} and {to}
   * @example
   * randomBetween(1, 6) -> could return 1, 2, 3, 4, 5, or 6
   */
  static randomBetween(from: number, to: number): number {
    return Math.floor(Math.random() * (to - from + 1)) + from;
  }

  /**
   * Checks if two sprites' bounding boxes overlap (AABB collision)
   * @example
   * if (spritesOverlap(knight, fruit)) { catchFruit(); }
   */
  // static spritesOverlap(sprite1: Sprite, sprite2: Sprite): boolean {
  //   const bounds1 = sprite1.getBounds();
  //   const bounds2 = sprite2.getBounds();

  //   return (
  //     bounds1.x < bounds2.x + bounds2.width &&
  //     bounds1.x + bounds1.width > bounds2.x &&
  //     bounds1.y < bounds2.y + bounds2.height &&
  //     bounds1.y + bounds1.height > bounds2.y
  //   );
  // }

  static getOverlap(sprite1: Sprite, sprite2: Sprite): false | Side {
    const bounds1 = sprite1.getBounds();
    const bounds2 = sprite2.getBounds();

    const overlaps =
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y;

    if (!overlaps) return false;

    const overlapLeft = bounds2.x + bounds2.width - bounds1.x;
    const overlapRight = bounds1.x + bounds1.width - bounds2.x;
    const overlapTop = bounds2.y + bounds2.height - bounds1.y;
    const overlapBottom = bounds1.y + bounds1.height - bounds2.y;

    const minOverlap = Math.min(
      overlapLeft,
      overlapRight,
      overlapTop,
      overlapBottom,
    );

    if (minOverlap === overlapLeft) return "left";
    else if (minOverlap === overlapRight) return "right";
    else if (minOverlap === overlapTop) return "top";
    else return "bottom";
  }

  /**
   * Loads a sprite sheet using Assets (pixi)
   * - maybe whitelist filtering ? pixi supports ?
   */
  static async loadSpriteSheet(key: string, png: string, json: string) {
    const sheetTexture = await Assets.load(png);
    Assets.add({
      alias: key,
      src: json,
      data: { texture: sheetTexture }, // using of preloaded texture
    });
    const sheet = await Assets.load(key);
    return sheet;
  }

  static clamp(min: number, max: number, value: number) {
    return Math.max(Math.min(value, max), min);
  }

  static getGlobalScale(winWidth: number, winHeight: number): number {
    const [baseWidth, baseHeight] = [1280, 720];
    const [scaleX, scaleY] = [winWidth / baseWidth, winHeight / baseHeight];
    return Math.min(scaleX, scaleY);
  }
}
