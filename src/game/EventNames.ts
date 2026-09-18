export const EventNames = {
  // events:  GAME -> HUD
  updateHp: "updateHp",
  updateScore: "updateScore",
  gameOver: "gameOver",
  pause: "pause",
  // events: HUD -> GAME
  touchLeftDown: "touchLeftDown",
  touchLeftUp: "touchLeftUp",
  touchRightDown: "touchRightDown",
  touchRightUp: "touchRightUp",
  pauseClicked: "pauseClicked",
} as const;
