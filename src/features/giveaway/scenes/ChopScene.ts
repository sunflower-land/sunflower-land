// run.json has no Collision/Interactable object layers, so hiding its tilemap
// (below) leaves nothing behind — woodlands.json's object layers rendered as
// Phaser missing-texture boxes once the map was hidden.
import mapJson from "assets/map/run.json";
import type { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "features/world/scenes/BaseScene";
import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import type { Player } from "features/world/types/Room";
import { SUNNYSIDE } from "assets/sunnyside";
import { getAnimationUrl } from "features/world/lib/animations";
import { tokenUriBuilder, type BumpkinParts } from "lib/utils/tokenUriBuilder";
import type { GiveawayBridge } from "../lib/bridge";
import { isRaceOver, RACE_DURATION_MS } from "../lib/sim";

/** Scene key — referenced by GiveawayPhaser's SCENE_BY_TYPE map. */
export const CHOP_SCENE_ID = "giveaway_chop";

// --- Timing bar -------------------------------------------------------------
// A marker sweeps back and forth across a track above the player's head. One
// full sweep is 2s, so it crosses the centre once a second — the cadence the
// chopping animation runs at.

/** Sweep duration at the start of the round (centre crossing every ~1s)… */
const SWING_PERIOD_START_MS = 2000;
/** …tightening to this by the end, so it gets harder as the clock runs down. */
const SWING_PERIOD_END_MS = 800;
/** Half-width of the track, in world px. */
const TRACK_HALF = 40;
/** The sliding marker's width — the perfect sliver matches it exactly. */
const MARKER_WIDTH = 3;
/** Landing within half a marker-width of centre is a perfect strike. */
const PERFECT_HALF = MARKER_WIDTH / 2;
/** Anything else inside this band is a good strike. */
const GOOD_HALF = 12;

const PERFECT_POINTS = 10;
const GOOD_POINTS = 3;

/** The bar floats this far above the player. */
const METER_OFFSET_Y = 46;

// --- Scenery ----------------------------------------------------------------
/** Max other players drawn around you (hard-coded spots, filled as they join). */
const MAX_CHOPPERS = 20;
/** How far to the right of a Bumpkin their tree sits. */
const TREE_OFFSET_X = 20;
/** Grid the chopping spots are laid out on, centred on the player. */
const SPOT_COLS = 6;
const SPOT_ROWS = 4;
const SPOT_SPACING_X = 95;
const SPOT_SPACING_Y = 58;
/** Keep the area immediately around the player clear.  */
const CLEARING = 34;

/**
 * Fixed, evenly-spaced spots around the player — one tree + one player each,
 * filled in join order. Built once from a grid (minus anything crowding the
 * player), nearest-first so the crowd stays balanced around the centre.
 */
const CHOPPER_SPOTS: { x: number; y: number }[] = (() => {
  const spots: { x: number; y: number }[] = [];

  for (let row = 0; row < SPOT_ROWS; row += 1) {
    for (let col = 0; col < SPOT_COLS; col += 1) {
      const x = (col - (SPOT_COLS - 1) / 2) * SPOT_SPACING_X;
      const y = (row - (SPOT_ROWS - 1) / 2) * SPOT_SPACING_Y;
      if (Math.abs(x) < CLEARING && Math.abs(y) < CLEARING) continue;
      spots.push({ x, y });
    }
  }

  return spots
    .sort((a, b) => Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y))
    .slice(0, MAX_CHOPPERS);
})();

/**
 * Log Chop.
 *
 * The player stands next to a tree swinging an axe while a marker sweeps back
 * and forth across a bar. Tapping SPACE (or clicking) as it crosses the centre
 * scores: 5 for a perfect strike, 3 for the edges of the sweet spot, 0 outside
 * it. One strike per sweep leg, so it's a once-a-second rhythm. Runs for the
 * standard 30s, then the score is submitted.
 */
export class ChopScene extends BaseScene {
  sceneId: SceneId = "giveaway_chop";

  private score = 0;
  private chopping = false;
  private armed = true;
  private currentLeg = -1;
  /** Sweep position, 0→1 per full back-and-forth. */
  private phase = 0;
  private markerOffset = 0;
  private finished = false;

  /** Current sweep duration — drives both the bar and the swing speed. */
  private currentPeriodMs = SWING_PERIOD_START_MS;

  /**
   * Other players in the room, keyed by MMO session id and drawn at a fixed
   * spot (not their broadcast position — everyone stands at their own spawn, so
   * real positions would stack). Their clothing + username come from the room
   * state, exactly like the plaza.
   */
  private choppers = new Map<
    string,
    {
      container: BumpkinContainer;
      tree: Phaser.GameObjects.Image;
    }
  >();

