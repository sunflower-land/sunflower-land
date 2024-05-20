import Phaser from "phaser";

import { SceneId } from "../mmoMachine";
import { BaseScene } from "./BaseScene";
import { PlazaRoomState } from "../types/Room";
import { Room } from "colyseus.js";

// Props
import { PORTAL_PROPS, PortalPropsT } from "../lib/props";

// Maps
import Island1 from "assets/map/portal/island_1.json";
import Island2 from "assets/map/portal/island_2.json";
import Island3 from "assets/map/portal/island_3.json";
import Island4 from "assets/map/portal/island_4.json";

const MAPS = {
  island_1: Island1,
  island_2: Island2,
  island_3: Island3,
  island_4: Island4,
};

export class PortalScene extends BaseScene {
  sceneId: SceneId = "portal";

  buildModeGrid: Phaser.GameObjects.Grid | undefined;

  selectedProp: PortalPropsT | undefined;
  propPreview: Phaser.GameObjects.Image | undefined;

  placedProps: PortalPropsT[] = [];

  // Server Listeners
  serverListeners = {
    prop_placed: (data: { id: string; x: number; y: number }) => {
      this.placeProp(data.id, data.x, data.y, true);
    },
    prop_removed: (data: { x: number; y: number }) => {
      this.removeProp(data.x, data.y, true);
    },
  };

  constructor({ mmoServer }: { mmoServer: Room<PlazaRoomState> | undefined }) {
    const PortalMap = MAPS[mmoServer?.state.metadata?.map || "island_1"];

    super({
      name: "portal",
      map: { json: PortalMap },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  // Preload
  preload(): void {
    super.preload();

    if (!this.sound.get("nature_1")) {
      const nature1 = this.sound.add("nature_1");
      nature1.play({ loop: true, volume: 0.01 });
    }

    this.events.once("shutdown", () => {
      this.sound.getAllPlaying().forEach((sound) => sound.destroy());
    });
  }

  // Asynchronous Create
  async create(): Promise<void> {
    super.create();

    try {
      // Preload all Portal props
      await this.preloadProps();

      // Place any props that are already in the state
      this.mmoServer?.state.props?.forEach((prop) => {
        if (!prop.x || !prop.y) return;

        this.placeProp(prop.id, prop.x, prop.y, true);
      });

      // Server Listeners
      this.setupServerListeners();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error while loading Portal", error);
    }

    // DEBUG - Display Debug Graphics
    this.physics.world.createDebugGraphic();
  }

  // Update
  update(): void {
    super.update();

    // Prop Preview
    this.updatePropPreview();
  }

  // Props Preloading
  async preloadProps(): Promise<void> {
    await Promise.all(
      PORTAL_PROPS.map(async (prop) => {
        this.load.image(prop.id, prop.image);
      })
    );
  }

  // Setup Server Listeners
  setupServerListeners(): void {
    if (!this.mmoServer) return;

    this.mmoServer.onMessage("prop_placed", (data) => {
      this.serverListeners.prop_placed(data);
    });

    this.mmoServer.onMessage("prop_removed", (data) => {
      this.serverListeners.prop_removed(data);
    });
  }

  // Place Prop
  placeProp(id: string, x: number, y: number, server: boolean): void {
    const Prop = PORTAL_PROPS.find((prop) => prop.id === id);

    if (!Prop) throw new Error(`Prop not found: ${id}`);

    if (this.placedProps.find((p) => p.x === x && p.y === y))
      throw new Error(`Prop already placed at ${x}, ${y}`);

    this.placedProps.push({ ...Prop, x, y });

    // Transfrom cell position to map position and place the prop
    const propX = x * 16 + 8;
    const propY = y * 16 + 8;
    const prop = this.add.image(propX, propY, id).setDepth(y * 16);

    // Enable physics & add collider
    this.physics.world.enable(prop);
    this.colliders?.add(prop);

    (prop.body as Phaser.Physics.Arcade.Body)
      .setSize(Prop.size.w, Prop.size.h)
      .setOffset(0, 0)
      .setImmovable(true)
      .setCollideWorldBounds(true);

    // Send place event to server
    if (this.mmoServer && !server) {
      this.mmoServer.send("prop_placed", { id, x, y });
    }
  }

  // Remove Prop
  removeProp(x: number, y: number, server: boolean): void {
    const prop = this.placedProps.find((p) => p.x === x && p.y === y);

    if (!prop) return;

    this.placedProps = this.placedProps.filter((p) => p.x !== x || p.y !== y);

    // Destroy the prop
    // TODO

    // Send remove event to server
    if (this.mmoServer && !server) {
      this.mmoServer.send("prop_removed", { x, y });
    }
  }

  // Prop Preview
  updatePropPreview(): void {
    if (this.buildModeGrid && this.selectedProp) {
      // Destroy the preview if it exists
      if (this.propPreview) {
        this.propPreview.destroy();
        this.propPreview = undefined;
      }

      // Create the preview
      const activePointer = this.input.activePointer;
      const { x, y } = this.getCellPosition(
        activePointer.worldX,
        activePointer.worldY
      );

      const propX = x * 16 + 8;
      const propY = y * 16 + 8;

      const propExists = this.placedProps.find((p) => p.x === x && p.y === y);

      // If the prop already exists, show a red preview
      if (propExists) {
        this.propPreview = this.add
          .image(propX, propY, this.selectedProp.id)
          .setTint(0xff0000);
      } else {
        this.propPreview = this.add.image(propX, propY, this.selectedProp.id);
      }
    }
  }

  // Convert map position to cell position
  getCellPosition(x: number, y: number): { x: number; y: number } {
    return {
      x: Math.floor(x / 16),
      y: Math.floor(y / 16),
    };
  }

  // Create Build Mode Grid
  createBuildModeGrid(): void {
    const { widthInPixels, heightInPixels } = this.map;

    this.buildModeGrid = this.add.grid(
      widthInPixels / 2,
      heightInPixels / 2,
      widthInPixels,
      heightInPixels,
      16,
      16,
      0x000000,
      0,
      0x000000,
      0.1
    );

    this.buildModeGrid.setOrigin(0.5, 0.5);
    this.buildModeGrid.setDepth(1000000000);
    this.buildModeGrid.setInteractive();

    // OnClick -> Place Prop
    this.buildModeGrid.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (!this.selectedProp) return;

      // Very Important - Use worldX and worldY instead of x and y
      const { x, y } = this.getCellPosition(pointer.worldX, pointer.worldY);

      this.placeProp(this.selectedProp.id, x, y, false);
    });
  }

  // Toggle Build Mode
  public toggleBuildMode(): void {
    if (this.buildModeGrid) {
      // Destroy the grid
      this.buildModeGrid.destroy();
      this.buildModeGrid = undefined;

      // Destroy the prop preview
      if (this.propPreview) {
        this.propPreview.destroy();
        this.propPreview = undefined;
      }

      // Clear the selected prop
      this.selectedProp = undefined;

      return;
    }

    this.createBuildModeGrid();
  }

  // Select an Object (will be called from the UI)
  public selectObject(obj: PortalPropsT): void {
    this.selectedProp = obj;
  }
}
