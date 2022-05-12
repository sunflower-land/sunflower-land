import React from "react";

import { Balance } from "./components/Balance";
import { Inventory } from "./components/Inventory";
import { VisitBanner } from "./components/VisitBanner";
import { AudioPlayer } from "components/ui/AudioPlayer";
import { Menu } from "./components/Menu";

/**
 * Heads up display - a concept used in games for the small overlayed display of information.
 * Balances, Inventory, actions etc.
 */
export const Hud: React.FC = () => {
  return (
    <div data-html2canvas-ignore="true" aria-label="Hud">
      <Menu />
      <Balance />
      <Inventory />
      <AudioPlayer isFarming />
      <VisitBanner />
    </div>
  );
};
