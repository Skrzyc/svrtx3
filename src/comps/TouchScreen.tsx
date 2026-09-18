import { EventNames } from "../game/EventNames";

type EventType = keyof typeof EventNames;

function dispatchTouchEvent(name: EventType) {
  window.dispatchEvent(new CustomEvent(name));
}

/**
 * Touch screen overlay (mobile).
 * Splits the screen into left/right halves and emits custom
 * window events on touch/press, consumed by the game's InputManager.
 */
export function TouchScreen() {
  const handleLeftDown = () => dispatchTouchEvent(EventNames.touchLeftDown);
  const handleLeftUp = () => dispatchTouchEvent(EventNames.touchLeftUp);
  const handleRightDown = () => dispatchTouchEvent(EventNames.touchRightDown);
  const handleRightUp = () => dispatchTouchEvent(EventNames.touchRightUp);

  return (
    <div className="absolute z-70 inset-0 w-full h-full flex flex-row bg-transparent touch-none select-none">
      <div
        className="w-1/2 h-full"
        onPointerDown={handleLeftDown}
        onPointerUp={handleLeftUp}
        onPointerLeave={handleLeftUp}
        onPointerCancel={handleLeftUp}
      />
      <div
        className="w-1/2 h-full"
        onPointerDown={handleRightDown}
        onPointerUp={handleRightUp}
        onPointerLeave={handleRightUp}
        onPointerCancel={handleRightUp}
      />
    </div>
  );
}
