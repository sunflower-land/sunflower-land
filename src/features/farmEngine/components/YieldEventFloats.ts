import type Phaser from "phaser";
import Decimal from "decimal.js-light";
import { ITEM_DETAILS } from "features/game/types/images";
import type {
  GameState,
  Inventory,
  InventoryItemName,
} from "features/game/types/game";
import { getSaltNodeCoordinates } from "features/game/types/salt";
import { getWaterTrapCoordinates } from "features/game/types/crustaceans";
import { getWharfCoordinates } from "features/game/expansion/lib/constants";
import { npcOffset } from "../entities/resources/FishermanRenderer";
import { getKeys } from "lib/object";
import type { GameBridge } from "../bridge/GameBridge";
import type { Unsubscribe } from "../bridge/subscriptions";
import { gridToWorld, WORLD_TILE } from "../core/coordinates";
import { greenhousePotOrigin } from "../entities/greenhouse/GreenhousePotRenderer";
import { playYieldFloat } from "./YieldFloat";

/**
 * One standard "+N with icon" for EVERY yield claim, wherever it is
 * dispatched from — a renderer click or a React modal that closes right
 * after (composters, cooking, the lava pit). Listens on the game event
 * stream, diffs the inventory across each tracked event (the machine has
 * already applied it when listeners run), and floats every gained item at
 * the source's world position.
 *
 * Renderer-local floats (crops, trees, minerals, fruit, oil, animals) keep
 * their bespoke calls — their events simply aren't in the position map.
 */

type TrackedEvent = { type: string } & Record<string, unknown>;

/** Stacked floats on one claim sit this far apart vertically (src px). */
const STACK_PX = 12;
const MAX_ITEMS = 4;

/** A float whose claim happened under a modal, waiting for it to close. */
type DeferredFloat = Parameters<typeof playYieldFloat>[1];

export class YieldEventFloats {
  private prevInventory: Inventory;
  private readonly unsubscribe: Unsubscribe;
  private readonly unsubscribeModal: Unsubscribe;
  private deferred: DeferredFloat[] = [];

  constructor(
    private readonly scene: Phaser.Scene & { location?: string },
    private readonly bridge: GameBridge,
  ) {
    this.prevInventory = this.inventory();
    this.unsubscribe = bridge.onGameEvent((event) =>
      this.onEvent(event as TrackedEvent),
    );
    // Most of these claims are made from inside a modal (the cooking panel's
    // Collect button, the composter, the crafting box). Playing the float
    // immediately animated it underneath that modal, where it expired
    // unseen — so the claim looked like it produced no feedback at all.
    this.unsubscribeModal = bridge.modalOpen.subscribe((open) => {
      if (open) return;
      const pending = this.deferred;
      this.deferred = [];
      pending.forEach((options) => playYieldFloat(this.scene, options));
    });
  }

  /** Play now, or hold until the modal covering the scene closes. */
  private play(options: DeferredFloat) {
    if (this.bridge.modalOpen.get()) {
      this.deferred.push(options);
      return;
    }
    playYieldFloat(this.scene, options);
  }

  private inventory(): Inventory {
    return this.bridge.select((state) => state.context.state.inventory);
  }

  private game(): GameState {
    return this.bridge.select((state) => state.context.state);
  }

