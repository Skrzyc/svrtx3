import { Application } from "pixi.js";
import { useEffect, useRef } from "react";

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    let destroyed = false;
    const app = new Application();
    appRef.current = app;

    (async () => {
      await app.init({
        resizeTo: window,
        backgroundColor: 0x112233,
        // antialias: true,
        // preference:
      });

      // If component unmounted while init() was awaiting, bail out
      if (destroyed || !containerRef.current) return;

      containerRef.current.appendChild(app.canvas);

      // // --- your game setup goes here ---
      // const texture = await Assets.load("/assets/knight-1.png");
      // const sprite = new Sprite(texture);
      // sprite.anchor.set(0.5);
      // sprite.x = app.screen.width / 2;
      // sprite.y = app.screen.height / 2;
      // app.stage.addChild(sprite);

      // app.ticker.add(() => {
      //   sprite.rotation += 0.01;
      // });
    })();

    return () => {
      destroyed = true;
      appRef.current?.destroy(true, { children: true, texture: true });
      appRef.current = null;
    };
  }, []);

  return <div ref={containerRef}></div>;
}
