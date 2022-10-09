import { Dimensions } from "./craftables";

export type DecorationName = "Dirt Path";

export const DECORATION_DIMENSIONS: Record<DecorationName, Dimensions> = {
  "Dirt Path": {
    height: 1,
    width: 1,
  },
};

type Decoration = {
  name: DecorationName;
  description: string;
};
export const DECORATIONS: Record<DecorationName, Decoration> = {
  "Dirt Path": {
    name: "Dirt Path",
    description: "Follow your chosen path!",
  },
};
