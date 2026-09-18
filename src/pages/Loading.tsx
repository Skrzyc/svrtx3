import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { HeroPreview } from "../comps/HeroPreview";
import { gameObject } from "../game/GameObject";
import type { LevelName } from "../game/types/LevelName";
import { AppRoutes } from "../global/AppRoutes";
import { UrlParams } from "../global/paramKeys";
import { settings } from "../global/settings";
import logger from "../utils/logger";
import { delayMs } from "../utils/utils";

const loadingDurationMs = 2000;

/**
 * Loading screen
 */
export function Loading() {
  const [searchParams] = useSearchParams();
  const gameMode = searchParams.get(UrlParams.gameMode);
  const navigate = useNavigate();

  const [_isDone, setIsDone] = useState<boolean>(false);

  useEffect(() => {
    document.title = `${settings.gameNameShort} | Loading...`;
  }, []);

  const isValidMode =
    !!gameMode && Object.keys(settings.gameModes).includes(gameMode);

  // on error redirect to -> error page
  useEffect(() => {
    if (!isValidMode) {
      logger.error("Loading :: gameMode not specified or invalid");
      navigate(AppRoutes.error, { replace: true });
    }
  }, [isValidMode, navigate]);

  const levelConfig = settings.gameModes[(gameMode ?? "easy") as LevelName];
  const { note } = levelConfig;

  useEffect(() => {
    if (!isValidMode) return;

    let isMounted = true;

    (async () => {
      try {
        await Promise.all([
          delayMs(loadingDurationMs),
          (async () => {
            gameObject.setup(levelConfig);
            await gameObject.preload();
          })(),
        ]);
      } catch (err) {
        logger.error(`Loading :: preload error: ${err}`);
      }

      if (!isMounted) return;
      setIsDone(true);

      // Brief transition delay before entering game
      await delayMs(500);
      if (!isMounted) return;

      navigate(AppRoutes.game, {
        state: { config: levelConfig, gameMode: gameMode as LevelName },
      });
    })();

    return () => {
      isMounted = false;
    };
  }, [isValidMode, levelConfig, gameMode, navigate]);

  return (
    <div className="w-full min-h-screen nightSkyBackground flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-xs sm:max-w-md bg-black/75 backdrop-blur-md border border-accent/40 rounded-2xl p-6 sm:p-10 shadow-[0_0_35px_rgba(0,0,0,0.8)] flex flex-col items-center gap-6 sm:gap-8 text-center">
        {/* GAME MODE */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="font-details text-xs sm:text-sm uppercase tracking-widest text-accent font-semibold">
            Difficulty
          </span>
          <h1 className="font-fancy uppercase text-3xl sm:text-5xl md:text-6xl text-white tracking-wider drop-shadow-[0_2px_10px_rgba(255,59,108,0.5)]">
            {gameMode ?? "GAME"}
          </h1>
          <span className="font-details text-xs sm:text-sm uppercase tracking-widest text-accent font-semibold">
            {note}
          </span>
          <span className="font-details text-xs sm:text-sm uppercase tracking-widest text-accent font-semibold"></span>
          <div className="py-2">
            <HeroPreview />
          </div>
        </div>

        {/* LOADING BAR */}
        <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center gap-3">
          <div className="w-full h-4 sm:h-5 bg-black/90 border-2 border-accent/60 rounded-full overflow-hidden p-0.5 shadow-[0_0_15px_rgba(255,59,108,0.3)]">
            <div className="h-full bg-linear-to-r from-accent to-accent3 rounded-full animate-[loadingBar_2s_ease-in-out_forwards]" />
          </div>
          <p className="font-details text-gray-300 text-xs sm:text-sm tracking-widest uppercase animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    </div>
  );
}
