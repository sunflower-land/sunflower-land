import type Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import { NPC_WEARABLES } from "lib/npcs";
import { translate } from "lib/i18n/translate";
import { secondsToString } from "lib/utils/time";
import type { MachineState } from "features/game/lib/gameMachine";
import type { Cave } from "features/game/types/game";
import { isCaveMachineIdle } from "features/game/lib/cave";
import { getNextCaveTier } from "features/game/types/caveTiers";
import { hasUnseenCaveMerchantOffers } from "features/game/types/caveMerchant";
import {
  CAVE_CONSTRUCTION_SITES,
  CAVE_LADDER,
  CAVE_MERCHANT_ALCOVE,
  CAVE_SLOTS,
  caveSlotsForTier,
} from "features/game/expansion/placeable/lib/caveLayout";
import {
  CAVE_LADDER_IMAGE,
  CAVE_LADDER_SPRITE,
  CAVE_MYCO_BIN_IMAGES,
  getCaveMycoBinImage,
} from "features/cave/lib/caveImages";
import { CAVE_TUTORIAL_BUBBLES } from "features/cave/components/CaveTutorial";
import {
  parseCaveMerchantSeen,
  readCaveMerchantSeen,
  subscribeCaveMerchantSeen,
} from "features/cave/lib/merchantOffers";
import { LabelBadge, type LabelBadgeType } from "../../components/LabelBadge";
import { NPCSpeechBubbleSprite } from "../../components/NPCSpeechBubbleSprite";
import { floatBob } from "../../core/juice";
import { queueImage, runLoader } from "../../core/assets";
import { makeClickable } from "../../core/clickable";
import { EntityRenderer } from "../EntityRenderer";
import { NPCSprite } from "../npc/NPCSprite";
import {
  CAVE_DEPTHS,
  caveTileRect,
  caveTileX,
  caveTileY,
} from "./caveGeometry";
import {
  acknowledgeCaveGuide,
  caveTutorialSeen,
  createCaveAlert,
  createCaveHand,
  openCaveModal,
  readCaveGuide,
  readCaveShovelNeed,
  type CaveHand,
} from "./caveGuide";

/**
 * The Cave's fixed furniture [cave/Cave.tsx]: the ladder out, the Goblin
 * Cave Merchant in his alcove (speech bubble, unseen-offers "!", tutorial
 * hand), one Myco Bin per unlocked slot (art for what it is composting, the
 * "!" while it waits for a mix) and the expansion barrier with its sign.
 *
 * The room art is the backdrop layer's; the dig patches are
 * CavePatchRenderer's. Every click opens a React panel through
 * `bridge.caveUi` [overlay/CaveUI.tsx] or dispatches the event the DOM
 * sends.
 */

type Slice = {
  cave: Cave | undefined;
  /** Feed the tutorial step and Gloomwick's "need more shovels" line. */
  shovels: number;
  drills: number;
  tilesDug: number;
  farmId: number;
  visiting: boolean;
};

/** [NPC.tsx NPCPlaceable] the merchant's box: 16 wide, twice as tall. */
const NPC_BOX = { width: 16, height: 32 };

/** [Cave.tsx] how long Gloomwick "types" before a new line shows. */
const TYPING_MS = 1000;

type BinObjects = {
  art: Phaser.GameObjects.Image;
  zone: Phaser.GameObjects.Zone;
  alert?: Phaser.GameObjects.Image;
  hand?: CaveHand;
};

type SiteObjects = {
  key: string;
  zone: Phaser.GameObjects.Zone;
  label?: LabelBadge;
  hand?: CaveHand;
};

export class CaveRoomRenderer extends EntityRenderer<Slice> {
  private loaded = false;

  private ladder:
    | { art: Phaser.GameObjects.Image; zone: Phaser.GameObjects.Zone }
    | undefined;

  private merchant:
    | { npc: NPCSprite; zone: Phaser.GameObjects.Zone }
    | undefined;
  private merchantAlert: Phaser.GameObjects.Image | undefined;
  private merchantHand: CaveHand | undefined;

