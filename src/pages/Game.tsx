import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { FadeOutOverlay } from "../comps/FadeOutOverlay";
import { HealthPoints } from "../comps/HealthPoints";
import { Pause } from "../comps/Pause";
import { Score } from "../comps/Score";
import { EventNames } from "../game/EventNames";
import { gameObject } from "../game/GameObject";
import type { GameState } from "../game/types/GameState";
import type { LevelConfig } from "../game/types/LevelConfig";
import type { LevelName } from "../game/types/LevelName";
import { settings } from "../global/settings";
import { StorageKeys } from "../global/storageKeys";
import logger from "../utils/logger";
import { delayMs } from "../utils/utils";
import { GameOver } from "./GameOver";

const isDev = import.meta.env.DEV;

/**
 * - Displays GameCanvas
 * - Displays HUD elements (should be event-based updated)
 */
export function Game() {
  const location = useLocation();
  const { config, gameMode } = location.state as {
    config: LevelConfig;
    gameMode: LevelName;
  };

  const [paused, setPaused] = useState<boolean>(false);
  const initStarted = useRef(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>({
    hp: config.heroHp,
    score: 0,
  });

  const setGameOver = () => {
    logger.log(`GAME OVER`);

    const personalBest = localStorage.getItem(StorageKeys.bestScore) ?? "0";
    if (parseInt(personalBest) < gameState.score) {
      logger.log(`New Best Score established`);
      localStorage.setItem(StorageKeys.bestScore, `${gameState.score}`);
    }
    setIsGameOver(true);
  };

  useEffect(() => {
    document.title = `${settings.gameNameShort} | Play`;

    // init game - paused on start
    if (initStarted.current) return;
    initStarted.current = true;

    (async () => {
      // await initialization - make sure the container mounted
      await delayMs(50);
      await gameObject.init();

      // delay the start
      await delayMs(150);
      gameObject.start();
    })();
  }, []);

  // update game state
  useEffect(() => {
    const handleUpdateScore = (e: Event) => {
      const { pts } = (e as CustomEvent).detail;
      setGameState((prev) => ({ ...prev, score: prev.score + pts }));
    };

    const handleUpdateHp = (e: Event) => {
      const { hp } = (e as CustomEvent).detail;
      setGameState((prev) => ({ ...prev, hp: hp }));
    };

    const handleGameOver = (_: Event) => setGameOver();
    const handlePause = (_: Event) => setPaused((prev) => !prev);

    const events: { [key: string]: (e: Event) => void } = {
      [EventNames.gameOver]: handleGameOver,
      [EventNames.pause]: handlePause,
      [EventNames.updateHp]: handleUpdateHp,
      [EventNames.updateScore]: handleUpdateScore,
    };

    Object.entries(events).forEach((event) => {
      const [key, value] = event;
      window.addEventListener(key, value);
    });

    return () => {
      Object.entries(events).forEach((event) => {
        const [key, value] = event;
        window.removeEventListener(key, value);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isGameOver) {
    return <GameOver score={gameState.score} gameMode={gameMode} />;
  }

  const disableCursor = isDev ? `` : `cursor-none`;

  return (
    <div
      className={`w-full min-h-screen relative overflow-hidden nightSkyBackground ${disableCursor}`}
    >
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
      {paused ? <Pause /> : null}
    </div>
  );
}
