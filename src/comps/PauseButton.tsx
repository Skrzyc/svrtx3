import { EventNames } from "../game/EventNames";

/**
 * Pause Button
 */
export function PauseButton({
  isPaused,
  togglePause,
}: {
  isPaused: boolean;
  togglePause: () => void;
}) {
  const method = () => {
    // toggle HUD pause state
    togglePause();
    // dispatch event to game
    window.dispatchEvent(new CustomEvent(EventNames.pauseClicked));
  };
  return (
    <div
      onClick={method}
      className="absolute z-90 bottom-0 left-0 bg-black/80 p-1"
    >
      <p className="font-details text-sm sm:text-base text-white">
        {isPaused ? "PLAY" : "PAUSE"}
      </p>
    </div>
  );
}
