import auctionJson from "assets/map/auction.json";

import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";

const BUMPKINS: NPCBumpkin[] = [
  {
    x: 167,
    y: 126,
    npc: "hammerin' harry",
  },
];

export class AuctionScene extends BaseScene {
  roomId: RoomId = "auction_house";

  constructor() {
    super({ name: "auction_house", map: { json: auctionJson } });
  }

  preload() {
    super.preload();

    // Shut down the sound when the scene changes
    this.events.on("shutdown", () => {
      this.sound.getAllPlaying().forEach((sound) => {
        sound.destroy();
      });
    });
  }

  async create() {
    console.log("Create auction");
    this.map = this.make.tilemap({
      key: "auction-map",
    });
    console.log("Created auction");

    super.create();

    this.initialiseNPCs(BUMPKINS);
  }
}
