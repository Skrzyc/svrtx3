import { useEffect } from "react";
import { Button } from "../comps/Button";
import { AppRoutes } from "../global/AppRoutes";
import { UrlParams } from "../global/paramKeys";
import { settings } from "../global/settings";

export function LevelSelect() {
  useEffect(() => {
    document.title = `${settings.gameNameShort} | Level Select`;
  }, []);

  return (
    <div className="w-full min-h-screen nightSkyBackground flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-black/75 backdrop-blur-md border border-accent/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_35px_rgba(0,0,0,0.8)] flex flex-col items-center gap-5 sm:gap-6">
        {/* HEADER */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="bigHeading text-3xl sm:text-5xl tracking-wider">
            SELECT LEVEL
          </h1>
          <p className="font-details text-xs sm:text-sm text-gray-300 uppercase tracking-widest">
            Choose Difficulty
          </p>
        </div>

        {/* PLAY BUTTONS */}
        <div className="w-full flex flex-col gap-3 sm:gap-4 items-stretch">
          {Object.keys(settings.gameModes).map((modeName: string) => (
            <Button
              key={`button_play_${modeName}`}
              props={{
                name: modeName.toUpperCase(),
                navLink: `${AppRoutes.loading}?${UrlParams.gameMode}=${modeName.toLowerCase()}`,
                className: "w-full",
              }}
            />
          ))}
        </div>

        {/* BACK BUTTON */}
        <div className="w-full pt-3 border-t border-white/10">
          <Button
            props={{
              name: "BACK",
              navLink: AppRoutes.home,
              className: "w-full opacity-85 hover:opacity-100",
            }}
          />
        </div>
      </div>
    </div>
  );
}
