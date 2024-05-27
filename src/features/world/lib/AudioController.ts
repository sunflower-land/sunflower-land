import Phaser from "phaser";

export type Sound =
  | Phaser.Sound.HTML5AudioSound
  | Phaser.Sound.WebAudioSound
  | Phaser.Sound.NoAudioSound;

export class WalkAudioController {
  // private music: Sound;
  private walkSound: Sound;

  constructor(walkSound: Sound) {
    // this.music = music;
    this.walkSound = walkSound;
  }

  handleWalkSound(isWalking: boolean): void {
    if (isWalking) {
      if (!this.walkSound.isPlaying) {
        this.walkSound.play({ loop: true, volume: 0.07, rate: 0.62 });
      }
    } else {
      if (this.walkSound.isPlaying) {
        this.walkSound.stop();
      }
    }
  }
}

export type AudioProps = {
  sound: Sound;
  distanceThreshold: number;
  coordinates: {
    x: number;
    y: number;
  };
  maxVolume: number;
};

export class AudioController {
  // private music: Sound;
  private audio: AudioProps;

  constructor(audio: AudioProps) {
    this.audio = audio;
  }

  setVolumeAndPan(playerX: number, playerY: number): void {
    const distanceToSoundSource = Phaser.Math.Distance.Between(
      playerX,
      playerY,
      this.audio.coordinates.x,
      this.audio.coordinates.y
    );

    let normalizedSound =
      1 - Math.min(distanceToSoundSource / this.audio.distanceThreshold, 1);
    normalizedSound = Math.max(normalizedSound, 0);

    if ("volume" in this.audio.sound) {
      const volume =
        Phaser.Math.Easing.Sine.In(normalizedSound) * this.audio.maxVolume;
      this.audio.sound.volume = Phaser.Math.Clamp(
        volume,
        0,
        this.audio.maxVolume
      );
    }

    const panPosition =
      Phaser.Math.Clamp((playerX - this.audio.coordinates.x) / 50, -1, 1) * -1;

    if ("setPan" in this.audio.sound) {
      this.audio.sound.setPan(panPosition);
    }
  }
}