  // Timing bar parts (world-space, so the camera zoom scales them for free).
  private track?: Phaser.GameObjects.Rectangle;
  private goodZone?: Phaser.GameObjects.Rectangle;
  private perfectZone?: Phaser.GameObjects.Rectangle;
  private marker?: Phaser.GameObjects.Rectangle;

  constructor() {
    super({
      name: "giveaway_chop",
      map: { json: mapJson },
      audio: { fx: { walk_key: "dirt_footstep" } },
      // The player stands and chops — no walking around.
      controls: { enabled: false },
    });
  }

  private get bridge(): GiveawayBridge | undefined {
    return this.registry.get("giveawayBridge") as GiveawayBridge | undefined;
  }

  preload() {
    super.preload();
    this.load.image("chop_tree", SUNNYSIDE.resource.tree);

    // Load a proper axe-swing sheet for every outfit in play. BumpkinContainer
    // only bakes idle/walking/dig/drilling into its own sheet, so the chopping
    // animation has to be loaded and driven separately (see playAxe).
    this.axeOutfits().forEach(({ key, clothing }) =>
      this.load.spritesheet(`axe-${key}`, getAnimationUrl(clothing, ["axe"]), {
        frameWidth: 96,
        frameHeight: 64,
      }),
    );
  }

  /**
   * The outfit that needs a real axe-swing sheet: only the local player. Remote
   * players' outfits arrive at runtime over the MMO (we can't preload sheets for
   * them), so they chop with BumpkinContainer's baked `dig()` animation instead.
   */
  private axeOutfits(): { key: string; clothing: BumpkinParts }[] {
    const clothing = this.gameState?.bumpkin?.equipped as
      | BumpkinParts
      | undefined;
    if (!clothing) return [];
    return [{ key: tokenUriBuilder(clothing), clothing }];
  }

  /** Animation key for an outfit's axe swing. */
  private axeKeyFor(clothing?: Player["clothing"]): string | undefined {
    if (!clothing) return undefined;
    const key = `axe-anim-${tokenUriBuilder(clothing as unknown as BumpkinParts)}`;
    return this.anims.exists(key) ? key : undefined;
  }

  /**
   * Hold the axe animation on its first frame — the ready pose between swings.
   * Re-applied every frame because BumpkinContainer calls idle() itself once its
   * own sheet finishes loading, which would otherwise clobber the pose.
   */
  private restPose(container: BumpkinContainer) {
    const sprite = container.sprite;
    const key = this.axeKeyFor(container.clothing);
    if (!sprite || !key) return;

    // Mid-swing — let it finish.
    if (sprite.anims.isPlaying && sprite.anims.getName() === key) return;

    const frames = this.anims.get(key)?.frames;
    if (!frames?.length) return;

    if (sprite.anims.getName() !== key) sprite.anims.play(key);
    sprite.anims.pause(frames[0]);
  }

  /**
   * Fire a single swing. Playback is scaled so the swing always finishes inside
   * one sweep leg — as the bar speeds up, so does the axe, guaranteeing the
   * animation has reset by the next tap.
   */
  private swing(container: BumpkinContainer) {
    const sprite = container.sprite;
    const key = this.axeKeyFor(container.clothing);
    if (!sprite || !key) return;

    const anim = this.anims.get(key);
    if (!anim) return;

    const targetMs = Math.max(1, (this.currentPeriodMs / 2) * 0.9);
    sprite.anims.timeScale = Phaser.Math.Clamp(
      anim.duration / targetMs,
      0.5,
      6,
    );

    sprite.anims.play(key);
    sprite.anims.resume();
  }

  async create() {
    super.create();

    const player = this.currentPlayer;
    if (!player) return;

    player.faceRight();

    // A plain green field — the forest we plant below is the only scenery, so
    // hide the tilemap the BaseScene needs. (BaseScene requires a map to build
    // the scene; we just don't draw it.) Also hide any collision objects so
    // they don't show as missing-texture boxes.
    this.map.layers.forEach((layer) => layer.tilemapLayer?.setVisible(false));
    this.colliders
      ?.getChildren()
      .forEach((c) =>
        (c as unknown as Phaser.GameObjects.Components.Visible).setVisible?.(
          false,
        ),
      );
    this.cameras.main.setBackgroundColor("#63c74d");

    // See RaceScene: pixelArt implies roundPixels, which makes the lerping
    // camera shimmer against the sprite.
    this.cameras.main.roundPixels = false;

    // Build the axe animations from the sheets loaded in preload().
    this.axeOutfits().forEach(({ key }) => {
      const animKey = `axe-anim-${key}`;
      if (this.anims.exists(animKey) || !this.textures.exists(`axe-${key}`)) {
        return;
      }
      this.anims.create({
        key: animKey,
        frames: this.anims.generateFrameNumbers(`axe-${key}`),
        frameRate: 10,
        // One swing per tap — it rests on the first frame in between.
        repeat: 0,
      });
    });

    // The tree the local player is chopping.
    this.addTree(player.x + TREE_OFFSET_X, player.y + 2);

    this.buildMeter(player.x, player.y);
    this.bindInput();
  }

