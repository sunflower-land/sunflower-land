import type Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import type { NPCSprite } from "../entities/npc/NPCSprite";
import type { GameBridge } from "../bridge/GameBridge";
import { queueImage, runLoader } from "../core/assets";
import { WORLD_TILE } from "../core/coordinates";
import { DEPTHS } from "../core/depths";

/**
 * EXPERIMENT — bumpkin job queue.
 *
 * Click your bumpkin to "select" them (the select box docks under their
 * feet), then click resources to queue jobs. Each queued target gets a blue
 * dot — this bumpkin's colour — until its job runs. The bumpkin walks to
 * each target in order and only fires the underlying game event
 * (`tree.chopped` and friends) once they arrive and swing. Tapping bare
 * ground queues a walk, with a pixel tap-ripple as feedback.
 *
 * Deliberately additive: with no bumpkin selected every renderer behaves
 * exactly as before, so a normal click still chops instantly. The only hook
 * into the rest of the engine is `intercept()`, which a renderer calls at the
 * top of its click handler.
 */

export type WorkerJob = {
  /** Label for the React queue readout. */
  label: string;
  /**
   * The target's box top-left, world px — for a plain walk, the exact spot
   * the feet should land on.
   */
  world: { x: number; y: number };
  /** The target's box size, world px (default one tile). */
  size?: { width: number; height: number };
  /** Fired on arrival. Omitted for a plain walk. */
  run?: () => void;
  /** The service animation played on arrival (default axe). */
  anim?: "axe" | "dig" | "mining" | "doing";
  /** Where the queued-marker dot sits (usually top-centre of the node). */
  dotAt?: { x: number; y: number };
  /** Item shown in the marker — the tool or seed the job will use. */
  icon?: string;
};

export type WorkerState = {
  active: boolean;
  /** Pending jobs, in the order they were clicked. */
  jobs: string[];
  busy: boolean;
};

/** Source px per second — brisk enough to cross a 42-expansion farm. */
const WALK_SPEED = 60;
/** How long the swing animation plays before the event fires. */
const SWING_MS = 600;
/** This bumpkin's queue colour (the palette's health-bar blue). */
const WORKER_BLUE = 0x0099db;
/** The select box anchors to the bumpkin's box through this id. */
export const WORKER_ANCHOR = "worker-bumpkin";
/** The NPC box the sprite is laid out against [NPCSprite]. */
const NPC_BOX = 16;

/**
 * Box-origin → the ground-contact point under the feet (the shadow's centre
 * [NPCSprite SHADOW_DROP]).
 */
const FEET = { x: NPC_BOX / 2, y: 22 };

/**
 * Where each service animation actually lands its blow, measured off the
 * sheets: px in front of the feet (facing direction) and px above the ground
 * line. The walk target is chosen so this point falls on the node.
 */
const CONTACT: Record<
  NonNullable<WorkerJob["anim"]>,
  { reach: number; lift: number }
> = {
  axe: { reach: 27, lift: 5 },
  mining: { reach: 27, lift: 5 },
  dig: { reach: 16, lift: 1 },
  doing: { reach: 8, lift: 4 },
};

/**
 * The select box reads as a ground marker: full art width, squashed to hug
 * the feet — top at mid-body, bottom a little below the ground line.
 */
const SELECT_BOX = { width: 30, height: 21, bottom: 29 };

