// run.json has no Collision/Interactable object layers, so hiding its tilemap
// (below) leaves nothing behind — see ChopScene for the woodlands.json trap.
import mapJson from "assets/map/run.json";
import pumpkinProc from "assets/crops/pumpkin/proc_sprite.png";
import giantPumpkinUrl from "assets/sfts/giant_pumpkin.png";
import type { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "features/world/scenes/BaseScene";
import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import type { Player } from "features/world/types/Room";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { getAnimationUrl } from "features/world/lib/animations";
import { NPC_WEARABLES } from "lib/npcs";
import { tokenUriBuilder, type BumpkinParts } from "lib/utils/tokenUriBuilder";
import type { GiveawayBridge } from "../lib/bridge";
import { serverNow } from "../lib/serverClock";
import type { PopControls, PopVictim } from "../lib/popControls";
import {
  popRound,
  isPopOver,
  popVerdict,
  roundScores,
  popBots,
  botRate,
  botWaters,
  POP_FIELD_SIZE,
  POP_WATER_MS,
  type PopPhase,
} from "../lib/pop";
import { DEFAULT_CLOTHING, inThisGiveaway } from "./renderRoomPlayers";

/** Scene key — referenced by the game config (see scenes/registry.ts). */
export const POP_SCENE_ID = "giveaway_pop";

// --- The patch --------------------------------------------------------------
// You stand on the FRONT row and the rest of the field is laid out behind you.
// The water button owns the bottom of the screen, so nothing may sit below your
// own plot — hence rows go up from you, never down.
const SPOT_COLS = 5;
/** Rows behind you (your own row is the 4th). */
const SPOT_ROWS_BEHIND = 3;
const SPOT_SPACING_X = 74;
const SPOT_SPACING_Y = 56;

/** How far to the right of a Bumpkin their pumpkin patch sits. Enough to clear
 * their name label, which the pumpkin would otherwise be drawn over. */
const PLOT_OFFSET_X = 27;
const PLOT_OFFSET_Y = 3;

/** Camera sits this far above you, so the field behind fills the screen. */
const CAMERA_LIFT = 73;

/**
 * Fixed, evenly-spaced plots, filled in join order — nearest-first, so the
 * patch fills out around you whether it's 3 growers or a full field.
 */
const GROWER_SPOTS: { x: number; y: number }[] = (() => {
  const spots: { x: number; y: number }[] = [];

  for (let row = 0; row <= SPOT_ROWS_BEHIND; row += 1) {
    for (let col = 0; col < SPOT_COLS; col += 1) {
      const x = (col - (SPOT_COLS - 1) / 2) * SPOT_SPACING_X;
      const y = -row * SPOT_SPACING_Y;
      // Your own cell — the middle of the front row.
      if (x === 0 && y === 0) continue;
      spots.push({ x, y });
    }
  }

  return spots.sort((a, b) => Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y));
})();

// --- Growth -----------------------------------------------------------------
/** Waters at which the pumpkin changes form: a seedling until 10, then a real
 * pumpkin, a warty goblin pumpkin at 50, and the giant pumpkin at 100. The
 * sizes around you are the only read you get on how hard everyone is going. */
const STAGE_WATERS = [0, 10, 50, 100];
/** Scale at zero waters… */
const SCALE_MIN = 0.75;
/** …growing this much per water, forever — there is NO cap. Keep watering and
 * it keeps swelling. */
const SCALE_PER_WATER = 0.028;

// --- The pop ----------------------------------------------------------------
/** Bits of rind thrown out by an exploding pumpkin. */
const CHUNK_COUNT = 9;
/** Pumpkin flesh, rind and a bit of stalk. */
const CHUNK_COLOURS = [0xe07b39, 0xf5a03c, 0xc25c26, 0x63c74d];

/** Bumpkin outfits handed to the simulated neighbours. */
const BOT_OUTFITS = [
  "pumpkin' pete",
  "old salty",
  "hammerin harry",
  "misty marvel",
  "cluck e cheese",
] as const;

