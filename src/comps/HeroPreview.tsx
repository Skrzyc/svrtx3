import { useEffect, useState } from "react";

const animConfig = {
  basePath: "src/assets/hero/hero_run_down_",
  frameCount: 5,
  fps: 8,
  padStart: 1,
};

const isDev = import.meta.env.DEV;

/**
 * Showcase Hero idle animation
 *
 * @todo
 *  - move to plain css with images on one sprite sheet - for better performance
 *  - animation chain run -> idle -> run -> ...
 */
export function HeroPreview() {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(!isDev);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % animConfig.frameCount);
    }, 1000 / animConfig.fps);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div
      onClick={() => setIsPlaying((prev) => !prev)}
      className="w-auto h-auto fancyCursor"
    >
      <img
        src={`${animConfig.basePath}${frameIndex + animConfig.padStart}.png`}
        alt="animation"
        className="h-16 sm:h-32 w-auto drop-shadow-[4px_10px_2px_rgba(0,0,0,1)]"
      />
    </div>
  );
}