  /** Gloomwick's bubble: the line wanted, and what is on screen for it. */
  private speech: string | undefined;
  private bubble: NPCSpeechBubbleSprite | undefined;
  private typing: Phaser.Time.TimerEvent | undefined;

  private bins = new Map<number, BinObjects>();
  private site: SiteObjects | undefined;

  private unsubscribes: (() => void)[] = [];

  selector(state: MachineState): Slice {
    const game = state.context.state;
    return {
      cave: game.cave,
      shovels: game.inventory["Sand Shovel"]?.toNumber() ?? 0,
      drills: game.inventory["Sand Drill"]?.toNumber() ?? 0,
      tilesDug: game.farmActivity["Cave Tile Dug"] ?? 0,
      farmId: state.context.farmId,
      visiting: state.context.visitorId !== undefined,
    };
  }

  equals = (a: Slice, b: Slice) =>
    a.cave === b.cave &&
    a.shovels === b.shovels &&
    a.drills === b.drills &&
    a.tilesDug === b.tilesDug &&
    a.farmId === b.farmId &&
    a.visiting === b.visiting;

  async sync(slice: Slice) {
    const token = this.beginSync();
    queueImage(this.scene, CAVE_LADDER_IMAGE);
    Object.values(CAVE_MYCO_BIN_IMAGES).forEach((url) =>
      queueImage(this.scene, url),
    );
    queueImage(this.scene, SUNNYSIDE.icons.expression_alerted);
    queueImage(this.scene, SUNNYSIDE.icons.click_icon);
    queueImage(this.scene, SUNNYSIDE.icons.expand);
    queueImage(this.scene, SUNNYSIDE.icons.hammer);
    LabelBadge.queueAssets(this.scene);
    NPCSpeechBubbleSprite.queueAssets(this.scene);
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    if (!this.loaded) {
      this.loaded = true;
      // The open panel and the tutorial acknowledgements change what the
      // room shows (bubble, hands), as does the merchant's seen-offers store.
      this.unsubscribes.push(
        this.bridge.caveUi.subscribe(() => this.render()),
        subscribeCaveMerchantSeen(() => this.render()),
      );
    }
    this.render(slice);
  }

  /** Reconcile every piece against the state right now. Synchronous. */
  private render(
    slice: Slice = this.bridge.select((state) => this.selector(state)),
  ) {
    if (!this.loaded || this.destroyed) return;
    const { cave } = slice;
    if (!cave) {
      // [Cave.tsx] no cave: the overlay is already sending the player home.
      this.clear();
      return;
    }

    const now = Date.now();
    const game = this.bridge.select((state) => state.context.state);
    const { modal } = this.bridge.caveUi.get();
    const guide = readCaveGuide(
      game,
      now,
      caveTutorialSeen(this.bridge),
      modal,
    );
    const animate = this.bridge.ui.get().showAnimations;

    this.syncLadder();
    this.syncMerchant(slice, guide, now, animate);
    this.syncBins(cave, guide, now, animate);
    this.syncSite(cave, guide, now, animate);
  }

  /** [Cave.tsx] the ladder out: a 2x4 tile hitbox, the sprite 9px down. */
  private syncLadder() {
    if (this.ladder) return;
    const rect = caveTileRect(CAVE_LADDER);
    const art = this.scene.add
      .image(rect.x, rect.y + CAVE_LADDER_SPRITE.top, CAVE_LADDER_IMAGE)
      .setOrigin(0, 0)
      .setDepth(CAVE_DEPTHS.FURNITURE);
    const zone = this.scene.add
      .zone(rect.x, rect.y, rect.width, rect.height)
      .setOrigin(0, 0)
      .setDepth(CAVE_DEPTHS.FURNITURE);
    makeClickable(
      this.scene,
      zone,
      // Through the bridge so the room dissolves out first.
      () => this.bridge.navigateTo("/"),
      { glow: () => this.ladder?.art },
    );
    this.ladder = { art, zone };
  }

