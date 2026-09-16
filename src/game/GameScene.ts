import {
  Application,
  Assets,
  Container,
  Sprite,
  type ColorSource,
} from "pixi.js";
import logger from "../utils/logger";
import { AtlasKeys } from "./AtlasKeys";
import { EventNames } from "./EventNames";
import type { LevelConfig } from "./types/LevelConfig";

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
 *
 */
export default class GameScene {
  readonly containerName = "pixi-container";
  readonly defaultBackgroundAccent: ColorSource = 0x000;

  private config!: LevelConfig;
  private app!: Application;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private foodSheet!: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private heroSheet!: any;

  private mainContainer!: Container;

  state = {
    setup: false,
    preload: false,
    init: false,
  };

  constructor() {}

  setup(config: LevelConfig) {
    if (this.state.setup) return;
    logger.log("GameScene :: setup");

    this.config = config;
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

    // remove canvas element if exist inside a child node already
    // temp fix - inspect - probably react useffect called twice init()
    if (container.hasChildNodes()) {
      container.childNodes.forEach((childNode) => {
        container.removeChild(childNode);
        childNode.remove();
      });
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

    // add some sprite - test

    const someTexture = this.foodSheet.textures["DragonFruit.png"];
    const sprite = new Sprite({ texture: someTexture });

    this.mainContainer.addChild(sprite);
    // const { width, height } = this.mainContainer;
    // const { x, y, width, height } = this.mainContainer;
    sprite.scale.set(2, 2);
    sprite.position.x = -20;
    sprite.position.y = 50;

    this.app.start();
  }

  pause() {
    logger.log("GameScene : paused");
    this.app.stop();
  }

  play() {
    logger.log("GameScene : play");
    this.app.start();
  }

  update(delta: number) {
    // this.app.render(); - no need i think
    this.app.render();
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

  destroy() {
    // if(!this.app || !this.state.init)
    //   return;
    // }
    logger.log("GameScene :: destroy");

    // destory app
    this.app.destroy({ removeView: true }, true);

    // remove canvas element form pixi-container
    // const container = document.getElementById(this.containerName);
    // container?.removeChild(this.app.canvas);

    // this.state.init = false;
    // this.state.preload = false;
    // this.state.setup = false;
  }
}
