import React from "react";

import { Balance } from "./components/Balance";
import { Inventory } from "./components/Inventory";
import { AudioPlayer } from "components/ui/AudioPlayer";
import { BackButton } from "./components/BackButton";

/**
 * Heads up display - a concept used in games for the small overlayed display of information.
 * Balances, Inventory, actions etc.
 */
export const Hud: React.FC = () => {
  return (
    <div data-html2canvas-ignore="true" aria-label="Hud">
      <BackButton />
      <Balance />
      <Inventory />
      <AudioPlayer />
    </div>
  );
};
