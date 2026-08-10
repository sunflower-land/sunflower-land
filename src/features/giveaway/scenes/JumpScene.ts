import mapJson from "assets/map/run.json";
import type { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "features/world/scenes/BaseScene";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import type { GiveawayBridge } from "../lib/bridge";
import { isRaceOver, RACE_DURATION_MS } from "../lib/sim";
import { serverNow } from "../lib/serverClock";
import type { JumpControls } from "../lib/jumpControls";
import {
  jumpQuality,
  JUMP_HEIGHT,
  RING_TOP,
  type JumpQuality,
} from "../lib/jumpScoring";
import { renderRoomPlayers } from "./renderRoomPlayers";

/** Scene key — referenced by the game config (see scenes/registry.ts). */
export const JUMP_SCENE_ID = "giveaway_jump";

// --- Ring timing ------------------------------------------------------------
// The ring itself is drawn by the React button HUD; the scene just spins the
// angle (`theta`) and grades a tap against the top of the ring.
/** Ring sweep period (ms) — tightens over the round so it gets harder. */
const PERIOD_START_MS = 1100;
const PERIOD_END_MS = 650;

// --- Jump -------------------------------------------------------------------
/** How long the rise animation for one jump takes. */
const JUMP_MS = 450;
/** One tile of climb = one metre of score. */
const PIXELS_PER_METRE = SQUARE_WIDTH;
/** Faint height gridlines every this many metres. */
const GRID_METRES = 10;

const FEEDBACK: Record<JumpQuality, { text: string; tint: number }> = {
  perfect: { text: "Perfect!", tint: 0xb65cbf },
  good: { text: "Good", tint: 0xffd12b },
  miss: { text: "Miss", tint: 0xe43b44 },
};

/**
 * Jumper.
 *
 * Everyone climbs straight up. A marker spins around a ring at your feet; tap
 * SPACE (or the button) as it hits the top to leap higher — a perfect tap flings
 * you up much further than a mistimed one. There's no landing to miss: every tap
 * gains height, better timing just gains more, so you watch the field spread out
 * vertically as people climb at their own pace. Score = metres climbed in 30s.
 *
 * Everyone drives their own Bumpkin and broadcasts their height, so you see the
 * whole field rising around you (BaseScene / renderRoomPlayers draws the rest).
 */
export class JumpScene extends BaseScene {
  sceneId: SceneId = "giveaway_jump";

  private startY = 0;
  /** Committed height (the Bumpkin's resting Y after the current jump). */
  private bankedY = 0;
  private finished = false;
  /** True while a jump's rise is animating — taps are ignored until it lands. */
  private airborne = false;
  /** Marker angle around the ring (radians). */
  private theta = 0;

  constructor() {
    super({
      name: "giveaway_jump",
      map: { json: mapJson },
      audio: { fx: { walk_key: "dirt_footstep" } },
      // We drive the Bumpkin from taps, not the movement keys.
      controls: { enabled: false },
    });
  }

  private get bridge(): GiveawayBridge | undefined {
    return this.registry.get("giveawayBridge") as GiveawayBridge | undefined;
  }

  private get controls(): JumpControls | undefined {
    return this.registry.get("gameControls") as JumpControls | undefined;
  }

  async create() {
    super.create();

    const player = this.currentPlayer;
    if (!player) return;

    this.startY = player.y;
    this.bankedY = player.y;

    // A sky, no tilemap — hide it + any colliders (same as the other games).
    this.map.layers.forEach((layer) => layer.tilemapLayer?.setVisible(false));
    this.colliders
      ?.getChildren()
      .forEach((c) =>
        (c as unknown as Phaser.GameObjects.Components.Visible).setVisible?.(
          false,
        ),
      );
    this.cameras.main.setBackgroundColor("#8fd3ff");
    this.cameras.main.roundPixels = false;

    // Let the camera + body climb past the top of the map — BaseScene bounds it
    // to the tilemap, which otherwise pins you at the top of the viewport.
    this.cameras.main.removeBounds();
    (player.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(false);

    // Follow the climb, keeping the player around the middle (well above the
    // bottom jump button so they never overlap).
    this.cameras.main.startFollow(player, true, 0.1, 0.12);

    this.drawHeightMarkers();

    // Tap: SPACE from the keyboard, or the on-screen button via the queue.
    this.input.keyboard?.on("keydown-SPACE", () => this.jump());
  }

  /** Faint "10m, 20m, …" gridlines so the climb reads as progress. */
  private drawHeightMarkers() {
    const step = GRID_METRES * PIXELS_PER_METRE;
    const width = SQUARE_WIDTH * 12;
    const centerX = this.currentPlayer?.x ?? 0;

    for (let i = 1; i <= 60; i += 1) {
      const y = this.startY - i * step;
      this.add.rectangle(centerX, y, width, 1, 0xffffff, 0.25).setDepth(1);
      this.add
        .bitmapText(
          centerX - width / 2,
          y - 8,
          "Teeny Tiny Pixls",
          `${i * GRID_METRES}m`,
          6,
        )
        .setTint(0xffffff)
        .setAlpha(0.5)
        .setDepth(1);
    }
  }

  /** Perform a jump, graded by where the marker is on the ring right now. */
  private jump() {
    const player = this.currentPlayer;
    if (!player || this.airborne || this.finished) return;
    if (this.bridge?.getPhase() !== "racing") return;

    const distance = Phaser.Math.Angle.Wrap(this.theta - RING_TOP);
    const quality = jumpQuality(distance);
    const height = JUMP_HEIGHT[quality];

    // Commit the height immediately (score is stable), then animate the rise.
    this.bankedY -= height;
    this.airborne = true;

    player.cheer(); // the existing jump animation
    this.tweens.add({
      targets: player,
      y: this.bankedY,
      duration: JUMP_MS,
      ease: "Quad.easeOut",
      onComplete: () => {
        this.airborne = false;
      },
    });

    this.showFeedback(quality);

    // Tell the button HUD where + how well we tapped (tick + feedback flash).
    const controls = this.controls;
    if (controls) {
      controls.lastTap = {
        angle: this.theta,
        quality,
        nonce: (controls.lastTap?.nonce ?? 0) + 1,
      };
    }

    const metres = Math.round((this.startY - this.bankedY) / PIXELS_PER_METRE);
    this.bridge?.onScoreChange(metres);
  }

  /** Floating "Perfect! / Good / Miss" above the player. */
  private showFeedback(quality: JumpQuality) {
    const player = this.currentPlayer;
    if (!player) return;

    const { text, tint } = FEEDBACK[quality];
    const label = this.add
      .bitmapText(
        player.x,
        player.y - 30,
        "Teeny Tiny Pixls",
        text,
        quality === "perfect" ? 8 : 6,
      )
      .setTint(tint)
      .setOrigin(0.5)
      .setDepth(Number.MAX_SAFE_INTEGER);

    this.tweens.add({
      targets: label,
      y: label.y - 16,
      alpha: 0,
      duration: 700,
      ease: "Sine.easeOut",
      onComplete: () => label.destroy(),
    });
  }

  updatePlayer() {
    const player = this.currentPlayer;
    if (!player?.body) return;

    // The player only moves vertically, and only via jump tweens.
    (player.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);

    const bridge = this.bridge;
    const now = serverNow();
    const elapsed = bridge ? now - bridge.getRaceStartAt() : 0;
    const over = isRaceOver(elapsed);
    const racing = bridge?.getPhase() === "racing" && !over && !this.finished;

    // Spin the marker (faster as the round runs down) and hand the angle to the
    // React button HUD, which draws the ring around itself.
    const controls = this.controls;
    if (racing) {
      const progress = Phaser.Math.Clamp(elapsed / RACE_DURATION_MS, 0, 1);
      const period = Phaser.Math.Linear(
        PERIOD_START_MS,
        PERIOD_END_MS,
        progress,
      );
      this.theta =
        (this.theta + (2 * Math.PI * this.game.loop.delta) / period) %
        (2 * Math.PI);
    }
    if (controls) controls.theta = this.theta;

    // Drain a tap from the button HUD (jump() guards on airborne / phase).
    if (controls && controls.taps > 0) {
      controls.taps = 0;
      this.jump();
    }

    // Submit the final height once, when the clock is up.
    if (bridge && !this.finished && bridge.getPhase() === "racing" && over) {
      this.finished = true;
      const metres = Math.round(
        (this.startY - this.bankedY) / PIXELS_PER_METRE,
      );
      bridge.onFinish(metres);
    }

    // Broadcast our height so everyone sees us climb.
    this.sendPositionToServer();

    this.soundEffects?.forEach((audio) =>
      audio.setVolumeAndPan(player.x, player.y),
    );

    player.setDepth(Math.floor(player.y));
  }

  /** Render every other climber in the room (ignoring sceneId). */
  updateOtherPlayers() {
    renderRoomPlayers(this);
  }
}