  /**
   * [Cave.tsx] Gloomwick beside the entrance arch: 4 tiles in from the
   * alcove's right edge, 2 tiles down, facing left.
   */
  private syncMerchant(
    slice: Slice,
    guide: ReturnType<typeof readCaveGuide>,
    now: number,
    animate: boolean,
  ) {
    const x = caveTileX(
      CAVE_MERCHANT_ALCOVE.x + CAVE_MERCHANT_ALCOVE.width - 4,
    );
    const y = caveTileY(CAVE_MERCHANT_ALCOVE.y + 2);
    const { modal } = this.bridge.caveUi.get();

    if (!this.merchant) {
      const npc = new NPCSprite(this.scene, {
        parts: NPC_WEARABLES.gloomwick,
        x,
        y,
        flipX: true,
        depth: CAVE_DEPTHS.NPC,
      });
      void npc.create();
      // A tile-sized zone, not the 96px sheet frame, takes the click.
      const zone = this.scene.add
        .zone(x, y, NPC_BOX.width, NPC_BOX.height)
        .setOrigin(0, 0)
        .setDepth(CAVE_DEPTHS.NPC);
      makeClickable(
        this.scene,
        zone,
        () => openCaveModal(this.bridge, { name: "merchant" }),
        { glow: () => this.merchant?.npc.body() },
      );
      this.merchant = { npc, zone };
    }

    // [Cave.tsx merchantSpeech] the tutorial's line first, else the nudge
    // to restock; hidden while any Cave panel (or the popup) is up.
    const { needsShovels } = readCaveShovelNeed(
      this.bridge.select((state) => state.context.state),
      now,
    );
    const line = guide.guiding
      ? translate(CAVE_TUTORIAL_BUBBLES[guide.guiding])
      : needsShovels
        ? translate("cave.merchant.noShovels")
        : undefined;
    this.syncSpeech(
      line && !guide.showPopup && !modal ? line : undefined,
      // [Cave.tsx] top -6, left 6 of the merchant's box.
      x + 6,
      y - 6,
      animate,
    );

    // [Cave.tsx] the unseen-offers "!": 4px wide at top -12, left 6.
    const hasUnseenOffers =
      !slice.visiting &&
      hasUnseenCaveMerchantOffers(
        slice.cave,
        now,
        parseCaveMerchantSeen(readCaveMerchantSeen(slice.farmId)),
      );
    if (hasUnseenOffers && !this.merchantAlert) {
      this.merchantAlert = createCaveAlert(this.scene, {
        x: x + 6,
        y: y - 12,
        depth: CAVE_DEPTHS.ALERT,
        animate,
      });
    } else if (!hasUnseenOffers && this.merchantAlert) {
      this.merchantAlert.destroy();
      this.merchantAlert = undefined;
    }

    // [Cave.tsx] the hand on Gloomwick while the tutorial sends the player
    // to buy shovels. His DOM button has no size of its own, so the hand's
    // "bottom-right corner" is 6px up-left of his box origin.
    const wantsHand =
      guide.guiding === "buy-shovels" && modal?.name !== "merchant";
    if (wantsHand && !this.merchantHand) {
      this.merchantHand = createCaveHand(this.scene, {
        x: x - 6,
        y: y - 6,
        depth: CAVE_DEPTHS.HAND,
        animate,
      });
    } else if (!wantsHand && this.merchantHand) {
      this.merchantHand.destroy();
      this.merchantHand = undefined;
    }
  }

  /**
   * [NPCSpeechBubble.tsx] a new line shows "..." for a second first; the
   * bubble goes away (and types again on return) whenever it is hidden.
   */
  private syncSpeech(
    line: string | undefined,
    x: number,
    y: number,
    animate: boolean,
  ) {
    if (line === this.speech) return;
    this.speech = line;
    this.typing?.remove();
    this.typing = undefined;
    this.bubble?.destroy();
    this.bubble = undefined;
    if (!line) return;

    const show = (text: string) => {
      this.bubble?.destroy();
      this.bubble = new NPCSpeechBubbleSprite(this.scene, {
        x,
        y,
        text,
        depth: CAVE_DEPTHS.LABEL,
      });
      // [NPCSpeechBubble.tsx] animate-float.
      if (animate) floatBob(this.scene, this.bubble.container);
    };
    show("...");
    this.typing = this.scene.time.delayedCall(TYPING_MS, () => {
      this.typing = undefined;
      if (this.destroyed || this.speech !== line) return;
      show(line);
    });
  }

