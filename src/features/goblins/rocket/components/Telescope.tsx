import React from "react";
import { Inventory } from "features/game/types/game";

interface Props {
  onCraft: () => void;
  inventory: Inventory;
}

// TODO - Use this component for minting the telescope. See old "EngineCore.tsx" for inspiration.
export const Telescope: React.FC<Props> = ({ onCraft, inventory }) => {
  return null;
};
