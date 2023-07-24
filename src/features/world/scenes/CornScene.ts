import cornExampleJSON from "assets/map/corn_example.json";
import { mazeManager } from "features/world/ui/MazeHud";

import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { CONFIG } from "lib/config";

const BUMPKINS: NPCBumpkin[] = [
  {
    x: 112,
    y: 60,
    npc: "frankie",
  },
];

export class CornScene extends BaseScene {
  roomId: RoomId = "corn_example";
  score = 0;
  health = 3;

  constructor() {
    super({
      name: "corn_example",
      map: {
        json: CONFIG.API_URL ? `${CONFIG.API_URL}/maps/corn` : cornExampleJSON,
      },
    });
  }

  preload() {
    super.preload();

    this.load.image("corn", "world/dawn_flower.png");
  }

  async create() {
    console.log("Create corn example");
    this.map = this.make.tilemap({
      key: "corn_example",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);

    // Get x,y coordinates of

    const cornLayer = this.map.getLayer("Corn");
    if (cornLayer) {
      // Access the tile data from the layer
      const tileData = cornLayer.data;

      // Assuming the tilemap has a fixed tile width and height
      const tileWidth = this.map.tileWidth;
      const tileHeight = this.map.tileHeight;

      // Now, you can iterate through the tile data and get the positions of the sprites
      for (let y = 0; y < this.map.height; y++) {
        for (let x = 0; x < this.map.width; x++) {
          const tile = tileData[y][x];
          if (tile.index !== -1) {
            // 'tile' represents each tile in the layer

            // Access the position of the sprite
            const spriteX = x * tileWidth + tileWidth / 2;
            const spriteY = y * tileHeight + tileHeight / 2;

            // Now you have the position of the sprite at (spriteX, spriteY)
            // You can use this information to create or manipulate sprites as needed
            // render dawn_flower.png at spriteX, spriteY
            const corn = this.physics.add.sprite(spriteX, spriteY, "corn");
            // on collision with player, collect corn
            if (this.currentPlayer) {
              this.physics.add.overlap(this.currentPlayer, corn, () => {
                this.collect(`${spriteX}-${spriteY}`);
                corn.destroy();
              });
            }
          }
        }
      }
    }
  }

  collect(id: string) {
    mazeManager.collect(id);
  }
}
