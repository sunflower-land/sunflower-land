import { SQUARE_WIDTH } from "features/game/lib/constants";
import { RoomId } from "../roomMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { Label } from "../containers/Label";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

const BUMPKINS: NPCBumpkin[] = [
  {
    x: 400,
    y: 400,
    npc: "pumpkin'pete",
  },
  {
    x: 625,
    y: 110,
    npc: "timmy",
  },
  {
    x: 313,
    y: 71,
    npc: "lily",
  },
  {
    x: 380,
    y: 130,
    npc: "igor",
  },
  {
    x: 760,
    y: 390,
    npc: "grimbly",
  },
  {
    x: 810,
    y: 380,
    npc: "grimtooth",
  },
  {
    x: 631,
    y: 422,
    npc: "craig",
  },
  {
    x: 120,
    y: 170,
    npc: "gabi",
  },
  {
    x: 480,
    y: 140,
    npc: "cornwell",
  },
  {
    x: 795,
    y: 118,
    npc: "bert",
  },
  {
    x: 513,
    y: 288,
    npc: "birdie",
  },
  {
    x: 33,
    y: 321,
    npc: "old salty",
  },
];
export class PlazaScene extends BaseScene {
  roomId: RoomId = "plaza";

  spawn: Coordinates = {
    x: 420,
    y: 167,
  };
  constructor() {
    super("plaza", {
      x: 420,
      y: 167,
    });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "main-map",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);

    const camera = this.cameras.main;

    camera.setBounds(0, 0, 55 * SQUARE_WIDTH, 32 * SQUARE_WIDTH);
    camera.setZoom(4);

    this.physics.world.setBounds(0, 0, 55 * SQUARE_WIDTH, 32 * SQUARE_WIDTH);

    const auctionLabel = new Label(this, "AUCTIONS", "brown");
    auctionLabel.setPosition(591, 260);
    this.add.existing(auctionLabel);

    const clotheShopLabel = new Label(this, "STYLIST", "brown");
    clotheShopLabel.setPosition(256, 264);
    this.add.existing(clotheShopLabel);

    const decorationShopLabel = new Label(this, "DECORATIONS", "brown");
    decorationShopLabel.setPosition(797, 252);
    this.add.existing(decorationShopLabel);
  }
}
