import { StorageKeys } from "../global/storageKeys";
import logger from "../utils/logger";
import { addThousandsSpacing } from "../utils/utils";

const isDevMode = import.meta.env.DEV;

/**
 * Displays best local score - if any exist
 * - display always in dev mode - (some placeholder value)
 */
export function BestScore() {
  const score =
    localStorage.getItem(StorageKeys.bestScore) ?? (isDevMode ? "23532" : null);

  if (!score) return <></>;

  // only 0-9 allowed (regexp test)
  const validFormat = /^\d+$/.test(score);
  if (!validFormat) {
    logger.warn(`BestScore.tsx : best score format invalid - ${score}`);
    return <></>;
  }

  const scoreFormatted = addThousandsSpacing(score);

  return (
    <div className="bg-black/70 px-3 py-2 rounded-t-lg flex justify-center align-center">
      <p className="font-fancy text-2xl sm:text-4xl text-accent3">
        {`Best Score : ${scoreFormatted}`}
      </p>
    </div>
  );
}
