import { Racer } from "../actions/getRacers";
import { RacingBumpkin } from "./RacingBumpkin";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";

export class BumpkinsRaceScene extends Phaser.Scene {
  public static SceneKey = "BumpkinsRaceScene";
  public ready = false;
  private bumpkinMap = new Map<string, RacingBumpkin>();
  private statusText: Phaser.GameObjects.Text | null = null;
  private startTime: number | null = null;
  private duration: number | null = null;
  private isRunning = false;

  constructor() {
    super(BumpkinsRaceScene.SceneKey);
  }

  preload() {
    this.load.spritesheet("silhouette", "world/silhouette.webp", {
      frameWidth: 14,
      frameHeight: 18,
    });
    this.load.image("shadow", "world/shadow.png");
  }

  create() {
    this.ready = true;
    this.cameras.main.setBounds(0, 0, 3000, this.scale.height);
  }

  updateRacers(racers: Racer[]) {
    racers.forEach((racer) => {
      if (this.bumpkinMap.has(`${racer.id}`)) return;

      const { equipped } = interpretTokenUri(racer.tokenUri);
      const x = 32;
      const y =
        this.cameras.main.height -
        racer.startYPercent * this.cameras.main.height;

      const bumpkin = new RacingBumpkin({
        scene: this,
        x,
        y,
        clothing: equipped,
      });
      this.add.existing(bumpkin).setScale(3);

      this.bumpkinMap.set(racer.id.toString(), bumpkin);
    });
  }

  startRace(race: {
    startsAt: number;
    duration: number;
    racers: Record<string, number[]>;
  }) {
    this.startTime = race.startsAt;
    this.duration = race.duration;

    // Assign positions to bumpkins in the map
    Object.entries(race.racers).forEach(([id, positions]) => {
      const bumpkin = this.bumpkinMap.get(id);
      if (!bumpkin) {
        return;
      }

      bumpkin.racePositions = positions;
      bumpkin.currentRaceIndex = 0;
      bumpkin.x = positions[0]; // Set initial x
    });

    this.isRunning = true;
    this.updateText("race");
  }

  updateText(
    state:
      | "loading"
      | "race"
      | "noRace"
      | "error"
      | "ready"
      | "preparing"
      | "finished",
  ) {
    const textConfig = {
      font: "24px Arial",
      color: "#ffffff",
    };

    const messages = {
      loading: "Loading...",
      error: "Error",
      ready: "Ready",
      preparing: "Preparing...",
      noRace: "No race on at the moment!",
      race: "Race in progress...",
      finished: "Race finished!",
    };

    if (this.statusText) {
      this.statusText.destroy();
    }

    this.statusText = this.add.text(10, 10, messages[state] || "", textConfig);
  }

  update() {
    if (!this.isRunning || this.startTime === null || this.duration === null)
      return;

    const elapsedSec = (Date.now() - this.startTime) / 1000;

    if (elapsedSec >= this.duration) {
      this.isRunning = false;
      this.updateText("finished");
      return;
    }

    const frameIndex = Math.floor(elapsedSec);
    const nextIndex = frameIndex + 1;
    const t = elapsedSec - frameIndex; // fractional progress between current and next frame

    for (const bumpkin of this.bumpkinMap.values()) {
      const positions = bumpkin.racePositions;
      if (!positions || positions.length === 0) continue;

      const current = positions[frameIndex];
      const next = positions[nextIndex] ?? positions[positions.length - 1]; // fallback to final

      if (current === undefined || next === undefined) continue;

      bumpkin.x = Phaser.Math.Interpolation.Linear([current, next], t);
    }

    const leading = [...this.bumpkinMap.values()].sort((a, b) => b.x - a.x)[0];
    if (leading) {
      this.cameras.main.scrollX = Phaser.Math.Clamp(
        leading.x - this.scale.width / 2 + 100,
        0,
        this.cameras.main.width - this.scale.width,
      );
    }
  }
}
