import mapJson from "assets/map/run.json";
import type { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "features/world/scenes/BaseScene";
import type { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import type { Player } from "features/world/types/Room";
import { getAnimationUrl } from "features/world/lib/animations";
import { tokenUriBuilder, type BumpkinParts } from "lib/utils/tokenUriBuilder";
import type { GiveawayBridge } from "../lib/bridge";
import { serverNow } from "../lib/serverClock";
import type { TriviaControls } from "../lib/triviaControls";
import {
  triviaRound,
  questionForRound,
  speedPoints,
  isTriviaOver,
  TRIVIA_ROUND_MS,
  TRIVIA_INTRO_MS,
  type TriviaPhase,
} from "../lib/trivia";
import { DEFAULT_CLOTHING } from "./renderRoomPlayers";

/** Scene key — referenced by the game config (see scenes/registry.ts). */
export const TRIVIA_SCENE_ID = "giveaway_trivia";

/**
 * Answer index → its quadrant (matches the 2×2 button grid on screen):
 *   0 = top-left, 1 = top-right, 2 = bottom-left, 3 = bottom-right.
 */
const QUADRANT = [
  { sx: -1, sy: -1 },
  { sx: 1, sy: -1 },
  { sx: -1, sy: 1 },
  { sx: 1, sy: 1 },
];

/**
 * Trivia.
 *
 * A question appears; tap one of four quadrants and your Bumpkin pops into that
 * quadrant, so everyone can see what everyone's picking in real time. You keep
 * your pick between questions and can change it until the 10s is up, then a 3s
 * reveal cheers the right answerers and topples the wrong ones — faster correct
 * answers score more (Kahoot-style).
 *
 * Networking: we broadcast the ANSWER INDEX as X (0-3, or -1 for none) so remote
 * Bumpkins can be placed in the right quadrant, and our accumulating SCORE as Y,
 * which is all the leaderboard reads.
 */
export class TriviaScene extends BaseScene {
  sceneId: SceneId = "giveaway_trivia";

  private score = 0;
  private finished = false;
  /** Centre of the 2×2 grid, and the quadrant offsets (world px). */
  private centerX = 0;
  private centerY = 0;
  private quadDx = 60;
  private quadDy = 48;
  /** The answer we've moved to (also broadcast as X for remote placement). */
  private currentAnswer: number | null = null;
  /** How far into this round's answer window we locked our answer (ms). */
  private answerAtMs = 0;
  private phase: TriviaPhase = "intro";
  private lastGradedRound = -1;
  private lastResetRound = -1;
  private resultNonce = 0;
  // Broadcast throttle.
  private lastBroadcastAt = 0;
  private lastBroadcastAnswer = Number.NaN;
  private lastBroadcastScore = -1;
  // TEMP diagnostic throttle.
  private lastLogAt = 0;

  /** Other players, keyed by session, with a stable in-quadrant offset. */
  private others = new Map<
    string,
    { container: BumpkinContainer; ox: number; oy: number }
  >();

  /** Outfit keys whose `death` sheet is loaded / in-flight (avoids re-loading). */
  private deathLoading = new Set<string>();

  constructor() {
    super({
      name: "giveaway_trivia",
      map: { json: mapJson },
      audio: { fx: { walk_key: "dirt_footstep" } },
      controls: { enabled: false },
    });
  }

  private get bridge(): GiveawayBridge | undefined {
    return this.registry.get("giveawayBridge") as GiveawayBridge | undefined;
  }

  private get controls(): TriviaControls | undefined {
    return this.registry.get("gameControls") as TriviaControls | undefined;
  }

  async create() {
    super.create();

    const player = this.currentPlayer;
    if (!player) return;

    this.centerX = player.x;
    this.centerY = player.y;
    // Put the quadrant centres at roughly the four screen quarters (the 2×2
    // grid overlay lines up with them), adapting to the viewport.
    this.quadDx = (this.scale.width / this.zoom) * 0.24;
    this.quadDy = (this.scale.height / this.zoom) * 0.22;

    // A plain field — hide the tilemap + colliders (same as the other games).
    this.map.layers.forEach((layer) => layer.tilemapLayer?.setVisible(false));
    this.colliders
      ?.getChildren()
      .forEach((c) =>
        (c as unknown as Phaser.GameObjects.Components.Visible).setVisible?.(
          false,
        ),
      );
    this.cameras.main.setBackgroundColor("#4a6fa5");

    // Fixed camera centred on the grid — players move between quadrants, not it.
    this.cameras.main.stopFollow();
    this.cameras.main.centerOn(this.centerX, this.centerY);
    this.cameras.main.roundPixels = false;

    // Preload our own death sheet so the reveal plays instantly.
    this.ensureDeath(player.clothing);

    // Desktop: keys 1-4 pick a quadrant, same as tapping it.
    (["ONE", "TWO", "THREE", "FOUR"] as const).forEach((key, index) => {
      this.input.keyboard?.on(`keydown-${key}`, () => this.applyPick(index));
    });
  }

  /** Centre of answer quadrant `i` (0-3). */
  private quadCenter(i: number): { x: number; y: number } {
    const q = QUADRANT[i] ?? QUADRANT[0];
    return {
      x: this.centerX + q.sx * this.quadDx,
      y: this.centerY + q.sy * this.quadDy,
    };
  }

  /** A random spot inside answer quadrant `i`. */
  private randomSpot(i: number): { x: number; y: number } {
    const c = this.quadCenter(i);
    return {
      x: c.x + Phaser.Math.Between(-this.quadDx * 0.45, this.quadDx * 0.45),
      y: c.y + Phaser.Math.Between(-this.quadDy * 0.45, this.quadDy * 0.45),
    };
  }

  /** Decode a broadcast X back into an answer index (or null for "none"). */
  private answerFromBroadcast(x: number): number | null {
    if (x < 0) return null;
    return Phaser.Math.Clamp(Math.round(x), 0, 3);
  }

  /** Move into an answer's quadrant (during the answer window only). */
  private applyPick(answer: number) {
    const player = this.currentPlayer;
    if (!player || this.phase !== "answer" || this.finished) return;
    if (answer === this.currentAnswer) return;

    // Record how quickly we locked this in (for speed-based points).
    const bridge = this.bridge;
    if (bridge) {
      const t = serverNow() - bridge.getRaceStartAt() - TRIVIA_INTRO_MS;
      this.answerAtMs =
        ((t % TRIVIA_ROUND_MS) + TRIVIA_ROUND_MS) % TRIVIA_ROUND_MS;
    }

    this.currentAnswer = answer;
    if (this.controls) this.controls.picked = answer;

    const spot = this.randomSpot(answer);
    this.tweens.killTweensOf(player);
    this.tweens.add({
      targets: player,
      x: spot.x,
      y: spot.y,
      duration: 250,
      ease: "Quad.easeOut",
    });
  }

  /** Cheer the right answerers, topple the wrong ones, and score the local one. */
  private gradeRound(index: number) {
    const bridge = this.bridge;
    const correct = questionForRound(bridge?.giveawayId ?? "", index).correct;

    const player = this.currentPlayer;
    if (player) {
      const gotIt =
        this.currentAnswer !== null && this.currentAnswer === correct;
      let points = 0;
      if (gotIt) {
        points = speedPoints(this.answerAtMs);
        this.score += points;
        player.cheer();
        bridge?.onScoreChange(this.score);
      } else {
        this.showDeath(player);
      }
      if (this.controls) {
        this.controls.lastResult = {
          correct: gotIt,
          seconds: this.answerAtMs / 1000,
          points,
          nonce: (this.resultNonce += 1),
        };
      }
    }

    this.others.forEach(({ container }, sessionId) => {
      const answer = this.answerFromBroadcast(
        this.mmoServer?.state.players.get(sessionId)?.x ?? -1,
      );
      if (answer === correct) container.cheer();
      else this.showDeath(container);
    });
  }

  /**
   * Load a player's `death` sheet on demand and build its animation (the same
   * on-the-fly approach ChopScene uses for the axe swing — BumpkinContainer only
   * bakes idle/walking/dig/drilling). No-op once loaded / in-flight.
   */
  private ensureDeath(clothing?: Player["clothing"]) {
    if (!clothing) return;
    const key = tokenUriBuilder(clothing as unknown as BumpkinParts);
    const animKey = `death-anim-${key}`;
    if (this.anims.exists(animKey) || this.deathLoading.has(key)) return;

    this.deathLoading.add(key);
    this.load.spritesheet(
      `death-${key}`,
      getAnimationUrl(clothing as unknown as BumpkinParts, ["death"]),
      { frameWidth: 96, frameHeight: 64 },
    );
    this.load.once(`filecomplete-spritesheet-death-${key}`, () => {
      if (this.anims.exists(animKey) || !this.textures.exists(`death-${key}`)) {
        return;
      }
      this.anims.create({
        key: animKey,
        frames: this.anims.generateFrameNumbers(`death-${key}`),
        frameRate: 10,
        repeat: 0,
      });
    });
    this.load.start();
  }

  /** Play the real `death` animation (falls back to nothing until it's loaded). */
  private showDeath(c: BumpkinContainer) {
    const sprite = c.sprite;
    if (!sprite || !c.clothing) return;
    const animKey = `death-anim-${tokenUriBuilder(c.clothing as unknown as BumpkinParts)}`;
    if (this.anims.exists(animKey)) sprite.anims.play(animKey, true);
  }

  private resetAppearance(c: BumpkinContainer) {
    // Back to idle (clears the death/cheer animation from the previous round).
    c.idle();
  }

  updatePlayer() {
    const player = this.currentPlayer;
    if (!player?.body) return;

    (player.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);

    const bridge = this.bridge;
    const now = serverNow();
    const elapsed = bridge ? now - bridge.getRaceStartAt() : 0;
    const over = isTriviaOver(elapsed);
    const racing = bridge?.getPhase() === "racing" && !over && !this.finished;

    const round = triviaRound(elapsed);
    // Only "answer" accepts picks; the lobby/intro/reveal all reject them.
    this.phase = racing ? round.phase : "intro";

    // New question: stand everyone back up (their positions are kept). A kept
    // answer counts as locked in at t=0 (fastest) until they change it.
    if (racing && round.index !== this.lastResetRound) {
      this.lastResetRound = round.index;
      this.answerAtMs = 0;
      this.resetAppearance(player);
      this.others.forEach(({ container }) => this.resetAppearance(container));
    }

    // Apply a tapped answer from the button HUD.
    const controls = this.controls;
    if (controls && controls.pending !== null) {
      this.applyPick(controls.pending);
      controls.pending = null;
    }

    // Reveal: grade this round once, when the answer window closes.
    if (
      racing &&
      round.phase === "feedback" &&
      round.index !== this.lastGradedRound
    ) {
      this.lastGradedRound = round.index;
      this.gradeRound(round.index);
    }

    // Submit the final score once, when the clock is up.
    if (bridge && !this.finished && bridge.getPhase() === "racing" && over) {
      this.finished = true;
      bridge.onFinish(this.score);
    }

    // Broadcast our ANSWER INDEX as X (for remote placement) + our SCORE as Y.
    const answer = this.currentAnswer ?? -1;
    if (
      now - this.lastBroadcastAt > 90 &&
      (answer !== this.lastBroadcastAnswer ||
        this.score !== this.lastBroadcastScore)
    ) {
      this.lastBroadcastAt = now;
      this.lastBroadcastAnswer = answer;
      this.lastBroadcastScore = this.score;
      this.mmoServer?.send(0, { x: answer, y: this.score });
    }

    // TEMP diagnostic — what the SCENE (registry server) sees in the room, once
    // a second, to compare with the leaderboard's `[giveaway] leaderboard` log.
    if (now - this.lastLogAt > 1000) {
      this.lastLogAt = now;
      // eslint-disable-next-line no-console
      console.log("[giveaway] trivia-scene", {
        hasServer: !!this.mmoServer,
        selfSessionId: this.mmoServer?.sessionId,
        size: this.mmoServer?.state?.players?.size ?? -1,
        myScore: this.score,
        myAnswer: answer,
        round: round.index,
        phase: this.phase,
      });
    }

    player.setDepth(Math.floor(player.y));
  }

  /**
   * Draw everyone else in the quadrant of the answer they broadcast (X = answer
   * index), each at a stable random offset so they cluster naturally. Their
   * broadcast Y is score, so it's ignored for placement.
   */
  updateOtherPlayers() {
    const server = this.mmoServer;
    if (!server) return;

    for (const [sessionId, other] of this.others) {
      if (!server.state.players.get(sessionId)) {
        other.container.destroy();
        this.others.delete(sessionId);
      }
    }

    server.state.players.forEach((remote, sessionId) => {
      if (sessionId === server.sessionId) return;

      const answer = this.answerFromBroadcast(remote.x);
      const target =
        answer === null
          ? { x: this.centerX, y: this.centerY }
          : this.quadCenter(answer);

      let entry = this.others.get(sessionId);
      if (!entry) {
        try {
          const ox = Phaser.Math.Between(
            -this.quadDx * 0.45,
            this.quadDx * 0.45,
          );
          const oy = Phaser.Math.Between(
            -this.quadDy * 0.45,
            this.quadDy * 0.45,
          );
          const container = this.createPlayer({
            x: target.x + ox,
            y: target.y + oy,
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
          // Load their death sheet so the reveal plays it, not a fallback.
          this.ensureDeath(remote.clothing);
          entry = { container, ox, oy };
          this.others.set(sessionId, entry);
        } catch {
          return;
        }
      }

      const { container, ox, oy } = entry;
      const tx = target.x + ox;
      const ty = target.y + oy;
      if (tx > container.x + 0.5) container.faceRight();
      else if (tx < container.x - 0.5) container.faceLeft();
      container.x = Phaser.Math.Linear(container.x, tx, 0.2);
      container.y = Phaser.Math.Linear(container.y, ty, 0.2);
      container.setDepth(Math.floor(container.y));
    });
  }
}
