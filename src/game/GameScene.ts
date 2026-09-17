import {
  Application,
  Assets,
  Container,
  Sprite,
  type ColorSource,
} from "pixi.js";
import { settings } from "../global/settings";
import logger from "../utils/logger";
import { delayMs } from "../utils/utils";
import { AtlasKeys } from "./AtlasKeys";
import { EventNames } from "./EventNames";
import { FruitFactory } from "./systems/FruitFactory";
import { GameUtils } from "./systems/GameUtils";
import { Hero } from "./systems/Hero";
import { InputManager } from "./systems/InputManager";
import { Scheduler } from "./systems/Scheduler";
import type { LevelConfig } from "./types/LevelConfig";

const { showGameOverScreenAfterMs } = settings;

/**
 * Game Scene class
 *
 * @description
 * For the proper game initialization methods should be called in this specific order
 * - setup
 * - preload
 * - init
 * - start
 *
 * @method setup - add configs to the object
 * @method preload - load textures, graphics and sounds
 * @method init - create an application (paused)
 * @method start - start running the app
 * @method pause - pause the game
 * @method play - unpause the game
 * @method destroy - destroy view
 *
 * @todo
 * - resize handler
 * - notifier - event emitter to hud - isolate new file class /systems
 */
export default class GameScene {
  readonly floorOffset = 50;
  readonly containerName = "pixi-container";
  readonly defaultBackgroundAccent: ColorSource = 0x000;

  private app!: Application;

  config!: LevelConfig;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  foodSheet!: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  heroSheet!: any;

  // containers
  mainContainer!: Container;

  // hero
  private hero = new Hero();

  // systems
  private inputManager = new InputManager();
  private fruitFactory = new FruitFactory();
  private scheduler = new Scheduler();

  state = {
    setup: false,
    preload: false,
    init: false,
    hpLeft: 10,
    score: 0,
    paused: true,
  };

  constructor() {}

  setup(config: LevelConfig) {
    if (this.state.setup) return;
    logger.log("GameScene :: setup");

    this.config = config;
    this.state.hpLeft = config.heroHp;
    this.state.setup = true;
  }

  // load assets
  async preload() {
    if (this.state.preload) return;
    if (!this.state.setup) {
      logger.warn("GameScene :: preload : setup not finished");
    }
    logger.log("GameScene :: preload");

    // const {} = this.config;

    // maybe whitelist filtering - pixi supports ?
    const loadSpriteSheet = async (key: string) => {
      const sheetTexture = await Assets.load(`/src/assets/atlas/${key}.png`);
      Assets.add({
        alias: key,
        src: `/src/assets/atlas/${key}.json`,
        data: { texture: sheetTexture }, // using of preloaded texture
      });
      const sheet = await Assets.load(key);

      return sheet;
    };

    this.foodSheet = await loadSpriteSheet(AtlasKeys.food);
    this.heroSheet = await loadSpriteSheet(AtlasKeys.hero);

    this.state.preload = true;
  }

  // init app
  async init() {
    if (this.state.init) return;
    if (!this.state.preload) {
      logger.warn("GameScene :: init :: preload not finished");
    }
    logger.log("GameScene :: init");

    // create app object
    const app = new Application();
    this.app = app;

    const backgroundAccent = this.config?.backgroundAccent;
    const [width, height] = [window.innerWidth, window.innerHeight];
    // init app object
    await app.init({
      width: width,
      height: height,
      backgroundColor: backgroundAccent ?? this.defaultBackgroundAccent,
      backgroundAlpha: 0.2,
      autoStart: false,
    });

    logger.log(`GameSCene :: initialized dimensions ${width} x ${height}`);

    // add app canvas to the html element
    const container = document.getElementById(this.containerName);
    if (!container) {
      throw Error(`cannot find html element with id - ${this.containerName}`);
    }

    container.appendChild(app.canvas);

    // game containers
    this.mainContainer = new Container({
      width: app.screen.width,
      height: app.screen.height,
    });
    this.app.stage.addChild(this.mainContainer);

    this.mainContainer.x = app.screen.width / 2;
    this.mainContainer.y = app.screen.height / 2;

    // setup ticker
    app.ticker.add((time) => {
      this.update(time.deltaMS);
    });

    this.state.init = true;
  }

  start() {
    if (!this.state.init) {
      logger.warn("GameScene :: start :: app not initialized");
    }
    logger.log("GameScene :: start");

    // init/start systems
    this.hero.init(this);
    this.scheduler.start();
    this.inputManager.init(this);
    this.fruitFactory.init(this);

    // set up resize handler
    window.addEventListener("resize", this.handleResize);

    this.state.paused = false;
    this.app.start();
  }