  /** [Cave.tsx] one Myco Bin per unlocked slot, filling its sign rectangle. */
  private syncBins(
    cave: Cave,
    guide: ReturnType<typeof readCaveGuide>,
    now: number,
    animate: boolean,
  ) {
    const { modal } = this.bridge.caveUi.get();
    const slots = caveSlotsForTier(cave.tier);

    for (const [id, objects] of this.bins) {
      if (slots.includes(id)) continue;
      this.destroyBin(objects);
      this.bins.delete(id);
    }

    for (const id of slots) {
      const machine = cave.machines[String(id)];
      const rect = caveTileRect(CAVE_SLOTS[id].sign);
      const texture = getCaveMycoBinImage(machine?.batch, now);

      let objects = this.bins.get(id);
      if (!objects) {
        const art = this.scene.add
          .image(rect.x, rect.y, texture)
          .setOrigin(0, 0)
          .setDepth(CAVE_DEPTHS.FURNITURE);
        const zone = this.scene.add
          .zone(rect.x, rect.y, rect.width, rect.height)
          .setOrigin(0, 0)
          .setDepth(CAVE_DEPTHS.FURNITURE);
        makeClickable(
          this.scene,
          zone,
          () =>
            openCaveModal(this.bridge, {
              name: "machine",
              machineId: String(id),
            }),
          { glow: () => this.bins.get(id)?.art },
        );
        objects = { art, zone };
        this.bins.set(id, objects);
      }
      if (objects.art.texture.key !== texture) objects.art.setTexture(texture);

      // [Cave.tsx] waiting for a mix: the "!" centred over the sign, top -12.
      const idle = isCaveMachineIdle(machine ?? {});
      if (idle && !objects.alert) {
        objects.alert = createCaveAlert(this.scene, {
          x: rect.x + rect.width / 2 - 2,
          y: rect.y - 12,
          depth: CAVE_DEPTHS.ALERT,
          animate,
        });
      } else if (!idle && objects.alert) {
        objects.alert.destroy();
        objects.alert = undefined;
      }

      // [Cave.tsx] the tutorial hand on the first bin's bottom-right corner.
      const wantsHand =
        id === 1 &&
        guide.guiding === "start-batch" &&
        modal?.name !== "machine";
      if (wantsHand && !objects.hand) {
        objects.hand = createCaveHand(this.scene, {
          x: rect.x + rect.width - 6,
          y: rect.y + rect.height - 6,
          depth: CAVE_DEPTHS.HAND,
          animate,
        });
      } else if (!wantsHand && objects.hand) {
        objects.hand.destroy();
        objects.hand = undefined;
      }
    }
  }

