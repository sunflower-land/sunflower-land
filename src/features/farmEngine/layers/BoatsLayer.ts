import { SpeechBubbleSprite } from "../components/SpeechBubbleSprite";
import Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import discordBoat from "assets/decorations/isle_boat.gif";
import restockBoat from "assets/decorations/restock_boat.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { MachineState } from "features/game/lib/gameMachine";
import type { IslandType } from "features/game/types/game";
import {
  getLandTopEdge,
  getWharfCoordinates,
} from "features/game/expansion/lib/constants";
import {
  getUpgradeRaftPosition,
  UPGRADE_RAFTS,
} from "features/game/expansion/components/IslandUpgrader";
import { getPeteHint } from "features/game/expansion/components/TravelTeaser";
import { BONUSES } from "features/game/types/bonuses";
import { NPC_WEARABLES } from "lib/npcs";
import { runLoader } from "../core/assets";
import { queueArt, resolveArtObject } from "../core/animated";
import { makeClickable } from "../core/clickable";
import { getGameboardWorldBounds, gridToWorld } from "../core/coordinates";
import { DEPTHS } from "../core/depths";
import { EntityRenderer } from "../entities/EntityRenderer";
import { NPCSprite } from "../entities/npc/NPCSprite";
import { isRestockBoatVisible } from "../lib/restock";

/**
 * The interactive coastal cast, ported from their DOM components (parity
 * reference in brackets): Pumpkin Pete's teaser raft [TravelTeaser.tsx], the
 * restock boat [RestockBoat.tsx], the Discord boat [DiscordBoat.tsx], the
 * island-upgrade raft [IslandUpgrader.tsx] and the La Tomatina event raft
 * [LaTomatina.tsx]. Sprites and clicks are Phaser; every click opens a React
 * modal via the bridge.
 *
 * KNOWN PARITY GAPS: the Discord hull is an animated GIF (static here until
 * spritesheet art exists); Pete's speech-bubble hint text is not yet rendered
 * (chat icon shows instead) — in-world text needs the engine's speech-bubble
 * treatment, tracked in the checklist.
 */

const decorOffset = (expansionCount: number) =>
  Math.ceil((Math.sqrt(expansionCount) * 6) / 2);

type Slice = {
  landscaping: boolean;
  expansionCount: number;
  islandType: IslandType;
  discordClaimed: boolean;
  discordConnected: boolean;
  restockVisible: boolean;
  laTomatinaActive: boolean;
  peteHint: string | null;
};

export class BoatsLayer extends EntityRenderer<Slice> {
  private bubbles: SpeechBubbleSprite[] = [];

  private objects: { destroy(): void }[] = [];

  selector(state: MachineState): Slice {
    const game = state.context.state;
    const laTomatina = game.specialEvents.current["La Tomatina"];
    const now = Date.now();

    return {
      landscaping: state.matches("landscaping"),
      expansionCount: game.inventory["Basic Land"]?.toNumber() ?? 3,
      islandType: game.island.type,
      discordClaimed: BONUSES["discord-signup"].isClaimed(game),
      discordConnected: !!state.context.discordId,
      restockVisible: isRestockBoatVisible(game),
      laTomatinaActive:
        !!laTomatina &&
        !!laTomatina.isEligible &&
        laTomatina.startAt <= now &&
        laTomatina.endAt >= now,
      peteHint: getPeteHint(state),
    };
  }

  equals = (a: Slice, b: Slice) =>
    a.landscaping === b.landscaping &&
    a.expansionCount === b.expansionCount &&
    a.islandType === b.islandType &&
    a.discordClaimed === b.discordClaimed &&
    a.discordConnected === b.discordConnected &&
    a.restockVisible === b.restockVisible &&
    a.laTomatinaActive === b.laTomatinaActive &&
    a.peteHint === b.peteHint;