  pause() {
    logger.log("GameScene :: paused");
    this.app.stop();
  }

  play() {
    logger.log("GameScene :: play");
    this.app.start();
  }

  update(delta: number) {
    // if(this.state.paused) return;
    // if pause do not update

    // update systems
    this.scheduler.update(delta);
    this.fruitFactory.update(delta);

    // fruits collected ?
    this.mainContainer.getChildrenByLabel("fruit").forEach((elem) => {
      const fruit = elem as Sprite;
      const { sprite } = this.hero;
      const overlap = GameUtils.spritesOverlap(sprite, fruit);
      if (!overlap) return;

      this.onFruitCollected();
      this.fruitFactory.onFruitDead(fruit);
    });

    // update hero
    const [isLeft, isRight] = [
      this.inputManager.isLeftDown(),
      this.inputManager.isRightDown(),
    ];
    this.hero.update(delta, isLeft, isRight);
  }

  onGameTogglePause() {
    // check pause state
    const isPaused = this.state.paused;
    // pause/play
    this[isPaused ? "play" : "pause"]();

    // emit to HUD
    this.emitPauseToggle();

    // update state
    this.state.paused = !isPaused;
  }

  onHpLoss() {
    this.emitUpdateHp(this.state.hpLeft - 1);
    this.state.hpLeft -= 1;

    const isGameOver = this.state.hpLeft === 0;
    if (isGameOver) {
      // play game over sound

      // only pause the game
      this.pause();

      // destroy input manager (so cannot pause and move)
      this.inputManager.destroy();

      // (delay the game over emit & scene destroy)
      //  not via scheduler because game wiil be paused
      delayMs(showGameOverScreenAfterMs).then(() => {
        this.destroy();
        this.emitGameOver();
      });
    } else {
      // play hp loss sound
    }
    this.emitUpdateHp(this.state.hpLeft);
  }

  onFruitCollected() {
    // play sound
    this.state.score += Math.round(10 * (this.config.pointsMultiplier ?? 1));
    this.emitUpdateScore(this.state.score);
  }

  private emitUpdateScore(pts: number) {
    window.dispatchEvent(
      new CustomEvent(EventNames.updateScore, {
        detail: { pts: pts },
      }),
    );
  }

  private emitUpdateHp(hp: number) {
    window.dispatchEvent(
      new CustomEvent(EventNames.updateHp, { detail: { hp: hp } }),
    );
  }

  private emitGameOver() {
    window.dispatchEvent(new CustomEvent(EventNames.gameOver));
  }

  private emitPauseToggle() {
    window.dispatchEvent(new CustomEvent(EventNames.pause));
  }

  private handleResize = (): void => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // resize the actual renderer/canvas
    this.app.renderer.resize(width, height);

    // recenter the main container since it's positioned relative to screen center
    this.mainContainer.x = width / 2;
    this.mainContainer.y = height / 2;

    this.hero.placeInBounds();

    logger.log(`GameScene :: resized to ${width} x ${height}`);
  };

  destroy() {
    logger.log("GameScene :: destroy");

    // destroy app
    this.app.destroy({ removeView: true }, true);

    // remove input events
    this.inputManager.destroy();

    // remove resize handler
    window.removeEventListener("resize", this.handleResize);

    // remove canvas element form pixi-container
    // const container = document.getElementById(this.containerName);
    // container?.removeChild(this.app.canvas);

    // this.state.init = false;
    // this.state.preload = false;
    // this.state.setup = false;
  }

  scheduleMethod(method: () => void, delayMs: number, id?: string) {
    this.scheduler.scheduleMethod(method, delayMs, id);
  }

  get time(): number {
    return this.scheduler.timer;
  }

  getBounds(): { top: number; bottom: number; left: number; right: number } {
    const halfWidth = this.app.screen.width / 2;
    const halfHeight = this.app.screen.height / 2;

    return {
      top: -halfHeight,
      bottom: halfHeight,
      left: -halfWidth,
      right: halfWidth,
    };
  }

  reset() {
    this.state.setup = false;
    // skip preload (assets already exists in cache)
    this.state.init = false;
    this.state.hpLeft = 10;
    this.state.score = 0;
    this.state.paused = true;

    this.hero = new Hero();
    this.inputManager = new InputManager();
    this.fruitFactory = new FruitFactory();
    this.scheduler = new Scheduler();
  }
}