/**
 * One grower: a Bumpkin, their soil, and the pumpkin swelling on it.
 *
 * Scoring is deliberately uniform across everyone, YOU INCLUDED. Each grower
 * carries one running total (`points` — the same running total real players
 * broadcast over the MMO) plus the snapshot of it taken when the round opened.
 * A round score is always the difference, so there's a single rule deciding who
 * hit the cap — never one path for the local player and another for everyone
 * else.
 */
type Grower = {
  id: string;
  name: string;
  x: number;
  y: number;
  container?: BumpkinContainer;
  soil: Phaser.GameObjects.Image;
  pumpkin: Phaser.GameObjects.Image;
  /**
   * Running total of waters — what a real player broadcasts as `points`. This
   * only ever goes UP: it is never reset between rounds, so every client can
   * score any round as "the total now, less the snapshot at round start".
   * (What you BANK from a round is decided at the reveal — pop and the round's
   * waters are worth nothing — but the running total itself never rewinds.)
   */
  points: number;
  /** That total when the current round opened. Only THIS moves each round. */
  pointsAtRoundStart: number;
  /** `points - pointsAtRoundStart`, cached for rendering. */
  waters: number;
  /** Simulated neighbour: their taps-per-second for the current round. */
  rate?: number;
};

/**
 * Pumpkin Pop.
 *
 * Five 15-second rounds. Tap WATER as often as you like and your pumpkin swells
 * with every splash — but when the round closes, the field is ranked and the
 * **top 30% pop**, banking NOTHING for the round. Everyone else banks their
 * waters. Nobody is ever knocked out: pop and you replant for the next round.
 * You want a good score every round, just never the best one — the biggest
 * banked total after five rounds wins.
 *
 * The competing field is simulated locally (`lib/pop.ts`, seeded off the
 * giveaway id so every client agrees) with any real players in the room ranked
 * alongside them off the `points` they broadcast. There's no server-side round
 * model yet, so the pops are resolved client-side; the banked total submitted
 * at the end is what the server actually ranks.
 */
export class PopScene extends BaseScene {
  sceneId: SceneId = "giveaway_pop";

  // The whole patch has to be readable at a glance for the pops to land, so
  // this scene pulls the camera back from the world's usual 3/4.
  zoom = window.innerWidth < 500 ? 1.8 : 2.2;

  /** Your plot. Kept separate from `growers` — you sit in the middle, and your
   * Bumpkin is BaseScene's `currentPlayer` rather than a container we own. */
  private me?: Grower;
  /** Everyone else, keyed by grower id (`bot-n` / `mmo-<sessionId>`). */
  private growers = new Map<string, Grower>();

  private fieldBuilt = false;
  /** Where we are in the round, as of this frame — the gate on watering. */
  private phase: PopPhase = "intro";
  /** Waters banked from survived rounds — the score the server ranks. */
  private banked = 0;
  private finished = false;

  private lastWaterRound = -1;
  private lastRevealRound = -1;
  private revealNonce = 0;

  /** Broadcast throttle (we send our running water total as `points`). */
  private lastBroadcastAt = 0;
  private lastBroadcastPoints = -1;

  /** Outfit keys whose watering sheet is loaded or in-flight. */
  private wateringLoading = new Set<string>();

  /** "That one's you" arrow — the field is a crowd of near-identical growers. */
  private marker?: Phaser.GameObjects.Image;

  constructor() {
    super({
      name: "giveaway_pop",
      map: { json: mapJson },
      audio: { fx: { walk_key: "dirt_footstep" } },
      // You stand at your plot and water — no walking around.
      controls: { enabled: false },
    });
  }

  private get bridge(): GiveawayBridge | undefined {
    return this.registry.get("giveawayBridge") as GiveawayBridge | undefined;
  }

  private get controls(): PopControls | undefined {
    return this.registry.get("gameControls") as PopControls | undefined;
  }