  /** World anchor for a tracked claim event; undefined = not tracked. */
  private positionFor(event: TrackedEvent): { x: number; y: number } | void {
    const game = this.game();
    const basicLand = game.inventory["Basic Land"]?.toNumber() ?? 3;

    switch (event.type) {
      case "salt.harvested": {
        const coordinates = getSaltNodeCoordinates(basicLand, String(event.id));
        return coordinates && gridToWorld(coordinates);
      }
      case "waterTrap.collected": {
        const coordinates = getWaterTrapCoordinates(
          basicLand,
          game.island.type,
          String(event.trapId),
        );
        return coordinates && gridToWorld(coordinates);
      }
      case "lavaPit.collected": {
        const pit = game.lavaPits?.[String(event.id)];
        return pit?.x !== undefined && pit.y !== undefined
          ? gridToWorld({ x: pit.x, y: pit.y })
          : undefined;
      }
      case "beehive.harvested": {
        const hive = game.beehives?.[String(event.id)];
        return hive?.x !== undefined && hive.y !== undefined
          ? gridToWorld({ x: hive.x, y: hive.y })
          : undefined;
      }
      case "flower.harvested": {
        const bed = game.flowers.flowerBeds[String(event.id)];
        return bed?.x !== undefined && bed.y !== undefined
          ? gridToWorld({ x: bed.x, y: bed.y })
          : undefined;
      }
      case "rod.reeled": {
        // Above the fisherman himself, not the wharf's grid origin.
        const wharf = gridToWorld(getWharfCoordinates(basicLand));
        const offset = npcOffset(game.island.type);
        return { x: wharf.x + offset.x, y: wharf.y + offset.y - 8 };
      }
      case "greenhouse.harvested": {
        // Pots live in the greenhouse surface's room-centred space; this
        // controller runs in that scene too, so the origin maps directly.
        if (this.scene.location !== "greenhouse") return undefined;
        const origin = greenhousePotOrigin(Number(event.id));
        return { x: origin.x + 8, y: origin.bottom - 16 };
      }
      case "compost.collected":
      case "recipes.collected":
      case "processedResource.collected": {
        const name = (event.building ?? event.buildingName) as
          | keyof GameState["buildings"]
          | undefined;
        const building = (name ? (game.buildings[name] ?? []) : []).find(
          (item) => item.id === event.buildingId,
        );
        return building?.coordinates && gridToWorld(building.coordinates);
      }
      case "cropMachine.harvested": {
        const machine = (game.buildings["Crop Machine"] ?? []).find(
          (item) => item.id === event.machineId,
        );
        return machine?.coordinates && gridToWorld(machine.coordinates);
      }
      // Payload-less claims anchor to their (single) source building.
      case "crafting.collected":
        return this.firstBuilding(game, "Crafting Box");
      case "agingRack.collected":
      case "fermentation.collected":
      case "spiceRack.collected":
        return this.firstBuilding(game, "Aging Shed");
      default:
        return undefined;
    }
  }

  private firstBuilding(
    game: GameState,
    name: keyof GameState["buildings"],
  ): { x: number; y: number } | undefined {
    const placed = (game.buildings[name] ?? []).find(
      (item) => item.coordinates,
    );
    return placed?.coordinates && gridToWorld(placed.coordinates);
  }

  private onEvent(event: TrackedEvent) {
    const previous = this.prevInventory;
    const current = this.inventory();
    // Re-snapshot on EVERY event so a tracked claim's delta is exactly its
    // own change, not everything since the last claim.
    this.prevInventory = current;

    const at = this.positionFor(event);
    if (!at || !this.bridge.ui.get().showAnimations) return;

    const gains = getKeys(current)
      .map((name) => ({
        name,
        delta: (current[name] ?? new Decimal(0)).minus(
          previous[name] ?? new Decimal(0),
        ),
      }))
      .filter(({ delta }) => delta.greaterThan(0))
      .slice(0, MAX_ITEMS);

    gains.forEach(({ name, delta }, index) => {
      this.play({
        x: at.x + WORLD_TILE * 0.4,
        y: at.y - 2 - index * STACK_PX,
        amount: delta.toNumber(),
        icon: this.iconFor(name),
        iconWidth: 8,
        depth: at.y + 100_000 + index,
        durationMs: 2000,
      });
    });
  }

  private iconFor(name: InventoryItemName): string | undefined {
    return ITEM_DETAILS[name]?.image;
  }

  destroy() {
    this.unsubscribe();
    this.unsubscribeModal();
    this.deferred = [];
  }
}
