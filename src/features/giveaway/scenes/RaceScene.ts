import mapJson from "assets/map/run.json";
import type { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "features/world/scenes/BaseScene";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import type { GiveawayBridge } from "../lib/bridge";
import { isRaceOver, seedFor } from "../lib/sim";
import { RACE_COLORS, type RaceControls } from "../lib/raceControls";
import { renderRoomPlayers } from "./renderRoomPlayers";

/** Scene key — referenced by GiveawayPhaser's SCENE_BY_TYPE map. */
export const RACE_SCENE_ID = "giveaway_race";

// --- Hop mechanic -----------------------------------------------------------
// You don't run automatically any more — a colour prompt shows which of the four
// buttons (red/green/yellow/blue → A/S/D/F) to press. Each correct press hops
// you one square down the track (in an arc) and rolls a new colour. Tap fast =
// move fast. Distance covered in the 30s is your score.

/** How far a correct press moves you — one full square per hop. */
const HOP_DISTANCE = SQUARE_WIDTH;
/** How far a WRONG press knocks you back — one square the other way. */
const WRONG_PENALTY = SQUARE_WIDTH;
/** Duration of a single hop (horizontal glide + arc). */
const HOP_MS = 200;
/** Apex height of the hop arc (px) — the body lifts, the shadow stays put. */
const ARC_HEIGHT = 12;

// The map is 24 tiles high: the top 8 and bottom 8 rows are trees, and the
// middle 8 are the runnable lane. Runners start at a random Y within it.
const RUN_BAND_TOP = 8 * SQUARE_WIDTH; // y = 128
const RUN_BAND_BOTTOM = 16 * SQUARE_WIDTH; // y = 256
/** Keeps runners clear of the tree line at either edge of the lane. */
const LANE_PADDING = 8;

/** One tile of track = one metre of distance. */
const PIXELS_PER_METRE = SQUARE_WIDTH;

/**
 * The giveaway running race.
 *
 * A colour-matching hop race: a coloured cue floats over your Bumpkin and one of
 * the four buttons (red/green/yellow/blue, mapped to A/S/D/F + on-screen taps)
 * is highlighted. Press the matching one to hop forward and roll a new colour;
 * over 30s the distance you cover is your score. Keyboard is handled here; taps
 * arrive from the React button HUD via the shared `raceControls` channel.
 *
 * Every player drives their OWN Bumpkin, so movement is real: each hop moves us
 * and we broadcast it (`sendPositionToServer`), and BaseScene renders + moves
 * everyone else from the room state with their real clothing.
 */
export class RaceScene extends BaseScene {
  sceneId: SceneId = "giveaway_race";

  private startX = 0;
  private maxX = Number.POSITIVE_INFINITY;
  /** X of the start line (before the local player's own jitter). */
  private lineX = 0;
  private finished = false;
  /** Whether taps/keys currently count (mirrors the `racing` phase). */
  private isRacing = false;
  /** The colour you must press right now, or null when not racing. */
  private targetColor: number | null = null;
  /** The coloured cue that floats above your head (also marks "this is you"). */
  private cue?: Phaser.GameObjects.Arc;
  /** Baseline sprite Y, captured so the hop bob always returns home. */
  private spriteBaseY?: number;

  constructor() {
    super({
      name: "giveaway_race",
      map: { json: mapJson },
      audio: { fx: { walk_key: "dirt_footstep" } },
      // We drive the Bumpkin from button presses, not the movement keys.
      controls: { enabled: false },
    });
  }

  private get bridge(): GiveawayBridge | undefined {
    return this.registry.get("giveawayBridge") as GiveawayBridge | undefined;
  }

  private get controls(): RaceControls | undefined {
    return this.registry.get("gameControls") as RaceControls | undefined;
  }

  /**
   * Render everyone else in the party room (ignoring `sceneId`, unlike BaseScene)
   * so remote racers actually show up. See renderRoomPlayers for why.
   */
  updateOtherPlayers() {
    renderRoomPlayers(this);
  }

  async create() {
    super.create();

    this.lineX = this.currentPlayer?.x ?? 0;

    // Line up at a random height in the lane + a small ± offset on the start
    // line, so runners spread out instead of stacking on one row/column.
    const spot = this.staggerFor(this.bridge?.playerId ?? 0);
    this.currentPlayer?.teleport(this.lineX + spot.x, spot.y);

    this.startX = this.currentPlayer?.x ?? 0;
    // Never hop off the end of the map.
    this.maxX = this.map.widthInPixels - SQUARE_WIDTH * 2;

    // Softly follow the player (a lerp, not a hard lock) so hops read as forward
    // progress while keeping the Bumpkin comfortably on screen.
    if (this.currentPlayer) {
      this.cameras.main.startFollow(this.currentPlayer, true, 0.08, 0.1);
    }

    // `pixelArt: true` turns on roundPixels, which snaps sprite + camera to whole
    // pixels every frame; their relative position then shimmers by ±1px, which
    // reads as jitter. Render sub-pixel instead.
    this.cameras.main.roundPixels = false;

    // The colour cue above your head — its fill is the colour you must press.
    this.cue = this.add
      .circle(0, 0, 4, RACE_COLORS[0].hex, 1)
      .setStrokeStyle(1, 0x000000, 0.4)
      .setDepth(Number.MAX_SAFE_INTEGER)
      .setVisible(false);

    // Keyboard: A/S/D/F map to the four colours. Taps come in via the queue.
    RACE_COLORS.forEach((color, index) => {
      this.input.keyboard?.on(`keydown-${color.key}`, () => this.press(index));
    });
  }

  /**
   * Deterministic starting lane for a runner (same on every client). Only the
   * Y (lane) is spread — every racer starts at the SAME X so the leaderboard can
   * turn their broadcast X straight into distance run.
   */
  private staggerFor(farmId: number): { x: number; y: number } {
    const s = seedFor(farmId, this.bridge?.giveawayId ?? "");
    const y =
      RUN_BAND_TOP +
      LANE_PADDING +
      ((s % 1000) / 1000) * (RUN_BAND_BOTTOM - RUN_BAND_TOP - 2 * LANE_PADDING);
    return { x: 0, y };
  }

  /** Roll the next colour to press and tell the HUD to highlight it. */
  private pickTarget() {
    this.targetColor = Math.floor(Math.random() * RACE_COLORS.length);
    this.cue?.setFillStyle(RACE_COLORS[this.targetColor].hex).setVisible(true);
    this.controls?.setTarget(this.targetColor);
  }

  private clearTarget() {
    if (this.targetColor === null) return;
    this.targetColor = null;
    this.cue?.setVisible(false);
    this.controls?.setTarget(null);
  }

  /** Handle a colour press (from a key or a tapped button). */
  private press(color: number) {
    if (!this.isRacing || this.finished) return;
    if (!this.currentPlayer) return;

    const correct = color === this.targetColor;
    // Forward one square on a hit, back one square on a miss.
    this.hop(correct ? HOP_DISTANCE : -WRONG_PENALTY);
    if (correct) this.pickTarget();

    // Tell the HUD so it can animate the button (and cross a wrong one).
    this.controls?.onFeedback(color, correct);
  }

  /**
   * Hop one square in an arc — the body glides across while lifting up and back
   * down (the shadow stays on the ground). Retargeted from the current position
   * so rapid taps chain into continuous hopping.
   */
  private hop(dx: number) {
    const player = this.currentPlayer;
    if (!player) return;

    const targetX = Phaser.Math.Clamp(player.x + dx, this.startX, this.maxX);

    player.faceRight();

    // Horizontal glide.
    this.tweens.killTweensOf(player);
    this.tweens.add({
      targets: player,
      x: targetX,
      duration: HOP_MS,
      ease: "Linear",
    });

    // Vertical arc (up then down) — combined with the glide it reads as a hop.
    const sprite = player.sprite;
    if (sprite) {
      if (this.spriteBaseY === undefined) this.spriteBaseY = sprite.y;
      this.tweens.killTweensOf(sprite);
      sprite.y = this.spriteBaseY;
      this.tweens.add({
        targets: sprite,
        y: this.spriteBaseY - ARC_HEIGHT,
        duration: HOP_MS / 2,
        yoyo: true,
        ease: "Quad.easeOut",
      });
    }
  }

  /**
   * Replaces BaseScene's input-driven movement: the movement keys never drive
   * the Bumpkin, only the colour presses do.
   */
  updatePlayer() {
    const player = this.currentPlayer;
    if (!player?.body) return;

    // The player only moves in discrete hops — no physics velocity.
    (player.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);

    const bridge = this.bridge;
    const now = Date.now();
    const elapsed = bridge ? now - bridge.getRaceStartAt() : 0;
    const over = isRaceOver(elapsed);
    this.isRacing = bridge?.getPhase() === "racing" && !over && !this.finished;

    // Start the colour prompt when the race opens; clear it when it closes.
    if (this.isRacing) {
      if (this.targetColor === null) this.pickTarget();
    } else {
      this.clearTarget();
    }

    // Drain taps from the React button HUD (press() guards on the racing state).
    const controls = this.controls;
    if (controls) {
      while (controls.queue.length) {
        const color = controls.queue.shift();
        if (color !== undefined) this.press(color);
      }
    }

    const metres = Math.max(
      0,
      Math.round((player.x - this.startX) / PIXELS_PER_METRE),
    );

    // Report the final distance once — only when the clock is up. (No mid-race
    // submissions; those flashed a loading modal every few seconds.)
    if (bridge && !this.finished && bridge.getPhase() === "racing" && over) {
      this.finished = true;
      bridge.onFinish(metres);
    }

    // Keep the colour cue hovering above the local player, with a gentle bob.
    this.cue?.setPosition(
      player.x,
      player.y - 26 + Math.sin(this.time.now / 200) * 2,
    );

    // Broadcast our position every frame so other players see us hop across.
    this.sendPositionToServer();

    this.soundEffects?.forEach((audio) =>
      audio.setVolumeAndPan(player.x, player.y),
    );

    player.setDepth(Math.floor(player.y));
  }
}
