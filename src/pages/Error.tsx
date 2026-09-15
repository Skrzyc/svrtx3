import { useEffect } from "react";
import { Button } from "../comps/Button";
import { AppRoutes } from "../global/AppRoutes";
import { settings } from "../global/settings";

export function Error() {
  useEffect(() => {
    document.title = `${settings.gameNameShort} | Error`;
  }, []);

  return (
    <div className="w-full min-h-screen nightSkyBackground flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-black/75 backdrop-blur-md border border-accent2/50 rounded-2xl p-6 sm:p-8 shadow-[0_0_35px_rgba(0,0,0,0.8)] flex flex-col items-center text-center gap-4 sm:gap-6">
        <h1 className="hugeHeading text-4xl sm:text-6xl text-accent2">Oops!</h1>
        <h2 className="largeHeading text-xl sm:text-2xl text-white">
          Something Went Wrong
        </h2>
        <p className="font-details text-xs sm:text-sm text-gray-300">
          An unexpected error occurred or the game mode is invalid.
        </p>
        <div className="w-full pt-2">
          <Button
            props={{
              name: "OK",
              navLink: AppRoutes.home,
              className: "w-full",
            }}
          />
        </div>
      </div>
    </div>
  );
}
