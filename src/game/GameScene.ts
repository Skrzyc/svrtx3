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

import { Floor } from "./GameObjects.ts/Floor";
import { EventHandler } from "./systems/EventHandler";
import { SoundSystem } from "./systems/SoundSystem";
import type { Side } from "./types/Side";
import foodSheetPng from "/src/assets/atlas/food.png";
import heroSheetPng from "/src/assets/atlas/hero.png";
import floorPng from "/src/assets/floor.png";

const pathToHeroJSON = new URL("../assets/atlas/hero.json", import.meta.url)
  .href;
const pathToFoodJSON = new URL("../assets/atlas/food.json", import.meta.url)
  .href;

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
 */
export default class GameScene {
  readonly floorOffset = 90;
  readonly containerName = "pixi-container";
  readonly defaultBackgroundAccent: ColorSource = 0x000;

  private app!: Application;

  private soundSystem = new SoundSystem();

  config!: LevelConfig;
  globalScale = 1;

  // todo: disable this lint for entire file
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  foodSheet!: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  heroSheet!: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  floorTexture!: any;

  // containers
  mainContainer!: Container;

  touchState = {
    leftDown: false,
    rightDown: false,
  };

  // game elements
  private hero = new Hero();
  private floor = new Floor();

  // systems
  private eventsHandler = new EventHandler();
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
    gameOver: false,
  };

  constructor() {}

  setup(config: LevelConfig) {
    if (this.state.setup) return;
    logger.log("GameScene :: setup");

    this.config = config;
    this.state.hpLeft = config.heroHp;
    this.state.setup = true;
  }

  async preload() {
    if (this.state.preload) return;
    if (!this.state.setup) {
      logger.warn("GameScene :: preload : setup not finished");
    }
    logger.log("GameScene :: preload");

    // load floor asset
    this.floorTexture = await Assets.load(floorPng);

    // load food sprite sheet
    this.foodSheet = await GameUtils.loadSpriteSheet(
      AtlasKeys.food,
      foodSheetPng,
      pathToFoodJSON,
    );

    // load hero sprite sheet
    this.heroSheet = await GameUtils.loadSpriteSheet(
      AtlasKeys.hero,
      heroSheetPng,
      pathToHeroJSON,
    );

    // load audio
    this.soundSystem.init();

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
      // autoDensity: true,
    });

    this.globalScale = GameUtils.getGlobalScale(width, height);

    logger.log(`GameSCene :: initialized dimensions ${width} x ${height}`);

    // add app canvas to the html element
    const container = document.getElementById(this.containerName);
    if (!container) {
      throw Error(`cannot find html element with id - ${this.containerName}`);
    }

    container.innerHTML = "";
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
    this.floor.init(this);
    this.eventsHandler.init(this);

    // set up resize handler
    window.addEventListener("resize", this.handleResize);

    this.state.paused = false;
    this.app.start();
  }

  pause() {
    logger.log("GameScene :: paused");
    this.app?.stop();
  }

  play() {
    logger.log("GameScene :: play");
    this.app?.start();
  }

  update(delta: number) {
    this.scheduler.update(delta);
    this.fruitFactory.update(delta);

    // fruits collected ?
    let overlapSide: Side | false = false;
    this.mainContainer.getChildrenByLabel("fruit").forEach((elem) => {
      const fruit = elem as Sprite;
      const { sprite } = this.hero;
      const overlap = GameUtils.getOverlap(sprite, fruit);
      if (!overlap) return;
      overlapSide = overlap;

      this.onFruitCollected();
      this.fruitFactory.onFruitDead(fruit);
    });

    // update hero
    let [isLeft, isRight] = [
      this.inputManager.isLeftDown(),
      this.inputManager.isRightDown(),
    ];

    // if anyKeyboardInputs -fall back to touchState -> not ideal solution (fix later)
    const anyKeyboardInputs = isLeft || isRight;
    if (!anyKeyboardInputs) {
      [isLeft, isRight] = [this.touchState.leftDown, this.touchState.rightDown];
    }

    this.hero.update(delta, isLeft, isRight, overlapSide);
  }

  onGameTogglePause(noEmit?: true) {
    // check pause state
    const isPaused = this.state.paused;

    // pause/play
    this[isPaused ? "play" : "pause"]();

    // update state
    this.state.paused = !isPaused;

    if (noEmit ?? false) return;

    // emit to HUD
    this.emitPauseToggle();
  }

  onHpLoss() {
    if (this.state.gameOver || this.state.hpLeft <= 0) return;

    this.state.hpLeft -= 1;
    this.emitUpdateHp(this.state.hpLeft);

    if (this.state.hpLeft <= 0) {
      this.state.gameOver = true;
      // play game over sound
      this.soundSystem.playSfx("gameOverSound");

      // only pause the game
      this.pause();

      // destroy input manager (so cannot pause and move)
      this.inputManager.destroy();

      // (delay the game over emit & scene destroy)
      // not via scheduler because game wiil be paused - so scheduler will not be running
      delayMs(showGameOverScreenAfterMs).then(() => {
        if (this.state.gameOver) {
          this.destroy();
          this.emitGameOver();
        }
      });
    } else {
      this.soundSystem.playSfx("hpLossSound");
    }
  }

  onFruitCollected() {
    this.soundSystem.playSfx("collectSound");
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
    if (!this.app?.renderer || !this.mainContainer) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.globalScale = GameUtils.getGlobalScale(width, height);

    // resize the actual renderer/canvas
    this.app.renderer.resize(width, height);

    // recenter the main container since it's positioned relative to screen center
    this.mainContainer.x = width / 2;
    this.mainContainer.y = height / 2;

    this.hero.resize();
    this.floor.resize();
    this.fruitFactory.resize();

    logger.log(`GameScene :: resized to ${width} x ${height}`);
  };

  destroy() {
    logger.log("GameScene :: destroy");

    // destroy app safely without destroying shared asset textures
    if (this.app) {
      try {
        this.app.destroy(
          { removeView: true },
          { children: true, texture: false, textureSource: false },
        );
      } catch (err) {
        logger.warn(`GameScene :: app destroy error: ${err}`);
      }
      this.app = undefined as unknown as Application;
    }

    // remove input events
    this.inputManager.destroy();

    // remove resize handler
    window.removeEventListener("resize", this.handleResize);

    // destroy the sound system
    this.soundSystem.destroy();

    this.eventsHandler.destroy();

    this.state.init = false;
  }

  scheduleMethod(method: () => void, delayMs: number, id?: string) {
    this.scheduler.scheduleMethod(method, delayMs, id);
  }

  get time(): number {
    return this.scheduler.timer;
  }

  getBounds(): { top: number; bottom: number; left: number; right: number } {
    const halfWidth = (this.app?.screen?.width ?? window.innerWidth) / 2;
    const halfHeight = (this.app?.screen?.height ?? window.innerHeight) / 2;

    return {
      top: -halfHeight,
      bottom: halfHeight,
      left: -halfWidth,
      right: halfWidth,
    };
  }

  reset() {
    logger.log("GameScene :: reset");

    this.destroy();

    this.state.setup = false;
    this.state.init = false;
    this.state.hpLeft = this.config?.heroHp ?? 10;
    this.state.score = 0;
    this.state.paused = true;
    this.state.gameOver = false;

    this.hero = new Hero();
    this.inputManager = new InputManager();
    this.fruitFactory = new FruitFactory();
    this.scheduler = new Scheduler();
  }
}
