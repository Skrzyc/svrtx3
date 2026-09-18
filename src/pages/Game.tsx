import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { FadeOutOverlay } from "../comps/FadeOutOverlay";
import { HealthPoints } from "../comps/HealthPoints";
import { Pause } from "../comps/Pause";
import { PauseButton } from "../comps/PauseButton";
import { Score } from "../comps/Score";
import { TouchScreen } from "../comps/TouchScreen";
import { EventNames } from "../game/EventNames";
import { gameObject } from "../game/GameObject";
import type { GameState } from "../game/types/GameState";
import type { LevelConfig } from "../game/types/LevelConfig";
import type { LevelName } from "../game/types/LevelName";
import { settings } from "../global/settings";
import { StorageKeys } from "../global/storageKeys";
import { useIsTouchDevice } from "../hooks/useIsTouchDevice";
import logger from "../utils/logger";
import { delayMs } from "../utils/utils";
import { GameOver } from "./GameOver";

const isDev = import.meta.env.DEV;

/**
 * - Displays GameCanvas
 * - Displays HUD elements (should be event-based updated)
 */
export function Game() {
  const isTouchDevice = useIsTouchDevice();
  const location = useLocation();
  const state = (location.state ?? {}) as {
    config?: LevelConfig;
    gameMode?: LevelName;
  };
  const gameMode = state.gameMode ?? "easy";
  const config = state.config ?? settings.gameModes[gameMode];

  const [paused, setPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>({
    hp: config.heroHp,
    score: 0,
  });

  const togglePause = () => setPaused((prev) => !prev);

  const setGameOver = () => {
    logger.log(`GAME OVER`);

    // no change in gameState -> only for reading actual state
    setGameState((prev) => {
      const personalBest = localStorage.getItem(StorageKeys.bestScore) ?? "0";
      if (parseInt(personalBest) < prev.score) {
        logger.log(`New Best Score established`);
        localStorage.setItem(StorageKeys.bestScore, `${prev.score}`);
      }
      return prev;
    });

    setIsGameOver(true);
  };

  useEffect(() => {
    document.title = `${settings.gameNameShort} | Play`;

    let isMounted = true;

    (async () => {
      // await initialization - make sure the container mounted
      await delayMs(50);
      if (!isMounted) return;
      await gameObject.init();

      // delay the start
      await delayMs(150);
      if (!isMounted) return;
      gameObject.start();
    })();

    return () => {
      isMounted = false;
      gameObject.destroy();
    };
  }, []);

  // update game state
  useEffect(() => {
    const handleUpdateScore = (e: Event) => {
      const { pts } = (e as CustomEvent).detail;
      setGameState((prev) => ({ ...prev, score: pts }));
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
  }, []);

  if (isGameOver)
    return <GameOver score={gameState.score} gameMode={gameMode} />;

  return (
    <div
      className={`w-full min-h-screen relative overflow-hidden nightSkyBackground ${isDev ? `` : `cursor-none`}`}
    >
      {/* black disappearing overlay z-95*/}
      <FadeOutOverlay />

      {/* pixi container  z-10*/}
      <div id="pixi-container" className="z-10 w-full min-h-screen" />

      {/* hp points - hud element z-50 */}
      <HealthPoints hpCount={gameState.hp} />

      {/* score - hud element z-50 */}
      <Score score={gameState.score} />

      {/* pause button z-90 */}
      {isTouchDevice ? (
        <PauseButton togglePause={togglePause} isPaused={paused} />
      ) : null}

      {/* pause overlay z-80 */}
      {paused ? <Pause gameMode={gameMode} /> : null}

      {/* how to play ? */}

      {/* touch screen - (from mobile) z-70 */}
      {isTouchDevice ? <TouchScreen /> : null}
    </div>
  );
}
