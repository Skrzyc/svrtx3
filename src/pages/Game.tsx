import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { EventNames } from "../game/EventNames";
import { GameCanvas } from "../game/GameCanvas";
import type { LevelConfig } from "../game/LevelConfig";
import type { GameState } from "../game/types/GameState";
import { settings } from "../global/settings";
import { StorageKeys } from "../global/storageKeys";
import logger from "../utils/logger";
import { delayMs } from "../utils/utils";

// dispatch event like this
//
// window.dispatchEvent(
//   new CustomEvent('EventNames.addScore', {
//     detail: { pts: 10 },
//   })
// );
//

/**
 * - Displays GameCanvas
 * - Displays HUD elements (should be event-based updated)
 */
export function Game() {
  const location = useLocation();
  const config = location.state as LevelConfig;

  console.log(config);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>({
    hp: config.heroHp,
    score: 0,
  });
  console.log(gameState);

  const setGameOver = async () => {
    logger.log(`GAME OVER`);
    await delayMs(1000);
    const personalBest = localStorage.getItem(StorageKeys.bestScore) ?? "0";
    if (parseInt(personalBest) < gameState.score) {
      logger.log(`New Best Score established`);
      localStorage.setItem(StorageKeys.bestScore, `${gameState.score}`);
    }
    setIsGameOver(true);
  };

  useEffect(() => {
    document.title = `${settings.gameNameShort} | Play`;
  }, []);

  // update game state
  useEffect(() => {
    const handleAddScore = (e: Event) => {
      const { pts } = (e as CustomEvent).detail;
      logger.log(`handleAddScore - add points : ${pts}`);
      setGameState((prev) => ({ ...prev, score: prev.score + pts }));
    };

    const handleMinusOneHp = () => {
      logger.log(`handleMinusOneHp - currentHp : ${gameState.hp - 1}`);
      const gameLost = gameState.hp === 1;
      setGameState((prev) => ({ ...prev, hp: prev.hp - 1 }));

      if (gameLost) setGameOver();
    };

    window.addEventListener(EventNames.minusOneHp, handleMinusOneHp);
    window.addEventListener(EventNames.addScore, handleAddScore);
    return () => {
      window.removeEventListener(EventNames.minusOneHp, handleMinusOneHp);
      window.removeEventListener(EventNames.addScore, handleAddScore);
    };
  });

  if (isGameOver) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-black justify-center items-center">
        <p className="hugeHeading"> GAME OVER </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative ">
      <div className="absolute z-50 top-0 left-0 flex justify-center items-center p-4">
        <p> hp </p>
      </div>
      <GameCanvas />
      <div className="absolute z-50 top-0 left-0 justify-center items-center p-4">
        <p> points </p>
      </div>
    </div>
  );
}