export class BumpkinWorker {
  private active = false;
  private queue: WorkerJob[] = [];
  private running = false;
  /** Where we've walked the sprite to; re-applied so state churn can't undo it. */
  private position?: { x: number; y: number };
  private walkTween?: Phaser.Tweens.Tween;
  /** Queued-target markers (dot + optional tool/seed icon), in queue order. */
  private dots = new Map<WorkerJob, Phaser.GameObjects.GameObject[]>();
  /** The select_box ring around the selected bumpkin's base. */
  private selectBox?: Phaser.GameObjects.Image;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly bridge: GameBridge,
  ) {}

  private sprite(): NPCSprite | undefined {
    return (this.scene as unknown as { mainBumpkin?: NPCSprite }).mainBumpkin;
  }

  isActive() {
    return this.active;
  }

  /** Clicking the bumpkin toggles job mode. */
  toggle() {
    this.active = !this.active;
    if (!this.active) this.clearQueue();
    else {
      // Warm the job sheets so the first swing doesn't play out invisibly
      // while its strip is still downloading.
      const sprite = this.sprite();
      (["walking", "axe", "dig", "mining", "doing"] as const).forEach(
        (anim) => void sprite?.preload(anim),
      );
    }
    this.publishAnchor();
    void this.syncSelectBox();
    this.publish();
  }

  stop() {
    this.active = false;
    this.clearQueue();
    void this.syncSelectBox();
    this.publish();
  }

  /** [ui/select_box.png] the selection ring around the bumpkin's base. */
  private async syncSelectBox() {
    if (!this.active) {
      this.selectBox?.destroy();
      this.selectBox = undefined;
      return;
    }
    if (this.selectBox) return;
    const texture = SUNNYSIDE.ui.select_box;
    if (!this.scene.textures.exists(texture)) {
      queueImage(this.scene, texture);
      await runLoader(this.scene);
    }
    if (!this.active || this.selectBox) return;
    if (!this.scene.textures.exists(texture)) return;
    const origin = this.position ?? this.sprite()?.origin();
    if (!origin) return;
    this.selectBox = this.scene.add
      .image(origin.x + NPC_BOX / 2, origin.y + SELECT_BOX.bottom, texture)
      .setOrigin(0.5, 1);
    this.selectBox.setDisplaySize(SELECT_BOX.width, SELECT_BOX.height);
    this.placeSelectBoxDepth();
  }

  /** Behind the bumpkin (and its shadow), whatever depth the body sits at. */
  private placeSelectBoxDepth() {
    if (!this.selectBox) return;
    const bodyDepth =
      this.sprite()?.body()?.depth ??
      DEPTHS.ENTITY_BASE + (this.position?.y ?? this.selectBox.y);
    this.selectBox.setDepth(bodyDepth - 0.6);
  }

  private clearQueue() {
    this.queue = [];
    this.dots.forEach((parts) => parts.forEach((part) => part.destroy()));
    this.dots.clear();
    this.walkTween?.remove();
    this.walkTween = undefined;
    this.running = false;
    void this.sprite()?.play("idle");
  }

  /**
   * A renderer's click handler calls this first. Returns true when the click
   * was swallowed into the queue, so the renderer should do nothing else.
   */
  intercept(job: WorkerJob): boolean {
    if (!this.active) return false;
    this.queue.push(job);
    this.addDot(job);
    this.publish();
    void this.drain();
    return true;
  }

  /** Bare-ground tap while selected: walk there, with tap feedback. */
  moveTo(world: { x: number; y: number }) {
    if (!this.active) return false;
    this.tapRipple(world);
    this.queue.push({ label: "Walk", world });
    this.publish();
    void this.drain();
    return true;
  }

  /**
   * Queued-marker over the target: the tool/seed the job will use, with the
   * blue dot — this bumpkin's colour — tucked at its corner.
   */
  private addDot(job: WorkerJob) {
    if (!job.dotAt) return;
    const parts: Phaser.GameObjects.GameObject[] = [];
    this.dots.set(job, parts);

    // A 1px dark rim so the dot reads against grass and rock alike.
    const dot = this.scene.add
      .rectangle(job.dotAt.x, job.dotAt.y, 4, 4, WORKER_BLUE)
      .setOrigin(0.5, 1)
      .setStrokeStyle(1, 0x181425)
      .setName("worker-marker")
      .setDepth(DEPTHS.ALWAYS_ON_TOP + 50);
    parts.push(dot);

    if (job.icon) void this.addDotIcon(job, parts, job.icon);
  }

  /** The icon loads lazily; skip drawing if the job resolved meanwhile. */
  private async addDotIcon(
    job: WorkerJob,
    parts: Phaser.GameObjects.GameObject[],
    texture: string,
  ) {
    if (!this.scene.textures.exists(texture)) {
      queueImage(this.scene, texture);
      await runLoader(this.scene);
    }
    if (!this.dots.has(job) || !this.scene.textures.exists(texture)) return;
    const icon = this.scene.add
      .image(job.dotAt!.x, job.dotAt!.y - 5, texture)
      .setOrigin(0.5, 1)
      .setName("worker-marker-icon")
      .setDepth(DEPTHS.ALWAYS_ON_TOP + 50);
    icon.setScale(1); // pixel-art rule: native size
    parts.push(icon);
    // Dot rides the icon's bottom-right corner.
    const dot = parts[0] as Phaser.GameObjects.Rectangle;
    dot.setPosition(job.dotAt!.x + icon.displayWidth / 2, job.dotAt!.y - 3);
  }

  private removeDot(job: WorkerJob) {
    this.dots.get(job)?.forEach((part) => part.destroy());
    this.dots.delete(job);
  }

  /**
   * Pixel tap-ripple: three hard-edged rectangle outlines stepping inward —
   * no tweened strokes, so the lines stay exactly one pixel at any zoom.
   */
  private tapRipple(world: { x: number; y: number }) {
    const steps = [12, 8, 4];
    steps.forEach((size, index) => {
      this.scene.time.delayedCall(index * 90, () => {
        const ring = this.scene.add
          .rectangle(world.x, world.y, size, size)
          .setOrigin(0.5, 0.5)
          .setFillStyle()
          .setStrokeStyle(1, WORKER_BLUE)
          .setName("worker-ripple")
          .setDepth(DEPTHS.ALWAYS_ON_TOP + 50);
        this.scene.time.delayedCall(90, () => ring.destroy());
      });
    });
  }

  private publish() {
    this.bridge.worker.set({
      active: this.active,
      jobs: this.queue.map((job) => job.label),
      busy: this.running,
    });
  }

  /** Keep the select box glued under the bumpkin's feet. */
  private publishAnchor() {
    if (!this.active) {
      this.bridge.anchors.removeAnchor(WORKER_ANCHOR);
      return;
    }
    const origin = this.position ?? this.sprite()?.origin();
    if (!origin) return;
    this.bridge.anchors.setAnchor(WORKER_ANCHOR, {
      x: origin.x,
      y: origin.y,
      width: NPC_BOX,
      height: NPC_BOX,
    });
  }

  private async drain() {
    if (this.running) return;
    this.running = true;
    this.publish();

    while (this.queue.length && this.active) {
      const job = this.queue[0];
      const stand = this.standPoint(job);
      await this.walkTo(stand.origin);
      if (!this.active) break;
      if (job.run) {
        // Face the node even when no walk was needed.
        this.sprite()?.setFlip(stand.faceLeft);
        await this.swing(job.anim ?? "axe");
        if (!this.active) break;
        // The underlying game event fires here, not on the click.
        job.run();
      }
      this.removeDot(job);
      this.queue.shift();
      this.publish();
    }

    this.running = false;
    void this.sprite()?.play("idle");
    this.publish();
  }

  /**
   * Where to stand for a job: the box origin that puts the animation's
   * contact point on the node (approaching from whichever side the bumpkin
   * is already on), or — for a plain walk — the feet on the tapped spot.
   */
  private standPoint(job: WorkerJob): {
    origin: { x: number; y: number };
    faceLeft: boolean;
  } {
    if (!job.run) {
      return {
        origin: { x: job.world.x - FEET.x, y: job.world.y - FEET.y },
        faceLeft: false,
      };
    }

    const size = job.size ?? { width: WORLD_TILE, height: WORLD_TILE };
    // The blow lands on the node's lower-centre — the trunk of a tree, the
    // face of a rock, the middle of a plot.
    const contact = {
      x: job.world.x + size.width / 2,
      y: job.world.y + size.height - size.height / 4,
    };
    const { reach, lift } = CONTACT[job.anim ?? "axe"];

    const from = this.position ?? this.sprite()?.origin();
    const feetNowX = (from?.x ?? contact.x - 1) + FEET.x;
    const faceLeft = feetNowX > contact.x;
    const feet = {
      x: contact.x + (faceLeft ? reach : -reach),
      y: contact.y + lift,
    };
    return {
      origin: { x: feet.x - FEET.x, y: feet.y - FEET.y },
      faceLeft,
    };
  }

  private walkTo(to: { x: number; y: number }): Promise<void> {
    const sprite = this.sprite();
    if (!sprite) return Promise.resolve();

    const from = this.position ?? sprite.origin();
    const distance = Math.hypot(to.x - from.x, to.y - from.y);
    if (distance < 1) return Promise.resolve();

    sprite.setFlip(to.x < from.x);
    void sprite.play("walking");

    return new Promise((resolve) => {
      const cursor = { ...from };
      this.walkTween = this.scene.tweens.add({
        targets: cursor,
        x: to.x,
        y: to.y,
        duration: (distance / WALK_SPEED) * 1000,
        ease: "Linear",
        onUpdate: () => {
          this.position = { x: cursor.x, y: cursor.y };
          this.apply();
        },
        onComplete: () => {
          this.position = to;
          this.apply();
          resolve();
        },
      });
    });
  }

  /** The timer starts once the animation is actually playing (play() loads
   * the strip on first use). */
  private async swing(anim: "axe" | "dig" | "mining" | "doing"): Promise<void> {
    await this.sprite()?.play(anim);
    return new Promise((resolve) =>
      this.scene.time.delayedCall(SWING_MS, () => resolve()),
    );
  }

  /**
   * Re-assert the walked-to position. PlayerRenderer rebuilds the bumpkin
   * whenever its signature changes (chopping grants XP), which would
   * otherwise snap them back to their placed tile mid-route.
   */
  apply() {
    if (!this.position) return;
    const sprite = this.sprite();
    sprite?.setPosition(this.position.x, this.position.y);
    // Walking changes the row they stand on — keep painter order in step, as
    // PlayerRenderer's creation depth only covers the placed tile.
    sprite?.setBaseDepth(DEPTHS.ENTITY_BASE + this.position.y);
    this.selectBox?.setPosition(
      this.position.x + NPC_BOX / 2,
      this.position.y + SELECT_BOX.bottom,
    );
    this.placeSelectBoxDepth();
    this.publishAnchor();
  }

  destroy() {
    this.clearQueue();
    this.selectBox?.destroy();
    this.selectBox = undefined;
    this.bridge.anchors.removeAnchor(WORKER_ANCHOR);
    this.bridge.worker.set(null);
  }
}
