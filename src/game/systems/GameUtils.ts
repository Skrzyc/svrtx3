import type { Sprite } from "pixi.js";

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
  static spritesOverlap(sprite1: Sprite, sprite2: Sprite): boolean {
    const bounds1 = sprite1.getBounds();
    const bounds2 = sprite2.getBounds();

    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
    );
  }
}
