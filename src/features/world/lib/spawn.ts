import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { RoomId } from "../roomMachine";

type SpawnLocation = Record<
  RoomId,
  { default: Coordinates } & Partial<Record<RoomId, Coordinates>>
>;

export const SPAWNS: SpawnLocation = {
  plaza: {
    default: {
      x: 420,
      y: 300,
    },
    windmill_floor: {
      x: 420,
      y: 167,
    },
    auction_house: {
      x: 600,
      y: 300,
    },
    bert_home: {
      x: 760,
      y: 120,
    },
    timmy_home: {
      x: 660,
      y: 110,
    },
    betty_home: {
      x: 583,
      y: 123,
    },
    decorations_shop: {
      x: 793,
      y: 287,
    },
    igor_home: {
      x: 250,
      y: 175,
    },
    clothes_shop: {
      x: 264,
      y: 300,
    },
    woodlands: {
      x: 867,
      y: 142,
    },
  },
  auction_house: {
    default: {
      x: 170,
      y: 242,
    },
  },
  bert_home: {
    default: {
      x: 75,
      y: 75,
    },
  },
  betty_home: {
    default: {
      x: 75,
      y: 75,
    },
  },
  clothes_shop: {
    default: {
      x: 144,
      y: 212,
    },
  },
  decorations_shop: {
    default: {
      x: 55,
      y: 157,
    },
  },
  igor_home: {
    default: {
      x: 75,
      y: 75,
    },
  },
  timmy_home: {
    default: {
      x: 75,
      y: 75,
    },
  },
  windmill_floor: {
    default: {
      x: 75,
      y: 75,
    },
  },
  woodlands: {
    default: {
      x: 10,
      y: 290,
    },
  },
};
