import React from "react";

import { Balance } from "./components/Balance";
import { Inventory } from "./components/Inventory";
import { Menu } from "./components/Menu";
import { Address } from "./components/Address";
import { AudioPlayer } from "components/ui/AudioPlayer";
import { ScreenshotButton } from "./components/ScreenshotButton";

/**
 * Heads up display - a concept used in games for the small overlayed display of information.
 * Balances, Inventory, actions etc.
 */
export const Hud: React.FC = () => {
  return (
    <>
      <Menu />
      <Balance />
      <Inventory />
      <ScreenshotButton />
      <AudioPlayer />
      <Address />
    </>
  );
};
