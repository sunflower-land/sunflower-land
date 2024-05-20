// Imports - there's probably a better way to do this
import beach_umbrella from "assets/portal/props/beach_umbrella.webp";
import black_bottle from "assets/portal/props/black_bottle.webp";
import blue_bottle from "assets/portal/props/blue_bottle.webp";
import bonnies_tombstone from "assets/portal/props/bonnies_tombstone.png";
import bucket from "assets/portal/props/bucket.png";
import bumpkins_banner from "assets/portal/props/bumpkins_banner.webp";
import bush from "assets/portal/props/bush.png";
import field_maple from "assets/portal/props/field_maple.webp";
import goblins_banner from "assets/portal/props/goblins_banner.webp";
import golden_maple from "assets/portal/props/golden_maple.webp";
import mailbox from "assets/portal/props/mailbox.png";
import nightshades_banner from "assets/portal/props/nightshades_banner.webp";
import pine_tree from "assets/portal/props/pine_tree.png";
import sunflorians_banner from "assets/portal/props/sunflorians_banner.webp";
import woodsign from "assets/portal/props/woodsign.png";

// Export PORTAL_PROPS
export type PortalPropsT = {
  type: string;
  id: string;
  size: { w: number; h: number };
  image?: string;
  x?: number;
  y?: number;
};

export const PORTAL_PROPS: PortalPropsT[] = [
  {
    type: "decorations",
    id: "beach_umbrella",
    size: { w: 32, h: 32 },
    image: beach_umbrella,
  },
  {
    type: "decorations",
    id: "black_bottle",
    size: { w: 16, h: 16 },
    image: black_bottle,
  },
  {
    type: "decorations",
    id: "blue_bottle",
    size: { w: 16, h: 16 },
    image: blue_bottle,
  },
  {
    type: "decorations",
    id: "bonnies_tombstone",
    size: { w: 16, h: 16 },
    image: bonnies_tombstone,
  },
  {
    type: "decorations",
    id: "bucket",
    size: { w: 16, h: 16 },
    image: bucket,
  },
  {
    type: "decorations",
    id: "bumpkins_banner",
    size: { w: 16, h: 32 },
    image: bumpkins_banner,
  },
  {
    type: "decorations",
    id: "bush",
    size: { w: 32, h: 32 },
    image: bush,
  },
  {
    type: "decorations",
    id: "field_maple",
    size: { w: 32, h: 32 },
    image: field_maple,
  },
  {
    type: "decorations",
    id: "goblins_banner",
    size: { w: 16, h: 32 },
    image: goblins_banner,
  },
  {
    type: "decorations",
    id: "golden_maple",
    size: { w: 32, h: 32 },
    image: golden_maple,
  },
  {
    type: "decorations",
    id: "mailbox",
    size: { w: 16, h: 16 },
    image: mailbox,
  },
  {
    type: "decorations",
    id: "nightshades_banner",
    size: { w: 16, h: 32 },
    image: nightshades_banner,
  },
  {
    type: "decorations",
    id: "pine_tree",
    size: { w: 32, h: 32 },
    image: pine_tree,
  },
  {
    type: "decorations",
    id: "sunflorians_banner",
    size: { w: 16, h: 32 },
    image: sunflorians_banner,
  },
  {
    type: "decorations",
    id: "woodsign",
    size: { w: 32, h: 16 },
    image: woodsign,
  },
];