  preload() {
    super.preload();

    this.load.image("pop_soil", SUNNYSIDE.soil.soil2);
    this.load.image("pop_marker", SUNNYSIDE.icons.arrow_down);

    // Growth stages: a seedling, then pure pumpkin sprites (no dirt baked into
    // the art — the soil is its own image and must stay a constant size).
    const lifecycle = CROP_LIFECYCLE["Basic Biome"].Pumpkin;
    [
      lifecycle.seedling,
      lifecycle.crop,
      SUNNYSIDE.sfts.wartyGoblinPumpkin,
      giantPumpkinUrl,
    ].forEach((url, i) => this.load.image(`pop_pumpkin_${i}`, url));

    // The crop harvest "proc" sheet doubles beautifully as a pumpkin bursting.
    this.load.spritesheet("pop_burst", pumpkinProc, {
      frameWidth: 36,
      frameHeight: 36,
    });

    // Our own watering sheet. BumpkinContainer only bakes idle/walking/dig/
    // drilling into its sheet, so watering is loaded + driven separately (the
    // same trick ChopScene uses for the axe). Neighbours load theirs on demand.
    const clothing = this.gameState?.bumpkin?.equipped as
      | BumpkinParts
      | undefined;
    if (clothing) {
      this.load.spritesheet(
        `watering-${tokenUriBuilder(clothing)}`,
        getAnimationUrl(clothing, ["watering"]),
        { frameWidth: 96, frameHeight: 64 },
      );
    }
  }

  async create() {
    super.create();

    const player = this.currentPlayer;
    if (!player) return;

    player.faceRight();

    // A plain autumn field — the plots are the only scenery, so hide the
    // tilemap the BaseScene needs, plus any colliders (they'd otherwise show as
    // missing-texture boxes).
    this.map.layers.forEach((layer) => layer.tilemapLayer?.setVisible(false));
    this.colliders
      ?.getChildren()
      .forEach((c) =>
        (c as unknown as Phaser.GameObjects.Components.Visible).setVisible?.(
          false,
        ),
      );
    this.cameras.main.setBackgroundColor("#63c74d");
    // pixelArt implies roundPixels, which shimmers against tweened sprites.
    this.cameras.main.roundPixels = false;

    // Nobody moves, so pin the camera on the patch — lifted so your own plot
    // sits clear of the water button at the bottom of the screen. BaseScene
    // bounds the camera to the (hidden) tilemap, which would clamp that lift
    // away, so drop the bounds first.
    this.cameras.main.stopFollow();
    this.cameras.main.removeBounds();
    this.cameras.main.centerOn(player.x, player.y - CAMERA_LIFT);

    if (!this.anims.exists("pop_burst_anim")) {
      this.anims.create({
        key: "pop_burst_anim",
        frames: this.anims.generateFrameNumbers("pop_burst"),
        frameRate: 14,
        repeat: 0,
      });
    }

    this.ensureWatering(player.clothing);

    this.me = {
      id: "me",
      name: "you",
      x: player.x,
      y: player.y,
      ...this.plantPlot(player.x, player.y),
      points: 0,
      pointsAtRoundStart: 0,
      waters: 0,
    };

    this.marker = this.add
      .image(player.x, player.y - 30, "pop_marker")
      .setDepth(Number.MAX_SAFE_INTEGER);

    // Desktop: SPACE waters too.
    this.input.keyboard?.on("keydown-SPACE", () => this.water());
  }

  // --- Plots ----------------------------------------------------------------

  /** Lay a soil patch + a seedling beside a grower. */
  private plantPlot(
    x: number,
    y: number,
  ): { soil: Phaser.GameObjects.Image; pumpkin: Phaser.GameObjects.Image } {
    const px = x + PLOT_OFFSET_X;
    const py = y + PLOT_OFFSET_Y;

    const soil = this.add.image(px, py, "pop_soil").setOrigin(0.5, 1);
    soil.setDepth(py - 1);

    // Origin at the base so the pumpkin swells upward out of the soil.
    const pumpkin = this.add
      .image(px, py, "pop_pumpkin_0")
      .setOrigin(0.5, 1)
      .setScale(SCALE_MIN);
    pumpkin.setDepth(py);

    return { soil, pumpkin };
  }

  /** Re-dress a pumpkin for its current water count. */
  private applyGrowth(g: Pick<Grower, "waters" | "pumpkin">) {
    const stage = STAGE_WATERS.reduce(
      (acc, need, i) => (g.waters >= need ? i : acc),
      0,
    );
    const key = `pop_pumpkin_${stage}`;
    if (g.pumpkin.texture.key !== key && this.textures.exists(key)) {
      g.pumpkin.setTexture(key);
    }

    const target = SCALE_MIN + g.waters * SCALE_PER_WATER;
    // A quick squash-and-settle on each water, so growth is felt, not just seen.
    this.tweens.killTweensOf(g.pumpkin);
    this.tweens.add({
      targets: g.pumpkin,
      scaleX: target,
      scaleY: target,
      duration: 140,
      ease: "Back.easeOut",
    });
  }

