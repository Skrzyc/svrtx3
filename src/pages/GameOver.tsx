import { Button } from "../comps/Button";
import { gameObject } from "../game/GameObject";
import type { LevelName } from "../game/types/LevelName";
import { AppRoutes } from "../global/AppRoutes";
import { UrlParams } from "../global/paramKeys";

/**
 * Game Over Screen
 *
 * @todo
 * - fade in effect
 */
export const GameOver = ({
  score,
  gameMode,
}: {
  score: number;
  gameMode: LevelName;
}) => {
  const currentMode = gameMode ?? "easy";

  return (
    // GAME OVER SCREEN
    <div className="w-full min-h-screen flex flex-col gap-2 bg-black justify-center items-center">
      <p className="hugeHeading"> GAME OVER </p>
      <p className="bigHeading"> {`SCORE : ${score}`} </p>
      <br></br>
      <br></br>
      <div className="flex flex-row gap-2 justify-evenly items-center">
        <Button
          name="TRY AGAIN"
          navLink={`${AppRoutes.loading}?${UrlParams.gameMode}=${currentMode}`}
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
