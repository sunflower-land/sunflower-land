import React from "react";
import { DecorationName } from "features/game/types/decorations";
import { DirtPath } from "./components/DirtPath";
import { GameState } from "features/game/types/game";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

interface Prop {
  decorations: GameState["decorations"];
  name: DecorationName;
  id: string;
  coords: Coordinates;
}

const DECORATION_COMPONENTS: Record<
  DecorationName,
  React.FC<{ decorations: GameState["decorations"]; coords: Coordinates }>
> = {
  "Dirt Path": DirtPath,
};

export const Decoration: React.FC<Prop> = ({
  name,
  id,
  decorations,
  coords,
}) => {
  const Component = DECORATION_COMPONENTS[name];
  return <Component decorations={decorations} key={id} coords={coords} />;
};
