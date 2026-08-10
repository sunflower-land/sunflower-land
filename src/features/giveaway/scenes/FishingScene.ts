import mapJson from "assets/map/run.json";
import type { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "features/world/scenes/BaseScene";
import type { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import type { Player } from "features/world/types/Room";
import { getAnimationUrl } from "features/world/lib/animations";
import { tokenUriBuilder, type BumpkinParts } from "lib/utils/tokenUriBuilder";
import type { GiveawayBridge } from "../lib/bridge";
import { isRaceOver } from "../lib/sim";
import { serverNow } from "../lib/serverClock";
import type { FishingControls } from "../lib/fishingControls";
import {
  fishSchedule,
  fishProgress,
  fishXFraction,
  FISH_POOL,
  type StreamFish,
} from "../lib/fishing";
import { DEFAULT_CLOTHING, inThisGiveaway } from "./renderRoomPlayers";

/** Scene key — referenced by the game config (see scenes/registry.ts). */
export const FISHING_SCENE_ID = "giveaway_fishing";

// --- Layout -----------------------------------------------------------------
/** The fish swim in a thin river band (world px). */
const RIVER_HEIGHT = 32;
/** Where the lure lands relative to the angler — the cast throws it to the
 *  bottom-right, and the thin river sits directly under that point. */
const LURE_DX = 20;
const LURE_DY = 30;
/** Horizontal gap between neighbouring anglers on the bank (world px). */
const ANGLER_SPACING = 32;
/** Fish enter/leave this far off the visible edge, so they slide in/out. */
const FISH_MARGIN = 34;
/** On-screen size of a fish icon. */
const FISH_SIZE = 16;

// --- Cast mechanic ----------------------------------------------------------
/** When (ms into the cast) the lure hits the water — the catch is judged here. */
const LURE_LAND_MS = 500;
/** Total cast+reel time before you can cast again — you have to wait out the
 *  reel (shown by the progress bar under the angler), so you can't just spam. */
const CAST_TOTAL_MS = 2800;
/** How close (world px) a fish must be to where the lure lands to be caught. */
const CATCH_RADIUS = 20;
/** Width of the reel progress bar under the angler (world px). */
const CAST_BAR_W = 22;

// --- Remote liveliness ------------------------------------------------------
const REMOTE_CAST_MIN_MS = 1800;
const REMOTE_CAST_MAX_MS = 4200;

/**
 * Fishing Frenzy.
 *
 * Everyone sits along the bank of a thin horizontal river (each angler at their
 * own seeded spot). Fish of every kind drift across the stream at different
 * speeds; tap SPACE (or the cast button) to fling your lure to the water just
 * in front of you. When the lure lands it catches the most valuable fish within
 * a small radius of the splash — bigger, faster, rarer fish pay out more — then
 * the rod reels back in. You can't cast again until the reel finishes, so it's a
 * timing game: cast as a fish drifts through your spot. Most XP in 30s wins.
 *
 * Fish are a pure function of the giveaway seed (see fishing.ts) so everyone
 * sees the same stream; only who hooks what differs. We broadcast our bank X (so
 * others see us on the bank) and our SCORE as Y (all the leaderboard reads).
 */
export class FishingScene extends BaseScene {
  sceneId: SceneId = "giveaway_fishing";

  private score = 0;
  private finished = false;

  // River geometry (world space), set in create().
  private fieldCenterX = 0;
  private bankY = 0;
  private riverLeft = 0;
  private riverRight = 0;
  private riverTop = 0;
  private riverCenterY = 0;

  private schedule: StreamFish[] = [];
  /** The schedule keyed by fish id (ids don't match array order after sorting). */
  private fishById = new Map<number, StreamFish>();
  /** Live fish sprites, keyed by fish id. */
  private fish = new Map<number, Phaser.GameObjects.Image>();
  /** Fish already hooked this game — never respawn or re-catch them. */
  private caught = new Set<number>();

  // Cast cycle: cast → lure lands (catch judged) → reel-in → ready again. You
  // can't cast again until the reel finishes (no spamming).
  private casting = false;
  private castElapsed = 0;
  private catchDone = false;
  /** A little progress bar under the angler that fills as the line reels in —
   * you can cast again once it's full. */
  private castBarBg?: Phaser.GameObjects.Rectangle;
  private castBarFill?: Phaser.GameObjects.Rectangle;

  // Broadcast throttle.
  private lastBroadcastAt = 0;
  private lastBroadcastScore = -1;
  private lastHeartbeatAt = 0;
  private resultNonce = 0;

  /** Other anglers on the bank, keyed by MMO session id. Each holds a stable
   * `slot` (0-based) so they keep their spot as others come and go. */
  private anglers = new Map<
    string,
    { container: BumpkinContainer; nextCastAt: number; slot: number }
  >();
  /** Slots currently taken, so a new joiner fills the nearest free one. */
  private usedSlots = new Set<number>();

  /** `${action}:${outfitKey}` whose animation sheet is loaded / in-flight. */
  private animLoading = new Set<string>();

  constructor() {
    super({
      name: "giveaway_fishing",
      map: { json: mapJson },
      audio: { fx: { walk_key: "dirt_footstep" } },
      // We drive the angler with cast presses, not the movement keys.
      controls: { enabled: false },
    });
  }

  private get bridge(): GiveawayBridge | undefined {
    return this.registry.get("giveawayBridge") as GiveawayBridge | undefined;
  }

  private get controls(): FishingControls | undefined {
    return this.registry.get("gameControls") as FishingControls | undefined;
  }

  preload() {
    super.preload();

    // Every fish icon (their real item images), keyed by species.
    FISH_POOL.forEach((f) => this.load.image(`fish-${f.name}`, f.image));

    // The local player's cast + reel sheets up front (remotes load on demand).
    const clothing = this.gameState?.bumpkin?.equipped as
      | BumpkinParts
      | undefined;
    if (clothing) {
      const key = tokenUriBuilder(clothing);
      (["casting", "reeling"] as const).forEach((action) => {
        this.load.spritesheet(
          `${action}-${key}`,
          getAnimationUrl(clothing, [action]),
          { frameWidth: 96, frameHeight: 64 },
        );
      });
    }
  }

  async create() {
    super.create();

    const player = this.currentPlayer;
    if (!player) return;

    const worldW = this.scale.width / this.zoom;

    this.fieldCenterX = player.x;
    this.bankY = player.y;
    this.riverLeft = this.fieldCenterX - worldW / 2;
    this.riverRight = this.fieldCenterX + worldW / 2;
    // The thin river sits directly under where the lure lands.
    this.riverCenterY = this.bankY + LURE_DY;
    this.riverTop = this.riverCenterY - RIVER_HEIGHT / 2;

    // Plain scenery — hide the tilemap + colliders (same as the other games).
    this.map.layers.forEach((layer) => layer.tilemapLayer?.setVisible(false));
    this.colliders
      ?.getChildren()
      .forEach((c) =>
        (c as unknown as Phaser.GameObjects.Components.Visible).setVisible?.(
          false,
        ),
      );
    this.cameras.main.setBackgroundColor("#5b8a3c");

    // The river: a blue band across the whole visible width.
    this.add
      .rectangle(
        this.fieldCenterX,
        this.riverCenterY,
        worldW,
        RIVER_HEIGHT,
        0x2f6d9e,
        1,
      )
      .setDepth(0);
    this.add
      .rectangle(this.fieldCenterX, this.riverTop, worldW, 3, 0x9fd0e8, 0.7)
      .setDepth(1);

    // Fixed camera — anglers sit still, fish drift, the view doesn't move.
    this.cameras.main.stopFollow();
    this.cameras.main.centerOn(this.fieldCenterX, this.bankY + 20);
    this.cameras.main.roundPixels = false;

    // The local angler always sits dead centre on the bank; everyone else fans
    // out to either side of them (see updateOtherPlayers).
    player.teleport(this.fieldCenterX, this.bankY);
    player.faceRight();

    this.buildAnim(player.clothing, "casting");
    this.buildAnim(player.clothing, "reeling");

    this.schedule = fishSchedule(this.bridge?.giveawayId ?? "");
    this.schedule.forEach((f) => this.fishById.set(f.id, f));

    // The reel progress bar under the angler (hidden until casting).
    this.castBarBg = this.add
      .rectangle(0, 0, CAST_BAR_W + 2, 5, 0x000000, 0.6)
      .setDepth(1e6)
      .setVisible(false);
    this.castBarFill = this.add
      .rectangle(0, 0, CAST_BAR_W, 3, 0x63c74d, 1)
      .setOrigin(0, 0.5)
      .setDepth(1e6 + 1)
      .setVisible(false);

    // Cast: SPACE from the keyboard, or the button via the queue.
    this.input.keyboard?.on("keydown-SPACE", () => this.cast());
  }

  /** Fill the reel bar under the angler as the cast runs; hide it when idle. */
  private updateCastBar(player: BumpkinContainer) {
    const bg = this.castBarBg;
    const fill = this.castBarFill;
    if (!bg || !fill) return;

    if (!this.casting) {
      bg.setVisible(false);
      fill.setVisible(false);
      return;
    }

    const progress = Phaser.Math.Clamp(this.castElapsed / CAST_TOTAL_MS, 0, 1);
    const barY = player.y + 14;
    bg.setPosition(player.x, barY).setVisible(true).setDepth(1e6);
    fill
      .setPosition(player.x - CAST_BAR_W / 2, barY)
      .setSize(CAST_BAR_W * progress, 3)
      .setVisible(true)
      .setDepth(1e6 + 1);
  }

  /**
   * Bank X for the `i`-th other angler (0-based), fanning out from the centre:
   * +buffer, −buffer, +2·buffer, −2·buffer, … so they line the top of the river
   * on either side of the centred local player, evenly spaced.
   */
  private anglerSlotX(i: number): number {
    const step = Math.floor(i / 2) + 1;
    const side = i % 2 === 0 ? 1 : -1;
    return this.fieldCenterX + side * step * ANGLER_SPACING;
  }

  // --- Fishing animations (loaded on demand, like Chop's axe) ---------------

  /** Build an animation from an already-loaded sheet. */
  private buildAnim(clothing: Player["clothing"] | undefined, action: string) {
    if (!clothing) return;
    const key = tokenUriBuilder(clothing as unknown as BumpkinParts);
    const animKey = `${action}-anim-${key}`;
    if (
      this.anims.exists(animKey) ||
      !this.textures.exists(`${action}-${key}`)
    ) {
      return;
    }
    this.anims.create({
      key: animKey,
      frames: this.anims.generateFrameNumbers(`${action}-${key}`),
      frameRate: 14,
      repeat: 0,
    });
  }

  /** Load a player's animation sheet on the fly + build its animation. */
  private ensureAnim(clothing: Player["clothing"] | undefined, action: string) {
    if (!clothing) return;
    const key = tokenUriBuilder(clothing as unknown as BumpkinParts);
    const loadKey = `${action}:${key}`;
    const animKey = `${action}-anim-${key}`;
    if (this.anims.exists(animKey) || this.animLoading.has(loadKey)) return;

    this.animLoading.add(loadKey);
    this.load.spritesheet(
      `${action}-${key}`,
      getAnimationUrl(clothing as unknown as BumpkinParts, [
        action as "casting" | "reeling",
      ]),
      { frameWidth: 96, frameHeight: 64 },
    );
    this.load.once(`filecomplete-spritesheet-${action}-${key}`, () =>
      this.buildAnim(clothing, action),
    );
    this.load.start();
  }

  private animKeyFor(
    clothing: Player["clothing"] | undefined,
    action: string,
  ): string | undefined {
    if (!clothing) return undefined;
    const key = `${action}-anim-${tokenUriBuilder(clothing as unknown as BumpkinParts)}`;
    return this.anims.exists(key) ? key : undefined;
  }

  /** Hold the casting animation on frame 0 — the rod-ready pose between casts. */
  private restPose(container: BumpkinContainer) {
    const sprite = container.sprite;
    const key = this.animKeyFor(container.clothing, "casting");
    if (!sprite || !key) return;

    // Mid-animation — let it play out.
    if (sprite.anims.isPlaying) return;

    const frames = this.anims.get(key)?.frames;
    if (!frames?.length) return;

    if (sprite.anims.getName() !== key) sprite.anims.play(key);
    sprite.anims.pause(frames[0]);
  }

  /** Play a fishing animation (casting / reeling) on a Bumpkin. */
  private playAnim(container: BumpkinContainer, action: string) {
    const sprite = container.sprite;
    const key = this.animKeyFor(container.clothing, action);
    if (!sprite || !key) return;
    sprite.anims.play(key);
    sprite.anims.resume();
  }

  // --- The cast --------------------------------------------------------------

  /** Where the lure lands — bottom-right of the angler, in the thin river. */
  private lurePoint(): { x: number; y: number } {
    const p = this.currentPlayer;
    return { x: (p?.x ?? 0) + LURE_DX, y: this.riverCenterY };
  }

  private cast() {
    const player = this.currentPlayer;
    if (!player || this.casting || this.finished) return;
    if (this.bridge?.getPhase() !== "racing") return;

    this.casting = true;
    this.castElapsed = 0;
    this.catchDone = false;

    this.playAnim(player, "casting");
    if (this.controls) this.controls.casting = true;
  }

  /**
   * The lure has hit the water — catch EVERY fish within the catch radius of
   * where it landed (timing your cast so several drift in at once is the whole
   * game), then start reeling in. Each caught fish is marked so it's pulled from
   * the stream and can't be double-caught.
   */
  private resolveCatch(elapsed: number) {
    const player = this.currentPlayer;
    if (!player) return;

    const lp = this.lurePoint();
    this.showSplash(lp.x, lp.y);

    let count = 0;
    let gained = 0;
    for (const f of this.schedule) {
      if (this.caught.has(f.id)) continue;
      const p = fishProgress(f, elapsed);
      if (p < 0 || p > 1) continue;
      const x = this.fishWorldX(f, elapsed);
      const y = this.fishWorldY(f);
      if (Phaser.Math.Distance.Between(x, y, lp.x, lp.y) > CATCH_RADIUS)
        continue;

      this.caught.add(f.id);
      gained += f.xp;
      count += 1;
      this.reelInFish(f.id);
    }

    if (count > 0) {
      this.score += gained;
      this.bridge?.onScoreChange(this.score);
    }

    // Reel the rod back in — you can't cast again until it's done.
    this.playAnim(player, "reeling");

    this.showResult(count, gained);
    if (this.controls) {
      this.controls.lastResult = {
        count,
        xp: gained,
        nonce: (this.resultNonce += 1),
      };
    }
  }

  /** Yank the caught fish out of the stream and up to the angler. */
  private reelInFish(id: number) {
    const player = this.currentPlayer;
    const sprite = this.fish.get(id);
    if (!sprite || !player) return;

    // Take it out of the normal stream update so we drive it ourselves.
    this.fish.delete(id);
    sprite.setDepth(1e6 + 2);

    this.tweens.add({
      targets: sprite,
      x: player.x,
      y: player.y - 8,
      scale: 0.4,
      duration: CAST_TOTAL_MS - LURE_LAND_MS,
      ease: "Quad.easeIn",
      onComplete: () => sprite.destroy(),
    });
  }

  /** A splash ring at the landing point — shows where (and how big) the catch
   * area is when the lure hits the water. */
  private showSplash(x: number, y: number) {
    const ring = this.add
      .circle(x, y, CATCH_RADIUS, 0x000000, 0)
      .setStrokeStyle(2, 0xffffff, 0.9)
      .setDepth(1e6)
      .setScale(0.4);

    this.tweens.add({
      targets: ring,
      scale: 1.1,
      alpha: 0,
      duration: 450,
      ease: "Quad.easeOut",
      onComplete: () => ring.destroy(),
    });
  }

  /** End the cast cycle — ready to cast again. */
  private finishCast() {
    this.casting = false;
    this.castElapsed = 0;
    if (this.controls) this.controls.casting = false;
  }

  /** Floating "+380 x3!" / "+120!" / "Miss" above the player. */
  private showResult(count: number, xp: number) {
    const player = this.currentPlayer;
    if (!player) return;

    const text =
      count === 0 ? "Miss" : count === 1 ? `+${xp}!` : `+${xp} x${count}!`;
    const label = this.add
      .bitmapText(
        player.x,
        player.y - 26,
        "Teeny Tiny Pixls",
        text,
        count >= 2 ? 10 : count === 1 ? 8 : 6,
      )
      .setTint(count > 0 ? 0x63c74d : 0xe43b44)
      .setOrigin(0.5)
      .setDepth(1e6 + 5);

    this.tweens.add({
      targets: label,
      y: label.y - 18,
      alpha: 0,
      duration: 900,
      ease: "Sine.easeOut",
      onComplete: () => label.destroy(),
    });
  }

  // --- Fish positioning ------------------------------------------------------

  /** A fish's world X at `elapsed` (slides in/out past the visible edges). */
  private fishWorldX(fish: StreamFish, elapsed: number): number {
    const frac = fishXFraction(fish, elapsed);
    const left = this.riverLeft - FISH_MARGIN;
    const span = this.riverRight - this.riverLeft + FISH_MARGIN * 2;
    return left + frac * span;
  }

  private fishWorldY(fish: StreamFish): number {
    return this.riverTop + fish.lane * RIVER_HEIGHT;
  }

  /** Spawn / move / despawn fish sprites for the current moment. */
  private updateFish(elapsed: number, racing: boolean) {
    if (!racing) {
      this.fish.forEach((sprite) => sprite.destroy());
      this.fish.clear();
      return;
    }

    // Despawn any live fish that have drifted off (or been caught).
    for (const [id, sprite] of this.fish) {
      const f = this.fishById.get(id);
      const p = f ? fishProgress(f, elapsed) : 2;
      if (this.caught.has(id) || !f || p < 0 || p > 1) {
        sprite.destroy();
        this.fish.delete(id);
      }
    }

    // Spawn / move fish that are on-screen now (a caught fish is pulled from the
    // map and reeled in separately, so it's skipped here).
    for (const f of this.schedule) {
      if (this.caught.has(f.id)) continue;

      const p = fishProgress(f, elapsed);
      if (p < 0 || p > 1) continue;

      let sprite = this.fish.get(f.id);
      if (!sprite) {
        sprite = this.add
          .image(0, 0, `fish-${f.name}`)
          .setDisplaySize(FISH_SIZE, FISH_SIZE);
        this.fish.set(f.id, sprite);
      }
      const x = this.fishWorldX(f, elapsed);
      const y = this.fishWorldY(f);
      sprite.setPosition(x, y);
      // Point the fish the way it's swimming, with a gentle bob.
      sprite.setFlipX(!f.fromLeft);
      sprite.y += Math.sin((elapsed + f.id * 400) / 260) * 1.5;
      sprite.setDepth(y);
    }
  }

  // --- Loop ------------------------------------------------------------------

  updatePlayer() {
    const player = this.currentPlayer;
    if (!player?.body) return;

    (player.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);

    const bridge = this.bridge;
    const now = serverNow();
    const elapsed = bridge ? now - bridge.getRaceStartAt() : 0;
    const over = isRaceOver(elapsed);
    const racing = bridge?.getPhase() === "racing" && !over && !this.finished;

    // Advance the cast cycle: cast → (lure lands, catch judged) → reel → ready.
    if (this.casting) {
      this.castElapsed += this.game.loop.delta;
      if (!this.catchDone && this.castElapsed >= LURE_LAND_MS) {
        this.catchDone = true;
        this.resolveCatch(elapsed);
      }
      if (this.castElapsed >= CAST_TOTAL_MS) this.finishCast();
    }

    // Drain a queued cast from the button HUD (cast() guards on state / phase).
    const controls = this.controls;
    if (controls && controls.casts > 0) {
      controls.casts = 0;
      this.cast();
    }

    // Rod-ready pose between casts (BumpkinContainer would otherwise idle it).
    if (!this.casting) this.restPose(player);

    // Fill the reel bar while a cast is in flight.
    this.updateCastBar(player);

    this.updateFish(elapsed, racing);

    // Submit the final score once, when the clock is up.
    if (bridge && !this.finished && bridge.getPhase() === "racing" && over) {
      this.finished = true;
      bridge.onFinish(this.score);
    }

    // Broadcast our SCORE as Y (all the leaderboard reads). X is unused for
    // placement now (anglers sit in fixed slots), but the heartbeat keeps us
    // present in the room even before we've caught anything.
    const scoreChanged = this.score !== this.lastBroadcastScore;
    const heartbeat = now - this.lastHeartbeatAt > 800;
    if (now - this.lastBroadcastAt > 150 && (scoreChanged || heartbeat)) {
      this.lastBroadcastAt = now;
      if (heartbeat) this.lastHeartbeatAt = now;
      this.lastBroadcastScore = this.score;
      this.mmoServer?.send(0, {
        x: player.x,
        y: this.score,
        points: this.score,
        giveawayId: this.bridge?.giveawayId,
      });
    }

    player.setDepth(Math.floor(player.y));
  }

  /**
   * Line the other anglers up along the top of the river, fanning out to either
   * side of the centred local player in fixed, evenly-spaced slots (each keeps
   * its slot as others come and go). Placement is cosmetic — their score comes
   * from what they broadcast (Y), not where they stand.
   */
  updateOtherPlayers() {
    const server = this.mmoServer;
    if (!server) return;

    const now = serverNow();
    const racing = this.bridge?.getPhase() === "racing" && !this.finished;

    for (const [sessionId, angler] of this.anglers) {
      const remote = server.state.players.get(sessionId);
      if (!remote || !inThisGiveaway(this, remote)) {
        angler.container.destroy();
        this.usedSlots.delete(angler.slot);
        this.anglers.delete(sessionId);
      }
    }

    server.state.players.forEach((remote, sessionId) => {
      if (sessionId === server.sessionId) return;
      if (!inThisGiveaway(this, remote)) return;

      let entry = this.anglers.get(sessionId);
      if (!entry) {
        try {
          // Take the nearest free slot to the centre.
          let slot = 0;
          while (this.usedSlots.has(slot)) slot += 1;
          this.usedSlots.add(slot);

          // Use createPlayer so anglers get the standard username tag below the
          // Bumpkin (like everywhere else), not a custom floating label.
          const container = this.createPlayer({
            x: this.anglerSlotX(slot),
            y: this.bankY,
            farmId: remote.farmId,
            username: remote.username,
            faction: remote.faction,
            clothing: remote.clothing?.body
              ? remote.clothing
              : DEFAULT_CLOTHING,
            isCurrentPlayer: false,
            npc: remote.npc,
            experience: remote.experience,
          });
          container.setDepth(this.bankY);
          container.faceRight();
          // Remotes only need the casting sheet for their rod pose + cadence.
          this.ensureAnim(remote.clothing, "casting");
          entry = {
            container,
            slot,
            nextCastAt:
              now + REMOTE_CAST_MIN_MS + Math.random() * REMOTE_CAST_MAX_MS,
          };
          this.anglers.set(sessionId, entry);
        } catch {
          return;
        }
      }

      // Keep them planted at their slot on the bank line.
      const { container } = entry;
      container.x = this.anglerSlotX(entry.slot);
      container.y = this.bankY;
      container.setDepth(this.bankY);

      // Cast now and then so the bank looks alive.
      if (racing && now >= entry.nextCastAt) {
        entry.nextCastAt =
          now + REMOTE_CAST_MIN_MS + Math.random() * REMOTE_CAST_MAX_MS;
        this.playAnim(container, "casting");
      } else {
        this.restPose(container);
      }
    });
  }
}
