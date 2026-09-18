import { gameObject } from "../game/GameObject";
import type { LevelName } from "../game/types/LevelName";
import { AppRoutes } from "../global/AppRoutes";
import { UrlParams } from "../global/paramKeys";
import { Button } from "./Button";

export const Pause = ({ gameMode }: { gameMode: LevelName }) => {
  return (
    <div className="absolute min-h-screen w-full bg-white/50 z-80 top-0 left-0 flex flex-col justify-center items-center">
      <p className="hugeHeading text-text-accent-bg"> PAUSED </p>
      <br></br>
      <br></br>
      <div className="flex flex-row gap-2 justify-evenly items-center">
        <Button
          name="TRY AGAIN"
          navLink={`${AppRoutes.loading}?${UrlParams.gameMode}=${gameMode}`}
          onClick={() => gameObject.reset()}
        />
        <Button
          name="BACK"
          navLink={AppRoutes.home}
          onClick={() => gameObject.reset()}
        />
      </div>
    </div>
  );
};
