import healthy_tadpole from "../assets/tadpoles/healthy.gif";
import chipped_tadpole from "../assets/tadpoles/chipped.gif";
import cracked_tadpole from "../assets/tadpoles/cracked.gif";
import damaged_tadpole from "../assets/tadpoles/damaged.gif";
import dying_tadpole from "../assets/tadpoles/dying.gif";
import empty_incubator from "../assets/incubator/empty-big.gif";
import incubator from "../assets/incubator/algae-big.gif";

import { InventoryItemName } from "./community";

type ItemDetails = {
  description: string;
  image: any;
};

export type Items = Record<InventoryItemName, ItemDetails>;

export const ITEM_DETAILS: Items = {
  healthy: {
    description: "A healthy tadpole.",
    image: healthy_tadpole,
  },
  chipped: {
    description: "A chipped tadpole.",
    image: chipped_tadpole,
  },
  cracked: {
    description: "A cracked tadpole.",
    image: cracked_tadpole,
  },
  damaged: {
    description: "A damaged tadpole.",
    image: damaged_tadpole,
  },
  dying: {
    description: "A dying tadpole.",
    image: dying_tadpole,
  },
  empty: {
    description: "An empty incubator.",
    image: empty_incubator,
  },
  active: {
    description: "An occupied incubator.",
    image: incubator,
  },
};