  private addTree(x: number, y: number): Phaser.GameObjects.Image {
    return (
      this.add
        .image(x, y, "chop_tree")
        .setOrigin(0.5, 1)
        // Depth by Y so trees layer correctly against the Bumpkins.
        .setDepth(y)
    );
  }

  /**
   * BaseScene renders remote players at the positions they broadcast — but in
   * Log Chop nobody moves, so everyone sits on their own spawn and they'd stack.
   * Instead we place each player from the room at a fixed spot around us, with
   * their REAL clothing + username from the room state (same source as the
   * plaza) and their own tree. Filled in join order, up to MAX_CHOPPERS.
   */
  updateOtherPlayers() {
    const server = this.mmoServer;
    const player = this.currentPlayer;
    if (!server || !player) return;

    // Drop anyone who left the room or switched away from this scene.
    for (const [sessionId, chopper] of this.choppers) {
      const remote = server.state.players.get(sessionId);
      if (!remote || remote.sceneId !== this.scene.key) {
        chopper.container.destroy();
        chopper.tree.destroy();
        this.choppers.delete(sessionId);
      }
    }

    server.state.players.forEach((remote, sessionId) => {
      if (sessionId === server.sessionId) return;
      if (remote.sceneId !== this.scene.key) return;

      const existing = this.choppers.get(sessionId);
      if (existing) {
        // Keep their clothing in sync if they change it mid-round.
        existing.container.changeClothing(remote.clothing);
        return;
      }

      if (this.choppers.size >= CHOPPER_SPOTS.length) return;

      const spot = CHOPPER_SPOTS[this.choppers.size];
      const x = player.x + spot.x;
      const y = player.y + spot.y;

      try {
        const container = new BumpkinContainer({
          scene: this,
          x,
          y,
          clothing: remote.clothing,
          name: remote.username ?? `#${remote.farmId}`,
        });
        container.setDepth(y);
        container.faceRight();
        const tree = this.addTree(x + TREE_OFFSET_X, y + 2);
        this.choppers.set(sessionId, { container, tree });
      } catch {
        // A single failed Bumpkin shouldn't take the scene down.
      }
    });
  }

  /** The timing bar, drawn in world space just above the player's head. */
  private buildMeter(x: number, y: number) {
    const top = y - METER_OFFSET_Y;

    this.track = this.add
      .rectangle(x, top, TRACK_HALF * 2, 8, 0x000000, 0.5)
      .setDepth(1e6);
    this.goodZone = this.add
      .rectangle(x, top, GOOD_HALF * 2, 8, 0xffd12b, 0.85)
      .setDepth(1e6 + 1);
    // A single purple sliver exactly as wide as the marker — line them up for
    // a perfect strike.
    this.perfectZone = this.add
      .rectangle(x, top, MARKER_WIDTH, 8, 0xb65cbf, 1)
      .setDepth(1e6 + 2);
    this.marker = this.add
      .rectangle(x, top, MARKER_WIDTH, 14, 0xffffff, 1)
      .setDepth(1e6 + 3);
  }

  /** A tick left behind at the exact spot the player tapped. */
  private addTapMark(offset: number) {
    const player = this.currentPlayer;
    if (!player) return;

    const mark = this.add
      .rectangle(
        player.x + offset,
        player.y - METER_OFFSET_Y,
        1,
        18,
        0xffffff,
        0.9,
      )
      .setDepth(1e6 + 4);

    this.tweens.add({
      targets: mark,
      alpha: 0,
      duration: 900,
      ease: "Sine.easeOut",
      onComplete: () => mark.destroy(),
    });
  }

  private bindInput() {
    this.input.keyboard?.on("keydown-SPACE", () => this.strike());
    this.input.on("pointerdown", () => this.strike());
  }

