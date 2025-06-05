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
  private worldWidth = 3000;

  constructor() {
    super(BumpkinsRaceScene.SceneKey);
  }

  preload() {
    console.log("📦 Preloading assets...");
    this.load.spritesheet("silhouette", "world/silhouette.webp", {
      frameWidth: 14,
      frameHeight: 18,
    });
    this.load.image("shadow", "world/shadow.png");
  }

  create() {
    console.log("✅ Scene created");
    this.ready = true;
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.scale.height);
    this.physics.world.setBounds(0, 0, this.worldWidth, this.scale.height);
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

      console.log(`🆕 Added bumpkin ${racer.username} at (${x}, ${y})`);
    });
  }

  startRace(race: {
    startsAt: number;
    duration: number;
    racers: Record<string, number[]>;
  }) {
    console.log("🏁 Starting race with:", Object.keys(race.racers));
    this.startTime = race.startsAt;
    this.duration = race.duration;

    Object.entries(race.racers).forEach(([id, positions]) => {
      const bumpkin = this.bumpkinMap.get(id);
      if (!bumpkin) {
        console.warn("❌ No bumpkin found for ID:", id);
        return;
      }

      console.log(
        `✅ Assigning ${positions.length} positions to bumpkin ${id}`,
      );
      bumpkin.racePositions = positions;
      bumpkin.currentRaceIndex = 0;
      bumpkin.x = positions[0];
      bumpkin.walk();
    });

    this.isRunning = true;
    this.updateText("race");
  }

  finishRace() {
    this.isRunning = false;
    this.updateText("finished");
    this.bumpkinMap.forEach((bumpkin) => {
      bumpkin.idle();
    });
    console.log("🎉 Race finished");
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
    console.log("🔄 update");
    console.log("this.isRunning", this.isRunning);
    console.log("this.startTime", this.startTime);
    console.log("this.duration", this.duration);
    if (!this.isRunning || this.startTime === null || this.duration === null)
      return;

    const elapsedSec = (Date.now() - this.startTime) / 1000;
    console.log(`🔄 update — elapsed: ${elapsedSec.toFixed(2)}s`);

    if (elapsedSec >= this.duration) {
      this.finishRace();
      return;
    }

    const frameIndex = Math.floor(elapsedSec);
    const nextIndex = frameIndex + 1;
    const t = elapsedSec - frameIndex;

    for (const [id, bumpkin] of this.bumpkinMap.entries()) {
      const positions = bumpkin.racePositions;
      if (!positions || positions.length === 0) {
        console.warn(`⚠️ No positions for bumpkin ${id}`);
        continue;
      }

      const current = positions[frameIndex];
      const next = positions[nextIndex] ?? positions[positions.length - 1];

      if (current === undefined || next === undefined) {
        console.warn(
          `⚠️ Missing current/next for bumpkin ${id} at frame ${frameIndex}`,
        );
        continue;
      }

      const interpolatedX = Phaser.Math.Interpolation.Linear(
        [current, next],
        t,
      );
      bumpkin.x = interpolatedX;

      console.log(
        `🚀 ${id} — x=${interpolatedX.toFixed(2)} (from ${current} to ${next}, t=${t.toFixed(2)})`,
      );
    }

    // Follow the leader
    const leadingBumpkin = [...this.bumpkinMap.values()].sort(
      (a, b) => b.x - a.x,
    )[0];

    if (leadingBumpkin) {
      this.cameras.main.scrollX = Phaser.Math.Clamp(
        leadingBumpkin.x - this.scale.width / 2,
        0,
        this.worldWidth - this.scale.width,
      );
      console.log(
        `🎥 Camera following leader at x=${leadingBumpkin.x.toFixed(2)}`,
      );
    }
  }
}
