import mapJson from "assets/map/run.json";
import type { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "features/world/scenes/BaseScene";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import type { GiveawayBridge } from "../lib/bridge";
import { isRaceOver, seedFor } from "../lib/sim";

/** Scene key — referenced by GiveawayPhaser's SCENE_BY_TYPE map. */
export const RACE_SCENE_ID = "giveaway_race";

// --- Pace model -------------------------------------------------------------
// Auto-runner feel: every 4s the runner picks one of ten fixed paces at random.
// The spread is deliberately wide so gear changes are obvious on screen, and the
// pick is weighted by where you are relative to the pack.

/**
 * The ten paces, px/second (slowest → fastest). A ~3× spread: wide enough to
 * read on screen, but not so wide that the runner lurches between a crawl and a
 * sprint. The average (~38px/s) is what sets the distance budget.
 */
const RUN_SPEEDS = [18, 22, 26, 30, 35, 40, 45, 50, 55, 60];

/** Pace is re-rolled on this fixed cadence. */
const PACE_INTERVAL_MS = 4000;

/**
 * Consecutive paces must differ by at least this many gears, so a re-roll is
 * never an imperceptible nudge to a neighbouring speed.
 */
const MIN_GEAR_JUMP = 2;

/**
 * How quickly the runner eases toward a newly picked pace (per second). Lower =
 * more gradual; at 1.2 a gear change glides in over ~2s rather than snapping,
 * which also keeps the motion smooth.
 */
const SPEED_SMOOTHING = 1.2;

/** The pace at which the walk animation plays at its natural rate. */
const ANIM_REFERENCE_SPEED = 38;

// The map is 24 tiles high: the top 8 and bottom 8 rows are trees, and the
// middle 8 are the runnable lane. Runners start at a random Y within it.
const RUN_BAND_TOP = 8 * SQUARE_WIDTH; // y = 128
const RUN_BAND_BOTTOM = 16 * SQUARE_WIDTH; // y = 256
/** Keeps runners clear of the tree line at either edge of the lane. */
const LANE_PADDING = 8;

/** One tile of track = one metre of distance. */
const PIXELS_PER_METRE = SQUARE_WIDTH;

// --- Other runners -----------------------------------------------------------
// Everyone else who joined arrives over the MMO: they're all on the stream
// server with their giveaway scene as `sceneId`, so BaseScene renders them from
// the room state with their REAL clothing + username, and moves them to the
// positions they broadcast. We just line ourselves up and broadcast our own.
/** ± horizontal jitter on the start line, in px. */
const START_JITTER_X = 20;

/** Distance from the pack (px) at which the weighting is fully applied. */
const PACK_BIAS_RANGE = 160;
/** 0 = always uniform, 1 = heavily biased. */
const PACK_BIAS_STRENGTH = 0.9;

/**
 * The giveaway running race.
 *
 * Renders the `run.json` Tiled map (24 tiles high — trees top and bottom, an
 * 8-tile runnable lane through the middle) and automates the local player:
 * keyboard/joystick control is disabled and the Bumpkin runs on its own once
 * the countdown finishes. Other runners aren't simulated here — their positions
 * arrive over the MMO, so we keep broadcasting ours via `sendPositionToServer`.
 */
export class RaceScene extends BaseScene {
  sceneId: SceneId = "giveaway_race";

  private startX = 0;
  private maxX = Number.POSITIVE_INFINITY;
  /** X of the start line (before the local player's own jitter). */
  private lineX = 0;
  /** The pace we're easing toward, and the one actually applied this frame. */
  private targetSpeed = 0;
  private currentSpeed = 0;
  private nextPaceAt = 0;
  private lastGear = -1;
  private finished = false;
  /** "This is you" arrow that hovers above the local player. */
  private marker?: Phaser.GameObjects.Image;

  constructor() {
    super({
      name: "giveaway_race",
      map: { json: mapJson },
      audio: { fx: { walk_key: "dirt_footstep" } },
      // The race drives the Bumpkin — no keyboard / joystick control.
      controls: { enabled: false },
    });
  }

  private get bridge(): GiveawayBridge | undefined {
    return this.registry.get("giveawayBridge") as GiveawayBridge | undefined;
  }

  preload() {
    super.preload();
    this.load.image("race_marker", SUNNYSIDE.icons.arrow_down);
  }

  async create() {
    super.create();

    this.lineX = this.currentPlayer?.x ?? 0;

    // Line up at a random height in the lane + a small ± offset on the start
    // line, so runners spread out instead of stacking on one row/column.
    const spot = this.staggerFor(this.bridge?.playerId ?? 0);
    this.currentPlayer?.teleport(this.lineX + spot.x, spot.y);

    this.startX = this.currentPlayer?.x ?? 0;
    // Never run off the end of the map.
    this.maxX = this.map.widthInPixels - SQUARE_WIDTH * 2;

    // Softly follow the player (a lerp, not a hard lock) so the Bumpkin stays
    // on screen but visibly drifts ahead when it speeds up and back when it
    // slows — the pace changes read on screen.
    if (this.currentPlayer) {
      this.cameras.main.startFollow(this.currentPlayer, true, 0.06, 0.1);
    }

    // `pixelArt: true` turns on roundPixels, which snaps both the sprite and the
    // camera to whole pixels every frame — their relative position then shimmers
    // by ±1px, which reads as jitter. Render sub-pixel instead.
    this.cameras.main.roundPixels = false;

    // A marker so you can pick yourself out of a crowded field.
    this.marker = this.add
      .image(0, 0, "race_marker")
      .setDepth(Number.MAX_SAFE_INTEGER);
  }

  /** Deterministic lane + start-line offset for a runner (same on every client). */
  private staggerFor(farmId: number): { x: number; y: number } {
    const s = seedFor(farmId, this.bridge?.giveawayId ?? "");
    const y =
      RUN_BAND_TOP +
      LANE_PADDING +
      ((s % 1000) / 1000) * (RUN_BAND_BOTTOM - RUN_BAND_TOP - 2 * LANE_PADDING);
    const x =
      ((((s >> 10) % (2 * START_JITTER_X)) + 2 * START_JITTER_X) %
        (2 * START_JITTER_X)) -
      START_JITTER_X;
    return { x, y };
  }

  /**
   * Where we sit relative to the pack: +1 = far ahead, -1 = far behind, 0 =
   * with the pack (or running alone). Other runners' positions come from the
   * MMO via `playerEntities`.
   */
  private packBias(): number {
    const me = this.currentPlayer;
    if (!me) return 0;

    const others = Object.values(this.playerEntities);
    if (others.length === 0) return 0;

    const packX = others.reduce((sum, p) => sum + p.x, 0) / others.length;
    return Phaser.Math.Clamp((me.x - packX) / PACK_BIAS_RANGE, -1, 1);
  }

  /**
   * Pick one of the ten paces at random, weighted by pack position: trailing
   * runners favour the faster gears (catch-up), leaders favour the slower ones
   * so the pack stays together. Flip the sign on `-bias` to invert that.
   * Gears within MIN_GEAR_JUMP of the current one are excluded so the change
   * always reads on screen.
   */
  private pickSpeed(): number {
    const bias = this.packBias();
    const mid = (RUN_SPEEDS.length - 1) / 2;

    const eligible = RUN_SPEEDS.map((_, i) => i).filter(
      (i) => this.lastGear < 0 || Math.abs(i - this.lastGear) >= MIN_GEAR_JUMP,
    );

    const weights = eligible.map((i) =>
      Math.max(0.05, 1 + PACK_BIAS_STRENGTH * -bias * ((i - mid) / mid)),
    );

    const total = weights.reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;
    let picked = eligible[eligible.length - 1];
    for (let k = 0; k < eligible.length; k += 1) {
      roll -= weights[k];
      if (roll <= 0) {
        picked = eligible[k];
        break;
      }
    }

    this.lastGear = picked;
    return RUN_SPEEDS[picked];
  }

  /** Re-roll the target pace and schedule the next change. */
  private rollPace(now: number) {
    this.targetSpeed = this.pickSpeed();
    this.nextPaceAt = now + PACE_INTERVAL_MS;
  }

  /**
   * Ease the applied speed toward the target. Exponential smoothing keeps this
   * frame-rate independent, so gear changes glide rather than snapping (which
   * is what made the running look jerky).
   */
  private easeSpeed(deltaMs: number): number {
    const t = 1 - Math.exp(-SPEED_SMOOTHING * (deltaMs / 1000));
    this.currentSpeed += (this.targetSpeed - this.currentSpeed) * t;

    // Settle cleanly instead of creeping toward zero forever.
    if (this.targetSpeed === 0 && this.currentSpeed < 1) this.currentSpeed = 0;

    return this.currentSpeed;
  }

  /**
   * Replaces BaseScene's input-driven movement entirely, so the keyboard can't
   * move the Bumpkin — the race does.
   */
  updatePlayer() {
    const player = this.currentPlayer;
    if (!player?.body) return;

    const body = player.body as Phaser.Physics.Arcade.Body;
    const bridge = this.bridge;
    const now = Date.now();

    const elapsed = bridge ? now - bridge.getRaceStartAt() : 0;
    const over = isRaceOver(elapsed);
    const racing = bridge?.getPhase() === "racing" && !over && !this.finished;

    if (racing && player.x < this.maxX) {
      if (now >= this.nextPaceAt) this.rollPace(now);
    } else {
      // Ease to a stop rather than halting dead.
      this.targetSpeed = 0;
    }

    const deltaMs = this.game.loop.delta;
    const speed = this.easeSpeed(deltaMs);

    // Integrate the position ourselves rather than handing arcade a velocity:
    // there's nothing to collide with on the track, and doing it here keeps
    // full sub-pixel precision instead of being quantised by the physics step.
    body.setVelocity(0, 0);
    if (speed > 0) {
      player.x = Math.min(this.maxX, player.x + speed * (deltaMs / 1000));
    }

    if (speed > 0) {
      player.faceRight();
      player.walk();
      // The walk animation is authored at a fixed 10fps, so without this the
      // legs cycle identically at every pace. Scale playback with speed.
      if (player.sprite?.anims) {
        player.sprite.anims.timeScale = speed / ANIM_REFERENCE_SPEED;
      }
    } else {
      player.idle();
      if (player.sprite?.anims) player.sprite.anims.timeScale = 1;
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

    // Keep the "you" marker hovering above the local player, with a gentle bob
    // driven off the clock (a tween would fight this per-frame positioning).
    this.marker?.setPosition(
      player.x,
      player.y - 24 + Math.sin(this.time.now / 200) * 2,
    );

    // Keep broadcasting our position so other players see us run.
    this.sendPositionToServer();

    this.soundEffects?.forEach((audio) =>
      audio.setVolumeAndPan(player.x, player.y),
    );
    this.walkAudioController?.handleWalkSound(speed > 0);

    player.setDepth(Math.floor(player.y));
  }
}
