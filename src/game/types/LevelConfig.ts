/**
 * @param note - show text during loading (loading text)
 */
export type LevelConfig = {
  note: string;
  baseFallSpeed: number;
  heroHp: number;
  assets: string[];
  // optional
  pointsMultiplier?: number;
  backgroundAccent?: number;
  // musicPath
  // background
  // fruit assets
  // hero speed
};

// 'Cookie.png', 'Brownie.png', 'Stein.png', 'Moonshine.png', 'Whiskey.png', 'Tart.png', 'Sushi.png', 'Sashimi.png', 'Saki.png', 'Boar.png', 'Marmalade.png', 'Jam.png', 'Apple.png', 'AppleWorm.png', 'Turnip.png', 'Potato.png', 'Eggs.png', 'Honeycomb.png', 'Pineapple.png', 'Bacon.png', 'Beer.png', 'Steak.png', 'Wine.png', 'Fish.png', 'Cheese.png', 'Chicken.png', 'Bread.png', 'Eggplant.png', 'PepperRed.png', 'PepperGreen.png', 'Grubs.png', 'Grub.png', 'Tomato.png', 'Strawberry.png', 'Peach.png', 'Lemon.png', 'PiePumpkin.png', 'PieLemon.png', 'PieApple.png', 'Pickle.png', 'Pretzel.png', 'Pepperoni.png', 'FishFillet.png', 'Honey.png', 'Jerky.png', 'PotatoRed.png', 'MelonHoneydew.png', 'MelonCantaloupe.png', 'MelonWater.png', 'Waffles.png', 'ChickenLeg.png', 'Cherry.png', 'Ribs.png', 'Sardines.png', 'DragonFruit.png', 'Sausages.png', 'Avocado.png', 'FishSteak.png', 'Bug.png', 'Olive.png', 'PickledEggs.png', 'Roll.png', 'Onion.png', 'Shrimp.png'
