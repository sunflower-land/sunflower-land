import mapJson from "assets/map/run.json";
import goldEggUrl from "assets/sfts/gold_egg.png";
import redEggUrl from "assets/sfts/easter/red_egg.png";
import { SUNNYSIDE } from "assets/sunnyside";
import type { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "features/world/scenes/BaseScene";
import type { GiveawayBridge } from "../lib/bridge";
import { isRaceOver } from "../lib/sim";
import { serverNow } from "../lib/serverClock";
import type { EggControls } from "../lib/eggControls";
import { renderRoomPlayers } from "./renderRoomPlayers";
import {
  eggSchedule,
  EGG_LANES,
  EGG_POINTS,
  type EggType,
  type FallingEgg,
} from "../lib/eggPatterns";

/** Scene key — referenced by the game config (see scenes/registry.ts). */
export const EGG_SCENE_ID = "giveaway_eggs";

// --- Playfield --------------------------------------------------------------
/** Horizontal spacing between egg columns (world px). */
const LANE_SPACING = 24;
/** How far eggs fall, top to catch line (world px). */
const FALL_HEIGHT = 150;
/** Catcher move speed (world px/second). */
const MOVE_SPEED = 95;
/** How close (px) your basket must be to an egg to catch it. */
const CATCH_RADIUS = 15;
/** Half the field width — the catcher is clamped to ± this from centre. */
const HALF_WIDTH = ((EGG_LANES - 1) / 2) * LANE_SPACING;

const EGG_TINT_TEXT: Record<EggType, { tint: number; sign: string }> = {
  normal: { tint: 0xffffff, sign: "+" },
  gold: { tint: 0xf2c14e, sign: "+" },
  red: { tint: 0xe43b44, sign: "" },
};

/**
 * Egg Catch.
 *
 * Move left/right to catch falling eggs: normal +1, gold +10, red bomb costs
 * you. The eggs are a pure function of the giveaway seed (see eggPatterns.ts),
 * so every player sees the exact same eggs fall over 30s — only who catches what
 * differs. Each player drives their own catcher and broadcasts position, so
 * everyone sees everyone else darting about; BaseScene renders the others.
 */
export class EggScene extends BaseScene {
  sceneId: SceneId = "giveaway_eggs";

  private fieldCenterX = 0;
  private catchLineY = 0;
  private topY = 0;

  private score = 0;
  private finished = false;
  // Throttle for the score/position broadcast.
  private lastBroadcastAt = 0;
  private lastBroadcastX = Number.NaN;
  private lastBroadcastScore = -1;

  private schedule: FallingEgg[] = [];
  /** Next egg in the (time-sorted) schedule not yet spawned. */
  private nextEgg = 0;
  /** Live egg sprites, keyed by egg id. */
  private eggs = new Map<number, Phaser.GameObjects.Image>();

  private leftKeys: Phaser.Input.Keyboard.Key[] = [];
  private rightKeys: Phaser.Input.Keyboard.Key[] = [];

  constructor() {
    super({
      name: "giveaway_eggs",
      map: { json: mapJson },
      audio: { fx: { walk_key: "dirt_footstep" } },
      // We drive the catcher ourselves (left/right only).
      controls: { enabled: false },
    });
  }

  private get bridge(): GiveawayBridge | undefined {
    return this.registry.get("giveawayBridge") as GiveawayBridge | undefined;
  }

  private get controls(): EggControls | undefined {
    return this.registry.get("gameControls") as EggControls | undefined;
  }

  preload() {
    super.preload();
    this.load.image("egg_normal", SUNNYSIDE.resource.egg);
    this.load.image("egg_gold", goldEggUrl);
    this.load.image("egg_red", redEggUrl);
  }

  async create() {
    super.create();

    const player = this.currentPlayer;
    if (!player) return;

    this.fieldCenterX = player.x;
    this.catchLineY = player.y;
    this.topY = this.catchLineY - FALL_HEIGHT;

    // A plain green field — hide the tilemap + any collision objects so they
    // don't show as missing-texture boxes (same approach as Log Chop).
    this.map.layers.forEach((layer) => layer.tilemapLayer?.setVisible(false));
    this.colliders
      ?.getChildren()
      .forEach((c) =>
        (c as unknown as Phaser.GameObjects.Components.Visible).setVisible?.(
          false,
        ),
      );
    this.cameras.main.setBackgroundColor("#63c74d");

    // Fixed camera centred on the play area — the catcher moves, the view
    // doesn't (BaseScene follows the player by default, so stop that).
    this.cameras.main.stopFollow();
    this.cameras.main.centerOn(
      this.fieldCenterX,
      this.catchLineY - FALL_HEIGHT / 2,
    );
    this.cameras.main.roundPixels = false;

    this.schedule = eggSchedule(this.bridge?.giveawayId ?? "");

    // Left = ←/A, Right = →/D. (controls are disabled, so add our own keys.)
    const kb = this.input.keyboard;
    this.leftKeys = [kb?.addKey("LEFT"), kb?.addKey("A")].filter(
      Boolean,
    ) as Phaser.Input.Keyboard.Key[];
    this.rightKeys = [kb?.addKey("RIGHT"), kb?.addKey("D")].filter(
      Boolean,
    ) as Phaser.Input.Keyboard.Key[];
  }

  /** Held direction from keys + the button HUD: -1 left, 0 none, 1 right. */
  private moveDirection(): number {
    const left = this.leftKeys.some((k) => k.isDown);
    const right = this.rightKeys.some((k) => k.isDown);
    const keyDir = (right ? 1 : 0) - (left ? 1 : 0);
    return keyDir !== 0 ? keyDir : (this.controls?.move ?? 0);
  }

  private laneX(lane: number): number {
    return this.fieldCenterX + (lane - (EGG_LANES - 1) / 2) * LANE_SPACING;
  }

  private spawnEgg(egg: FallingEgg) {
    const key =
      egg.type === "gold"
        ? "egg_gold"
        : egg.type === "red"
          ? "egg_red"
          : "egg_normal";

    const sprite = this.add
      .image(this.laneX(egg.lane), this.topY, key)
      .setDisplaySize(12, 14)
      .setDepth(this.catchLineY + 100);
    this.eggs.set(egg.id, sprite);
  }

  /** Resolve an egg that reached the catch line: score it if we're under it. */
  private resolveEgg(egg: FallingEgg, sprite: Phaser.GameObjects.Image) {
    const player = this.currentPlayer;
    const caught =
      !!player &&
      Math.abs(player.x - sprite.x) <= CATCH_RADIUS &&
      !this.finished;

    if (caught) {
      this.score = Math.max(0, this.score + EGG_POINTS[egg.type]);
      this.bridge?.onScoreChange(this.score);
      this.showCatch(egg.type, sprite.x);
    }

    sprite.destroy();
    this.eggs.delete(egg.id);
  }

  /** Floating "+1" / "+10" / "-5" where the egg was caught. */
  private showCatch(type: EggType, x: number) {
    const points = EGG_POINTS[type];
    const { tint, sign } = EGG_TINT_TEXT[type];

    const label = this.add
      .bitmapText(
        x,
        this.catchLineY - 20,
        "Teeny Tiny Pixls",
        `${sign}${points}`,
        type === "gold" ? 8 : 6,
      )
      .setTint(tint)
      .setOrigin(0.5)
      .setDepth(1e6);

    this.tweens.add({
      targets: label,
      y: label.y - 16,
      alpha: 0,
      duration: 700,
      ease: "Sine.easeOut",
      onComplete: () => label.destroy(),
    });
  }

  private clearEggs() {
    this.eggs.forEach((sprite) => sprite.destroy());
    this.eggs.clear();
  }

  /** Replaces BaseScene's input-driven movement — we only move left/right. */
  updatePlayer() {
    const player = this.currentPlayer;
    if (!player?.body) return;

    const body = player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);

    const bridge = this.bridge;
    const now = serverNow();
    const elapsed = bridge ? now - bridge.getRaceStartAt() : 0;
    const over = isRaceOver(elapsed);
    const racing = bridge?.getPhase() === "racing" && !over && !this.finished;

    // Move the catcher (kept level on the catch line, clamped to the field).
    const dir = racing ? this.moveDirection() : 0;
    if (dir !== 0) {
      const deltaMs = this.game.loop.delta;
      player.x = Phaser.Math.Clamp(
        player.x + dir * MOVE_SPEED * (deltaMs / 1000),
        this.fieldCenterX - HALF_WIDTH,
        this.fieldCenterX + HALF_WIDTH,
      );
      dir < 0 ? player.faceLeft() : player.faceRight();
      player.walk();
    } else {
      player.idle();
    }
    player.y = this.catchLineY;

    if (racing) {
      // Spawn any eggs that are now due.
      while (
        this.nextEgg < this.schedule.length &&
        this.schedule[this.nextEgg].spawnAt <= elapsed
      ) {
        this.spawnEgg(this.schedule[this.nextEgg]);
        this.nextEgg += 1;
      }

      // Fall + resolve live eggs.
      this.schedule.forEach((egg) => {
        const sprite = this.eggs.get(egg.id);
        if (!sprite) return;
        const p = (elapsed - egg.spawnAt) / egg.fallMs;
        sprite.y = this.topY + Math.min(1, p) * FALL_HEIGHT;
        if (p >= 1) this.resolveEgg(egg, sprite);
      });
    } else {
      // Lobby or finished — no eggs on screen.
      this.clearEggs();
    }

    // Submit the final score once, when the clock is up.
    if (bridge && !this.finished && bridge.getPhase() === "racing" && over) {
      this.finished = true;
      bridge.onFinish(this.score);
    }

    // Broadcast our X (so everyone sees us dart left/right) AND our score as the
    // Y coordinate, which is all the leaderboard reads. Remote catchers are drawn
    // on the catch line regardless (see updateOtherPlayers), so the score-as-Y
    // never actually moves them.
    if (
      now - this.lastBroadcastAt > 90 &&
      (player.x !== this.lastBroadcastX ||
        this.score !== this.lastBroadcastScore)
    ) {
      this.lastBroadcastAt = now;
      this.lastBroadcastX = player.x;
      this.lastBroadcastScore = this.score;
      this.mmoServer?.send(0, {
        x: player.x,
        y: this.score,
        points: this.score,
        giveawayId: this.bridge?.giveawayId,
      });
    }

    this.soundEffects?.forEach((audio) =>
      audio.setVolumeAndPan(player.x, player.y),
    );
    this.walkAudioController?.handleWalkSound(dir !== 0);

    player.setDepth(Math.floor(player.y));
  }

  /** Draw other catchers on the catch line; their broadcast Y is score, not height. */
  updateOtherPlayers() {
    renderRoomPlayers(this, { pinY: this.catchLineY });
  }
}
