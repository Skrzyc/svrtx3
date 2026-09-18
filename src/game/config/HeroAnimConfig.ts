export type AnimConfig = {
  frameCount: number;
  startAtFrame: number;
  basePath: string;
  flipX?: true;
};

const HeroAnimConfig: { [key: string]: AnimConfig } = {
  idle: {
    frameCount: 4,
    startAtFrame: 1,
    basePath: "hero_idle_",
  },
  moveLeft: {
    frameCount: 4,
    startAtFrame: 1,
    basePath: "hero_run_left_",
  },
  moveRight: {
    frameCount: 6,
    startAtFrame: 1,
    basePath: "hero_run_left_",
    flipX: true,
  },
  sliceLeft: {
    frameCount: 3,
    startAtFrame: 1,
    basePath: "hero_slice_left_",
    flipX: true,
  },
  sliceRight: {
    frameCount: 3,
    startAtFrame: 1,
    basePath: "hero_slice_left_",
  },
  sliceUp: {
    frameCount: 3,
    startAtFrame: 1,
    basePath: "hero_slice_up_",
  },
  sliceDown: {
    frameCount: 3,
    startAtFrame: 1,
    basePath: "hero_slice_down_",
  },
};
Object.freeze(HeroAnimConfig);

export { HeroAnimConfig };