  async sync(slice: Slice) {
    const token = this.beginSync();
    // [Land.tsx:1302-1334] the DOM unmounts this during landscaping.
    if (slice.landscaping) {
      this.clear();
      return;
    }

    const upgradeRaft = UPGRADE_RAFTS[slice.islandType];
    SpeechBubbleSprite.queueAssets(this.scene);
    [
      SUNNYSIDE.decorations.raft,
      SUNNYSIDE.icons.expression_chat,
      SUNNYSIDE.decorations.treasure_chest,
      SUNNYSIDE.decorations.rewards_raft,
      restockBoat,
      discordBoat,
      ...(upgradeRaft ? [upgradeRaft] : []),
    ].forEach((texture) => queueArt(this.scene, texture));
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    this.clear();

    this.createTravelTeaser(slice);
    if (slice.restockVisible) this.createRestockBoat(slice);
    if (!slice.discordClaimed) this.createDiscordBoat(slice);
    if (upgradeRaft) this.createUpgradeRaft(slice, upgradeRaft);
    if (slice.laTomatinaActive) this.createLaTomatina(slice);
  }

  /** [TravelTeaser.tsx] Pete's raft east of the wharf. */
  private createTravelTeaser(slice: Slice) {
    const wharf = getWharfCoordinates(slice.expansionCount);
    const base = gridToWorld({ x: wharf.x + 13, y: wharf.y - 1.5 });
    const open = () => this.bridge.farmModal.open("travelTeaser");

    // Inner cluster offset (2, 2), raft art 37 src px wide.
    const raft = this.addImage(
      SUNNYSIDE.decorations.raft,
      base.x + 2,
      base.y + 2,
      37,
      { onClick: open },
    );

    // Pete's box: (14, -10) inside the cluster, mirrored (scaleX(-1)).
    const npc = new NPCSprite(this.scene, {
      parts: NPC_WEARABLES["pumpkin' pete"],
      x: base.x + 2 + 14,
      y: base.y + 2 - 10,
      flipX: true,
      depth: DEPTHS.WATER_DECOR,
      onClick: open,
    });
    void npc.create();

    if (slice.peteHint === "Explore") {
      // Chat icon in the mirrored box: DOM left 8 width 10 in a 16-wide box
      // -> mirrored x = 16 - 8 - 10 = -2; y = -5.
      this.addImage(
        SUNNYSIDE.icons.expression_chat,
        base.x + 2 + 14 - 2,
        base.y + 2 - 10 - 5,
        10,
      );
    } else if (slice.peteHint) {
      // [TravelTeaser.tsx] Pete's speech bubble hint (tail toward Pete).
      const bubble = new SpeechBubbleSprite(this.scene, {
        x: base.x + 2 + 14 - 6,
        y: base.y + 2 - 10 - 8,
        text: slice.peteHint,
        depth: DEPTHS.WATER_DECOR + 2,
      });
      this.bubbles.push(bubble);
    }

    this.objects.push(raft, npc);
  }

  /** [RestockBoat.tsx] gem-shipment boat east of Pete. */
  private createRestockBoat(slice: Slice) {
    const wharf = getWharfCoordinates(slice.expansionCount);
    const base = gridToWorld({ x: wharf.x + 17, y: wharf.y - 1.5 });
    this.objects.push(
      this.addImage(restockBoat, base.x, base.y, 68, {
        flipX: true,
        onClick: () => this.bridge.farmModal.open("restockBoat"),
      }),
    );
  }

