import { useEffect, useState } from "react";

/**
 * Fade out Black overlay
 * - removes itself from DOM after the animation finished
 */
export function FadeOutOverlay({ duration = 1000 }: { duration?: number }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      className="absolute top-0 left-0 min-h-screen w-full bg-black z-50"
      style={{ animation: `fadeOut ${duration}ms ease-in-out forwards` }}
    />
  );
}