  /** Back to a fresh seedling for a new round. */
  private replant(g: Pick<Grower, "waters" | "pumpkin" | "soil">) {
    this.tweens.killTweensOf(g.pumpkin);
    g.pumpkin.setTexture("pop_pumpkin_0").setScale(SCALE_MIN).setAlpha(1);
    g.pumpkin.setVisible(true);
    g.soil.setVisible(true);
  }

  // --- Watering animation ---------------------------------------------------

  /** Build the pour animation for a loaded watering sheet. */
  private buildWateringAnim(key: string) {
    const animKey = `watering-anim-${key}`;
    if (
      this.anims.exists(animKey) ||
      !this.textures.exists(`watering-${key}`)
    ) {
      return;
    }
    this.anims.create({
      key: animKey,
      frames: this.anims.generateFrameNumbers(`watering-${key}`),
      frameRate: 14,
      // One pour per play — pour() fires it per tap, keepPouring() re-fires it
      // back-to-back for the neighbours.
      repeat: 0,
    });
  }

  /**
   * Make sure a grower's `watering` animation exists — building it straight
   * away if its sheet is already loaded (our own is, from preload — the
   * loader silently skips duplicate keys, so waiting on its `filecomplete`
   * would wait forever and the pour would never show). Otherwise mirrors
   * ChopScene's axe handling: queue the file, build the anim on completion,
   * then kick the loader.
   */
  private ensureWatering(clothing?: Player["clothing"]) {
    if (!clothing) return;
    const key = tokenUriBuilder(clothing as unknown as BumpkinParts);
    if (this.anims.exists(`watering-anim-${key}`)) return;

    if (this.textures.exists(`watering-${key}`)) {
      this.buildWateringAnim(key);
      return;
    }

    if (this.wateringLoading.has(key)) return;
    this.wateringLoading.add(key);
    this.load.spritesheet(
      `watering-${key}`,
      getAnimationUrl(clothing as unknown as BumpkinParts, ["watering"]),
      { frameWidth: 96, frameHeight: 64 },
    );
    this.load.once(`filecomplete-spritesheet-watering-${key}`, () =>
      this.buildWateringAnim(key),
    );
    this.load.start();
  }

  private wateringKeyFor(clothing?: Player["clothing"]): string | undefined {
    if (!clothing) return undefined;
    const key = `watering-anim-${tokenUriBuilder(clothing as unknown as BumpkinParts)}`;
    return this.anims.exists(key) ? key : undefined;
  }

  /**
   * Return a grower to their idle animation once a pour has finished playing.
   * Between taps the Bumpkin just idles — the watering animation only runs
   * while they're actually watering.
   */
  private settle(container?: BumpkinContainer) {
    const sprite = container?.sprite;
    const key = this.wateringKeyFor(container?.clothing);
    if (!sprite) return;

    // Mid-pour — let it finish.
    if (key && sprite.anims.isPlaying && sprite.anims.getName() === key) return;

    container?.idle();
  }

  /** One pour. Played fast so it always finishes before a mashed next tap. */
  private pour(container?: BumpkinContainer) {
    const sprite = container?.sprite;
    const key = this.wateringKeyFor(container?.clothing);
    if (!sprite || !key) return;

    sprite.anims.timeScale = 1.6;
    sprite.anims.play(key);
    sprite.anims.resume();
  }

  /**
   * Keep the watering animation running continuously — the neighbours just
   * water away for the whole round (only YOUR Bumpkin toggles between idle
   * and watering with your actual taps).
   */
  private keepPouring(container?: BumpkinContainer) {
    const sprite = container?.sprite;
    const key = this.wateringKeyFor(container?.clothing);
    if (!sprite || !key) return;

    // Re-fire the one-shot pour the moment it finishes — a seamless loop.
    if (sprite.anims.isPlaying && sprite.anims.getName() === key) return;
    sprite.anims.timeScale = 1;
    sprite.anims.play(key);
  }

