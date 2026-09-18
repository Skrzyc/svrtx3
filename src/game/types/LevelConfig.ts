/**
 * @param note - show text during loading (loading text)
 */
export type LevelConfig = {
  note: string;
  baseFallSpeed: number;
  heroHp: number;
  // fruit assets
  assets: string[];
  // optional
  pointsMultiplier?: number;
  backgroundAccent?: number;
};
