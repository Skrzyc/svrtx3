import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { FadeOutOverlay } from "../comps/FadeOutOverlay";
import { HealthPoints } from "../comps/HealthPoints";
import { Score } from "../comps/Score";
import { EventNames } from "../game/EventNames";
import { gameObject } from "../game/GameObject";
import type { GameState } from "../game/types/GameState";
import type { LevelConfig } from "../game/types/LevelConfig";
import { settings } from "../global/settings";
import { StorageKeys } from "../global/storageKeys";
import logger from "../utils/logger";
import { delayMs } from "../utils/utils";

/**
 * - Displays GameCanvas
 * - Displays HUD elements (should be event-based updated)
 */
export function Game() {
  const location = useLocation();
  const { levelConfig: config } = location.state as {
    levelConfig: LevelConfig;
  };

  // const [paused, setPaused] = useState<boolean>(false);
  const [initRequested, setInitRequested] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>({
    hp: config.heroHp,
    score: 0,
  });

  const setGameOver = async () => {
    logger.log(`GAME OVER`);

    const personalBest = localStorage.getItem(StorageKeys.bestScore) ?? "0";
    if (parseInt(personalBest) < gameState.score) {
      logger.log(`New Best Score established`);
      localStorage.setItem(StorageKeys.bestScore, `${gameState.score}`);
    }

    await delayMs(1000);
    setIsGameOver(true);
  };

  useEffect(() => {
    document.title = `${settings.gameNameShort} | Play`;

    // init game - paused on start

    (async () => {
      if (initRequested) return;
      setInitRequested(true);
      // await initialization - make sure the container mounted
      await delayMs(50);
      await gameObject.init();

      // delay the start
      await delayMs(150);
      gameObject.start();
    })();
  });

  // update game state
  useEffect(() => {
    const handleUpdateScore = (e: Event) => {
      const { pts } = (e as CustomEvent).detail;
      logger.log(`handleAddScore - add points : ${pts}`);
      setGameState((prev) => ({ ...prev, score: prev.score + pts }));
    };

    const handleUpdateHp = (e: Event) => {
      const { hp } = (e as CustomEvent).detail;
      logger.log(`handleMinusOneHp - currentHp : ${hp}`);
      const gameLost = gameState.hp <= 0;
      setGameState((prev) => ({ ...prev, hp: hp }));

      if (gameLost) setGameOver();
    };

    window.addEventListener(EventNames.updateHp, handleUpdateHp);
    window.addEventListener(EventNames.updateScore, handleUpdateScore);
    return () => {
      window.removeEventListener(EventNames.updateHp, handleUpdateHp);
      window.removeEventListener(EventNames.updateScore, handleUpdateScore);
    };
  });

  if (isGameOver) {
    return (
      // GAME OVER SCREEN
      <div className="w-full min-h-screen flex flex-col gap-2 bg-black justify-center items-center">
        <p className="hugeHeading"> GAME OVER </p>
        <p className="bigHeading"> {gameState.score} </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative overflow-hidden nightSkyBackground">
      {/* black disappearing overlay */}
      <FadeOutOverlay />

      {/* pixi container  */}
      <div id="pixi-container" className="z-10 w-full min-h-screen" />

      {/* hp points - hud element */}
      <HealthPoints hpCount={gameState.hp} />

      {/* score - hud element */}
      <Score score={gameState.score} />

      {/* pause button */}

      {/* pause overlay */}
    </div>
  );
}