  // --- The field ------------------------------------------------------------

  /** The next free plot around you. */
  private nextSpot(): { x: number; y: number } | undefined {
    const player = this.currentPlayer;
    const spot = GROWER_SPOTS[this.growers.size];
    if (!player || !spot) return undefined;
    return { x: player.x + spot.x, y: player.y + spot.y };
  }

  /**
   * Fill the patch out to a full field with simulated neighbours, once, when
   * round 1 opens (by which point we know who's really in the room).
   */
  private buildField() {
    if (this.fieldBuilt) return;
    this.fieldBuilt = true;

    const wanted = Math.min(
      GROWER_SPOTS.length - this.growers.size,
      POP_FIELD_SIZE - 1 - this.growers.size,
    );
    if (wanted <= 0) return;

    popBots(this.bridge?.giveawayId ?? "", wanted).forEach((bot, i) => {
      const spot = this.nextSpot();
      if (!spot) return;

      const clothing = NPC_WEARABLES[
        BOT_OUTFITS[i % BOT_OUTFITS.length]
      ] as unknown as Player["clothing"];

      try {
        const container = new BumpkinContainer({
          scene: this,
          x: spot.x,
          y: spot.y,
          clothing,
          name: bot.name,
        });
        container.setDepth(spot.y);
        container.faceRight();
        this.ensureWatering(clothing);

        this.growers.set(bot.id, {
          id: bot.id,
          name: bot.name,
          x: spot.x,
          y: spot.y,
          container,
          ...this.plantPlot(spot.x, spot.y),
          points: 0,
          pointsAtRoundStart: 0,
          waters: 0,
        });
      } catch {
        // A single failed Bumpkin shouldn't take the scene down.
      }
    });
  }

  /**
   * Real players in the room take a plot alongside the simulated neighbours.
   * Nobody moves in this game (everyone sits on their own spawn), so — as in
   * Log Chop — they're placed at a fixed spot rather than their broadcast
   * position; the broadcast is only read for their score.
   */
  updateOtherPlayers() {
    const server = this.mmoServer;
    const player = this.currentPlayer;
    if (!server || !player) return;

    // Drop anyone who left the room or is no longer in our giveaway.
    for (const [id, grower] of this.growers) {
      if (!id.startsWith("mmo-")) continue;
      const remote = server.state.players.get(id.slice(4));
      if (!remote || !inThisGiveaway(this, remote)) {
        grower.container?.destroy();
        grower.soil.destroy();
        grower.pumpkin.destroy();
        this.growers.delete(id);
      }
    }

    server.state.players.forEach((remote, sessionId) => {
      if (sessionId === server.sessionId) return;
      if (remote.farmId === this.bridge?.playerId) return;
      if (!inThisGiveaway(this, remote)) return;

      const id = `mmo-${sessionId}`;
      const existing = this.growers.get(id);
      if (existing) {
        existing.container?.changeClothing(remote.clothing);
        return;
      }

      const spot = this.nextSpot();
      if (!spot) return;

      const clothing = remote.clothing?.body
        ? remote.clothing
        : DEFAULT_CLOTHING;

      try {
        const container = new BumpkinContainer({
          scene: this,
          x: spot.x,
          y: spot.y,
          clothing,
          name: remote.username ?? `#${remote.farmId}`,
        });
        container.setDepth(spot.y);
        container.faceRight();
        this.ensureWatering(clothing);

        this.growers.set(id, {
          id,
          name: remote.username ?? `#${remote.farmId}`,
          x: spot.x,
          y: spot.y,
          container,
          ...this.plantPlot(spot.x, spot.y),
          points: remote.points ?? 0,
          pointsAtRoundStart: remote.points ?? 0,
          waters: 0,
        });
      } catch {
        // Ignore a single failed Bumpkin.
      }
    });
  }

  // --- Rounds ---------------------------------------------------------------

  /** The whole field, you first — the one list rounds are scored from. */
  private field(): Grower[] {
    const growers = this.me ? [this.me] : [];
    this.growers.forEach((g) => growers.push(g));
    return growers;
  }