  /**
   * [Cave.tsx] the barrier where the next slot opens: expand, wait out the
   * construction, then open the new slot. None at the last tier.
   */
  private syncSite(
    cave: Cave,
    guide: ReturnType<typeof readCaveGuide>,
    now: number,
    animate: boolean,
  ) {
    const tileRect = getNextCaveTier(cave.tier)
      ? CAVE_CONSTRUCTION_SITES[cave.tier]
      : undefined;
    if (!tileRect) {
      this.destroySite();
      return;
    }
    const rect = caveTileRect(tileRect);
    const { modal } = this.bridge.caveUi.get();
    const construction = cave.construction;
    const constructionReady = !!construction && construction.readyAt <= now;

    let type: LabelBadgeType;
    let icon: string;
    let text: string;
    if (!construction) {
      type = "default";
      icon = SUNNYSIDE.icons.expand;
      text = translate("cave.expand.expand");
    } else if (!constructionReady) {
      type = "warning";
      icon = SUNNYSIDE.icons.hammer;
      text = secondsToString(Math.max(0, (construction.readyAt - now) / 1000), {
        length: "short",
      });
    } else {
      type = "success";
      icon = SUNNYSIDE.icons.hammer;
      text = translate("cave.expand.ready");
    }
    const wantsHand = guide.guiding === "expand" && modal?.name !== "expansion";

    const key = [cave.tier, type, text, wantsHand].join("|");
    if (this.site?.key === key) return;

    // The hitbox only moves when the tier does.
    let zone = this.site?.zone;
    if (!zone || !this.site?.key.startsWith(`${cave.tier}|`)) {
      zone?.destroy();
      zone = this.scene.add
        .zone(rect.x, rect.y, rect.width, rect.height)
        .setOrigin(0, 0)
        .setDepth(CAVE_DEPTHS.FURNITURE);
      makeClickable(this.scene, zone, () => this.onSiteClick());
    }
    this.site?.label?.destroy();
    this.site?.hand?.destroy();

    // Centred on the barrier.
    const label = new LabelBadge(this.scene, {
      x: 0,
      y: 0,
      text,
      type,
      icon,
      depth: CAVE_DEPTHS.LABEL,
    });
    label.setPosition(
      Math.round(rect.x + rect.width / 2 - label.width / 2),
      Math.round(rect.y + rect.height / 2 - label.height / 2),
    );

    // [Cave.tsx] the hand at left 50%, top 4 of the barrier.
    const hand = wantsHand
      ? createCaveHand(this.scene, {
          x: rect.x + rect.width / 2,
          y: rect.y + 4,
          depth: CAVE_DEPTHS.HAND,
          animate,
        })
      : undefined;

    this.site = { key, zone, label, hand };
  }

  /** [Cave.tsx] the barrier's onClick. */
  private onSiteClick() {
    const now = Date.now();
    const game = this.bridge.select((state) => state.context.state);
    const cave = game.cave;
    if (!cave) return;
    const { modal } = this.bridge.caveUi.get();
    const guide = readCaveGuide(
      game,
      now,
      caveTutorialSeen(this.bridge),
      modal,
    );
    if (guide.guiding === "expand") acknowledgeCaveGuide(this.bridge, "done");

    const construction = cave.construction;
    if (construction && construction.readyAt <= now) {
      this.bridge.dispatch({ type: "cave.expansionCompleted" });
    } else {
      openCaveModal(this.bridge, { name: "expansion" });
    }
  }

  /**
   * Bin art, the construction countdown, the tutorial step and the merchant's
   * stock all turn on the clock, so the room re-reads it once a second.
   */
  update(_time: number, delta: number) {
    if (!this.secondElapsed(delta)) return;
    this.render();
  }

  private destroyBin(objects: BinObjects) {
    objects.art.destroy();
    objects.zone.destroy();
    objects.alert?.destroy();
    objects.hand?.destroy();
  }

  private destroySite() {
    this.site?.zone.destroy();
    this.site?.label?.destroy();
    this.site?.hand?.destroy();
    this.site = undefined;
  }

  private clear() {
    this.ladder?.art.destroy();
    this.ladder?.zone.destroy();
    this.ladder = undefined;
    this.merchant?.npc.destroy();
    this.merchant?.zone.destroy();
    this.merchant = undefined;
    this.merchantAlert?.destroy();
    this.merchantAlert = undefined;
    this.merchantHand?.destroy();
    this.merchantHand = undefined;
    this.typing?.remove();
    this.typing = undefined;
    this.bubble?.destroy();
    this.bubble = undefined;
    this.speech = undefined;
    this.bins.forEach((objects) => this.destroyBin(objects));
    this.bins.clear();
    this.destroySite();
  }

  protected onDestroy() {
    this.unsubscribes.forEach((unsubscribe) => unsubscribe());
    this.unsubscribes = [];
    this.clear();
  }
}
