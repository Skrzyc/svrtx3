import { useEffect, useState } from "react";
import heroRunDown1AssetPath from "/src/assets/hero/hero_run_down_1.png";
import heroRunDown2AssetPath from "/src/assets/hero/hero_run_down_2.png";
import heroRunDown3AssetPath from "/src/assets/hero/hero_run_down_3.png";
import heroRunDown4AssetPath from "/src/assets/hero/hero_run_down_4.png";
import heroRunDown5AssetPath from "/src/assets/hero/hero_run_down_5.png";

const animConfig = {
  fps: 8,
  frames: [
    heroRunDown1AssetPath,
    heroRunDown2AssetPath,
    heroRunDown3AssetPath,
    heroRunDown4AssetPath,
    heroRunDown5AssetPath,
  ],
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
      setFrameIndex((prev) => (prev + 1) % animConfig.frames.length);
    }, 1000 / animConfig.fps);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div
      onClick={() => setIsPlaying((prev) => !prev)}
      className="w-auto h-auto fancyCursor"
    >
      <img
        src={animConfig.frames[frameIndex]}
        alt="animation"
        className="h-16 sm:h-32 w-auto drop-shadow-[4px_10px_2px_rgba(0,0,0,1)]"
      />
    </div>
  );
}