  /**
   * Open a round: **snapshot everyone's running total**, replant, and re-roll
   * the simulated neighbours' paces. The snapshot is the whole scoring model —
   * from here on, a grower's round score is whatever their total has climbed
   * by, so the same subtraction judges you and everyone else.
   *
   * Everyone replants — a popped pumpkin is straight back in the next round.
   */
  private startRound(index: number) {
    this.buildField();

    const giveawayId = this.bridge?.giveawayId ?? "";
    this.field().forEach((g) => {
      // A real player's running total lives on the room; ours and the bots'
      // are kept on the grower itself.
      if (g.id.startsWith("mmo-")) {
        g.points =
          this.mmoServer?.state.players.get(g.id.slice(4))?.points ?? 0;
      }
      if (g.id.startsWith("bot-")) g.rate = botRate(giveawayId, g.id, index);

      g.pointsAtRoundStart = g.points;
      g.waters = 0;
      this.replant(g);

      // Anyone who popped last round reeled back and faded — bring them back.
      const container = g.id === "me" ? this.currentPlayer : g.container;
      container?.setAlpha(1);
    });
  }

  /**
   * Close a round: score everyone off the round-start snapshot, find the cap,
   * and pop everyone who hit it — the local player judged by exactly the same
   * numbers as the rest of the field. Nobody is knocked out: popping just
   * banks zero for the round, and survivors bank their waters.
   */
  private resolveRound(index: number) {
    const entries = roundScores(this.field());
    const { popped, cap, safeLine } = popVerdict(entries, index);

    const poppedSet = new Set(popped);
    const byId = new Map(entries.map((e) => [e.id, e.score]));

    // Biggest waterer first — the bursts then read as a countdown.
    const losers = popped
      .map((id) => ({ id, score: byId.get(id) ?? 0 }))
      .sort((a, b) => b.score - a.score);

    const victims: PopVictim[] = losers.map((e) => ({
      name: e.id === "me" ? "You" : (this.growers.get(e.id)?.name ?? e.id),
      waters: e.score,
      isSelf: e.id === "me",
    }));

    losers.forEach((e, order) =>
      this.time.delayedCall(order * 220, () => this.popGrower(e.id)),
    );

    // The whole scoring model: survive the round and its waters are banked,
    // pop and they're worth nothing. Nothing already banked is ever lost.
    const survived = !poppedSet.has("me");
    const myWaters = byId.get("me") ?? 0;
    if (survived) this.banked += myWaters;

    const controls = this.controls;
    if (controls) {
      controls.reveal = {
        round: index + 1,
        victims,
        survived,
        myWaters,
        banked: this.banked,
        cap,
        safeLine,
        nonce: (this.revealNonce += 1),
      };
    }
  }

  /**
   * Blow up a grower's pumpkin.
   *
   * Three beats, because an instant vanish reads as a bug rather than a
   * punishment: it **shudders** (you get a moment of "oh no, that's me"), it
   * **over-inflates**, then it **detonates** — shockwave ring, the crop's own
   * burst sheet, and a spray of pumpkin chunks arcing out under gravity onto
   * the soil. Their Bumpkin reels back and fades for the rest of the reveal —
   * they replant (and un-fade) when the next round opens.
   */
  private popGrower(id?: string) {
    const isSelf = id === "me";
    const plot = isSelf ? this.me : id ? this.growers.get(id) : undefined;
    if (!plot) return;

    const { pumpkin } = plot;
    const container = isSelf ? this.currentPlayer : plot.container;
    const x = pumpkin.x;
    const y = pumpkin.y - 6;
    const scale = pumpkin.scaleX;

    this.tweens.killTweensOf(pumpkin);

    // Beat 1 — the shudder. It knows it's about to go.
    this.tweens.add({
      targets: pumpkin,
      x: { from: x - 1.5, to: x + 1.5 },
      duration: 45,
      yoyo: true,
      repeat: 4,
      onComplete: () => pumpkin.setX(x),
    });

    // Beat 2 — over-inflate, squashing wider than it is tall as it swells.
    this.tweens.add({
      targets: pumpkin,
      scaleX: scale * 1.75,
      scaleY: scale * 1.45,
      delay: 260,
      duration: 150,
      ease: "Quad.easeIn",
      // Beat 3 — detonation.
      onComplete: () => {
        pumpkin.setVisible(false);
        this.detonate(x, y, scale);
        if (isSelf) this.cameras.main.shake(300, 0.009);
        else this.cameras.main.shake(120, 0.002);

        // Their Bumpkin reels back from the blast, then fades out of it.
        if (container) {
          container.idle();
          this.tweens.add({
            targets: container,
            x: container.x - 4,
            duration: 90,
            yoyo: true,
            ease: "Quad.easeOut",
          });
          this.tweens.add({
            targets: container,
            alpha: 0.45,
            duration: 500,
            delay: 250,
          });
        }

        this.floatText(x, y - 12, "POP!", 0xe43b44, 12);
      },
    });
  }

