// game/SoundSystem.ts
import { sound } from "@pixi/sound";
import { UrlParams } from "../../global/paramKeys";

export type SoundKey = "hpLossSound" | "collectSound" | "gameOverSound";

const Sounds: Record<SoundKey, string> = {
  hpLossSound: "/audio/hpLoss.mp3",
  gameOverSound: "/audio/gameOver.mp3",
  collectSound: "/audio/collect.mp3",
};

export class SoundSystem {
  private loaded = false;
  private muted = false;
  private musicVolume = 1;
  private sfxVolume = 1;
  private currentMusic: SoundKey | null = null;

  async init() {
    if (this.loaded) return;

    // get from url param
    this.muted =
      (new URLSearchParams(window.location.search).get(UrlParams.audio) ??
        "true") === "false";

    this.musicVolume = 1;
    this.sfxVolume = 1;

    // preload everything
    await Promise.all(
      Object.entries(Sounds).map(([key, url]) =>
        sound.add(key, { url, preload: true }),
      ),
    );

    this.loaded = true;
  }

  playSfx(key: SoundKey, options: { volume?: number } = {}) {
    if (this.muted) return;
    sound.play(key, { volume: (options.volume ?? 1) * this.sfxVolume });
  }

  playMusic(key: SoundKey, options: { loop?: boolean; fadeMs?: number } = {}) {
    if (this.currentMusic === key) return; // already playing
    if (this.currentMusic) sound.stop(this.currentMusic);

    this.currentMusic = key;
    if (this.muted) return;

    sound.play(key, {
      loop: options.loop ?? true,
      volume: this.musicVolume,
    });
  }

  stopMusic() {
    if (this.currentMusic) sound.stop(this.currentMusic);
    this.currentMusic = null;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    sound.toggleMuteAll();
  }

  destroy() {
    sound.stopAll();
    this.loaded = false;
    this.currentMusic = null;
  }
}

export const soundSystem = new SoundSystem();