  /** Score the current marker position, once per sweep leg. */
  private strike() {
    if (!this.armed || this.finished) return;
    if (this.bridge?.getPhase() !== "racing") return;

    this.armed = false;

    const distance = Math.abs(this.markerOffset);
    const points =
      distance <= PERFECT_HALF
        ? PERFECT_POINTS
        : distance <= GOOD_HALF
          ? GOOD_POINTS
          : 0;

    this.score += points;
    // The score itself is rendered by the HTML overlay (crisper than canvas
    // text); the scene just publishes it.
    this.bridge?.onScoreChange(this.score);
    this.addTapMark(this.markerOffset);
    this.showStrikeFeedback(points);

    // Fire the swing for this tap.
    if (this.currentPlayer) this.swing(this.currentPlayer);
  }

  /** Floating "Perfect +10" / "Good +3" / "Miss" above the player. */
  private showStrikeFeedback(points: number) {
    const player = this.currentPlayer;
    if (!player) return;

    const { text, tint, size } =
      points === PERFECT_POINTS
        ? { text: `Perfect +${points}`, tint: 0xb65cbf, size: 8 }
        : points === GOOD_POINTS
          ? { text: `Good +${points}`, tint: 0xffd12b, size: 6 }
          : { text: "Miss", tint: 0xe43b44, size: 6 };

    // The bitmap font the rest of the world uses — stays crisp at any zoom.
    const label = this.add
      .bitmapText(
        player.x,
        player.y - METER_OFFSET_Y - 24,
        "Teeny Tiny Pixls",
        text,
        size,
      )
      .setTint(tint)
      .setOrigin(0.5)
      .setDepth(1e6 + 5);

    this.tweens.add({
      targets: label,
      y: label.y - 18,
      alpha: 0,
      duration: 800,
      ease: "Sine.easeOut",
      onComplete: () => label.destroy(),
    });
  }

  /**
   * The NPCs chop on the same rhythm as the bar (so they speed up with it),
   * each offset a little so they aren't in lockstep. Everyone rests on the
   * first frame between swings.
   */
  /**
   * Remote players chop with the baked `dig()` swing (we can't preload a real
   * axe sheet for their runtime clothing). It loops on its own, so we just kick
   * it off while the round is live and let them idle otherwise.
   */
  private updateChoppers(racing: boolean) {
    this.choppers.forEach(({ container }) => {
      if (racing) container.dig();
      else container.idle();
    });
  }

  private stopChopping() {
    this.currentPlayer?.idle();
    this.choppers.forEach(({ container }) => container.idle());
  }

  updatePlayer() {
    const player = this.currentPlayer;
    if (!player?.body) return;

    // The player never moves in this game.
    (player.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);

    const bridge = this.bridge;
    const now = Date.now();
    const elapsed = bridge ? now - bridge.getRaceStartAt() : 0;
    const over = isRaceOver(elapsed);
    const racing = bridge?.getPhase() === "racing" && !over;

    // Show the bar only while the round is live.
    [this.track, this.goodZone, this.perfectZone, this.marker].forEach((part) =>
      part?.setVisible(racing),
    );

    // Remote players are drawn + kept in sync by updateOtherPlayers() (called by
    // BaseScene each frame from the room state); here we just animate them.
    this.restPose(player);
    this.updateChoppers(racing);

    if (racing) {
      this.chopping = true;

      // The sweep tightens as the round runs down, so it gets progressively
      // harder. Advance a phase accumulator rather than using `elapsed % period`
      // — with a changing period the latter would make the marker jump.
      const progress = Phaser.Math.Clamp(elapsed / RACE_DURATION_MS, 0, 1);
      this.currentPeriodMs = Phaser.Math.Linear(
        SWING_PERIOD_START_MS,
        SWING_PERIOD_END_MS,
        progress,
      );
      this.phase =
        (this.phase + this.game.loop.delta / this.currentPeriodMs) % 1;

      // Triangle sweep: -TRACK_HALF → +TRACK_HALF → -TRACK_HALF.
      const ramp =
        this.phase < 0.5 ? this.phase / 0.5 : 1 - (this.phase - 0.5) / 0.5;
      this.markerOffset = (ramp * 2 - 1) * TRACK_HALF;
      this.marker?.setX(player.x + this.markerOffset);

      // Re-arm each time the marker turns around, so it's one strike per leg.
      const leg = Math.floor(this.phase * 2);
      if (leg !== this.currentLeg) {
        this.currentLeg = leg;
        this.armed = true;
      }
    } else if (this.chopping) {
      this.chopping = false;
      this.stopChopping();
    }

    if (bridge && !this.finished && bridge.getPhase() === "racing" && over) {
      this.finished = true;
      bridge.onFinish(this.score);
    }

    this.sendPositionToServer();
    player.setDepth(Math.floor(player.y));
  }
}