  /** The blast itself: shockwave, burst sheet, and a spray of pumpkin guts. */
  private detonate(x: number, y: number, scale: number) {
    // A shockwave ring punching outwards.
    const ring = this.add
      .circle(x, y, 5, undefined, 0)
      .setStrokeStyle(2, 0xffd12b, 0.9)
      .setDepth(1e6 + 1);
    this.tweens.add({
      targets: ring,
      scaleX: 5 * scale,
      scaleY: 5 * scale,
      alpha: 0,
      duration: 320,
      ease: "Cubic.easeOut",
      onComplete: () => ring.destroy(),
    });

    // A brief white flash at the core.
    const flash = this.add.circle(x, y, 7 * scale, 0xffffff, 0.9).setDepth(1e6);
    this.tweens.add({
      targets: flash,
      scaleX: 1.8,
      scaleY: 1.8,
      alpha: 0,
      duration: 160,
      ease: "Quad.easeOut",
      onComplete: () => flash.destroy(),
    });

    // The crop's own harvest "proc" sheet — it reads exactly like a pumpkin
    // coming apart, so the debris is on-model rather than generic particles.
    const burst = this.add
      .sprite(x, y, "pop_burst")
      .setScale(Math.max(1, scale))
      .setDepth(1e6 + 2);
    burst.play("pop_burst_anim");
    burst.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
      burst.destroy(),
    );