  /** [DiscordBoat.tsx] Wobble's gift boat sailing north of the land. */
  private createDiscordBoat(slice: Slice) {
    const bounds = getGameboardWorldBounds(slice.expansionCount);
    const baseX = bounds.x + 650 / PIXEL_SCALE;
    const topY = -(16 * (getLandTopEdge(slice.expansionCount) + 1) + 46);

    const container = this.scene.add
      .container(baseX, topY)
      .setDepth(DEPTHS.WATER_DECOR);
    container.setSize(104, 52);
    container.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(52, 26, 104, 52),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: true,
    });
    makeClickable(this.scene, container, () =>
      this.bridge.openModal("DISCORD"),
    );

    const hull = this.scene.add.image(0, 0, discordBoat).setOrigin(0, 0);
    hull.setScale(104 / hull.width);
    const chat = this.scene.add
      .image(78, -4, SUNNYSIDE.icons.expression_chat)
      .setOrigin(0, 0);
    chat.setScale(10 / chat.width);
    const chest = this.scene.add
      .image(43, -6, SUNNYSIDE.decorations.treasure_chest)
      .setOrigin(0, 0);
    chest.setScale(16 / chest.width);
    container.add([hull, chat, chest]);

    const npc = new NPCSprite(this.scene, {
      parts: NPC_WEARABLES.wobble,
      x: 58,
      y: 3,
      depth: DEPTHS.WATER_DECOR,
      container,
    });
    void npc.create();

    // CSS `boating`: sail translateX(-850px -> 1800px) over 100s, looping,
    // until the gift is ready to claim (connected but unclaimed).
    const isReady = slice.discordConnected && !slice.discordClaimed;
    let tween: Phaser.Tweens.Tween | undefined;
    if (!isReady) {
      container.x = baseX - 850 / PIXEL_SCALE;
      tween = this.scene.tweens.add({
        targets: container,
        x: baseX + 1800 / PIXEL_SCALE,
        duration: 100_000,
        repeat: -1,
        ease: "Linear",
      });
    }

    this.objects.push(npc, {
      destroy: () => {
        tween?.remove();
        container.destroy();
      },
    });
  }

  /** [IslandUpgrader.tsx] Grubnuk's upgrade raft. */
  private createUpgradeRaft(slice: Slice, raftTexture: string) {
    const position = getUpgradeRaftPosition(
      slice.islandType,
      slice.expansionCount,
    );
    const base = gridToWorld({
      x: position.x + decorOffset(slice.expansionCount),
      y: position.y,
    });
    const open = () => this.bridge.farmModal.open("islandUpgrader");

    const raft = this.addImage(raftTexture, base.x + 2, base.y + 2, 62, {
      onClick: open,
    });
    const npc = new NPCSprite(this.scene, {
      parts: NPC_WEARABLES.grubnuk,
      x: base.x + 2 + 24,
      y: base.y + 2 + 16,
      flipX: true,
      depth: DEPTHS.WATER_DECOR,
      onClick: open,
    });
    void npc.create();

    this.objects.push(raft, npc);
  }

  /** [LaTomatina.tsx + Water.tsx placement] special-event rewards raft. */
  private createLaTomatina(slice: Slice) {
    const offset = decorOffset(slice.expansionCount);
    const base = gridToWorld({ x: -5 - offset, y: 2 });
    const open = () => this.bridge.farmModal.open("laTomatina");

    const raft = this.addImage(
      SUNNYSIDE.decorations.rewards_raft,
      base.x - 24,
      base.y - 16,
      60,
      { onClick: open },
    );
    const npc = new NPCSprite(this.scene, {
      parts: {
        hat: "Feather Hat",
        body: "Infernal Bumpkin Potion",
        shirt: "Club Polo",
        hair: "Basic Hair",
        pants: "Wise Slacks",
        tool: "Auction Megaphone",
        shoes: "Black Farmer Boots",
        background: "Farm Background",
      },
      x: base.x + 8,
      y: base.y - 20,
      depth: DEPTHS.WATER_DECOR,
      onClick: open,
    });
    void npc.create();

    this.objects.push(raft, npc);
  }

  private addImage(
    texture: string,
    x: number,
    y: number,
    widthSourcePx: number,
    options: { flipX?: boolean; onClick?: () => void } = {},
  ) {
    // Animated art (the Discord boat hull) becomes a looping Sprite; a
    // missing texture still yields Phaser's placeholder Image, as before.
    const image =
      resolveArtObject(this.scene, undefined, texture) ??
      this.scene.add.image(x, y, texture);
    image
      .setPosition(x, y)
      .setOrigin(0, 0)
      .setDepth(DEPTHS.WATER_DECOR)
      .setFlipX(!!options.flipX);
    image.setScale(widthSourcePx / image.width);
    if (options.onClick) {
      makeClickable(this.scene, image, options.onClick);
    }
    return image;
  }

  private clear() {
    this.bubbles.forEach((bubble) => bubble.destroy());
    this.bubbles = [];
    this.objects.forEach((object) => object.destroy());
    this.objects = [];
  }

  protected onDestroy() {
    this.clear();
  }
}