    // …plus chunks of rind flung out on ballistic arcs, landing on the soil.
    for (let i = 0; i < CHUNK_COUNT; i += 1) {
      const angle = -Math.PI + (Math.PI * i) / (CHUNK_COUNT - 1);
      const speed = Phaser.Math.Between(16, 36);
      const size = Phaser.Math.Between(1, 3);

      const chunk = this.add
        .rectangle(x, y, size, size, CHUNK_COLOURS[i % CHUNK_COLOURS.length], 1)
        .setDepth(1e6 + 3);

      // Out and up, then dragged back down past where it started.
      this.tweens.add({
        targets: chunk,
        x: x + Math.cos(angle) * speed * 1.4,
        duration: 620,
        ease: "Quad.easeOut",
      });
      this.tweens.chain({
        targets: chunk,
        tweens: [
          {
            y: y + Math.sin(angle) * speed,
            duration: 240,
            ease: "Quad.easeOut",
          },
          { y: y + 10, duration: 380, ease: "Quad.easeIn" },
        ],
      });
      this.tweens.add({
        targets: chunk,
        alpha: 0,
        angle: 180,
        delay: 340,
        duration: 280,
        onComplete: () => chunk.destroy(),
      });
    }
  }

  private floatText(
    x: number,
    y: number,
    text: string,
    tint: number,
    size: number,
  ) {
    // The bitmap font the rest of the world uses — stays crisp at any zoom.
    const label = this.add
      .bitmapText(x, y, "Teeny Tiny Pixls", text, size)
      .setTint(tint)
      .setOrigin(0.5)
      .setDepth(1e6 + 5);

    this.tweens.add({
      targets: label,
      y: label.y - 16,
      alpha: 0,
      duration: 900,
      ease: "Sine.easeOut",
      onComplete: () => label.destroy(),
    });
  }

  // --- Input ----------------------------------------------------------------

  /** One water: grow the pumpkin and play the pour. */
  private water() {
    const player = this.currentPlayer;
    const me = this.me;
    if (!player || !me || this.finished) return;
    if (this.bridge?.getPhase() !== "racing") return;
    if (this.phase !== "water") return;

    // Bump the running total; the round score is always the snapshot delta.
    me.points += 1;
    me.waters = me.points - me.pointsAtRoundStart;

    this.applyGrowth(me);
    this.pour(player);
  }

  // --- Frame ----------------------------------------------------------------

  updatePlayer() {
    const player = this.currentPlayer;
    if (!player?.body) return;

    // Nobody walks in this game.
    (player.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);

    const bridge = this.bridge;
    const now = serverNow();
    const elapsed = bridge ? now - bridge.getRaceStartAt() : 0;
    const over = isPopOver(elapsed);
    const racing = bridge?.getPhase() === "racing" && !over && !this.finished;
    const round = popRound(elapsed);
    this.phase = racing ? round.phase : "intro";

    if (
      racing &&
      round.phase === "water" &&
      round.index !== this.lastWaterRound
    ) {
      this.lastWaterRound = round.index;
      this.startRound(round.index);
    }

    if (
      racing &&
      round.phase === "reveal" &&
      round.index !== this.lastRevealRound
    ) {
      this.lastRevealRound = round.index;
      this.resolveRound(round.index);
    }

    // Drain taps from the water button (SPACE goes straight to water()).
    const controls = this.controls;
    if (controls) {
      const taps = controls.taps;
      controls.taps = 0;
      for (let i = 0; i < taps; i += 1) this.water();
    }

    this.updateGrowers(
      racing && round.phase === "water",
      POP_WATER_MS - round.msLeft,
    );
    this.settle(player);

    // Bob the "you" arrow off the clock (a tween would fight this reposition).
    this.marker?.setPosition(player.x, player.y - 32 + Math.sin(now / 250) * 2);

    // Publish the round state to the HUD (one clock, in the scene).
    if (controls) {
      controls.round = round.index + 1;
      controls.phase = this.phase;
      controls.msLeft = round.msLeft;
      controls.myWaters = this.me?.waters ?? 0;
      controls.banked = this.banked;
    }

    // Submit the final score once, when the clock is up. Note this is NOT what
    // we broadcast: the server ranks the banked total, the room only ever sees
    // the raw running total.
    const points = this.me?.points ?? 0;
    if (bridge && !this.finished && bridge.getPhase() === "racing" && over) {
      this.finished = true;
      bridge.onFinish(this.banked);
    }

    // Nobody moves, so instead of a position we broadcast our RUNNING WATER
    // TOTAL as `points`. Deliberately the raw cumulative number and nothing
    // else: every client snapshots it when a round opens and subtracts to get
    // that round's score, so anything else folded in here (a survival bonus,
    // say) would land inside somebody's round and read as a burst of watering.
    if (
      now - this.lastBroadcastAt > 150 &&
      points !== this.lastBroadcastPoints
    ) {
      this.lastBroadcastAt = now;
      this.lastBroadcastPoints = points;
      // Only on a change — onScoreChange is a React setState.
      this.bridge?.onScoreChange(points);
      this.mmoServer?.send(0, {
        x: player.x,
        y: player.y,
        points,
        giveawayId: this.bridge?.giveawayId,
      });
    }

    player.setDepth(Math.floor(player.y));
  }

  /**
   * Advance every neighbour's running total. A simulated grower's climbs at
   * their pace for the round; a real player's IS the total they broadcast. The
   * round score is the snapshot delta either way, and a jump in it plays the
   * pour — so watching a neighbour water and reading their round score are the
   * same number.
   */
  private updateGrowers(watering: boolean, roundElapsed: number) {
    this.growers.forEach((g) => {
      if (watering) {
        g.points = g.rate
          ? g.pointsAtRoundStart + botWaters(g.rate, roundElapsed)
          : (this.mmoServer?.state.players.get(g.id.slice(4))?.points ??
            g.points);
        const target = Math.max(0, g.points - g.pointsAtRoundStart);

        if (target > g.waters) {
          g.waters = target;
          this.applyGrowth(g);
        }

        // Neighbours water non-stop for the whole round; only the local
        // player's animation follows their actual taps.
        this.keepPouring(g.container);
      } else {
        this.settle(g.container);
      }
    });
  }
}
