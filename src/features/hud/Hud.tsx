import React from "react";
import { metamask } from "lib/blockchain/metamask";

import { Balance } from "./components/Balance";
import { Inventory } from "./components/Inventory";
import { Menu } from "./components/Menu";
import { Address } from "./components/Address";
import { AudioPlayer } from "components/ui/AudioPlayer";

/**
 * Heads up display - a concept used in games for the small overlayed display of information.
 * Balances, Inventory, actions etc.
 */
export const Hud: React.FC = () => {
  return (
    <>
      <Menu/>
      <Balance/>
      <Inventory/>
      <AudioPlayer/>
      {metamask.myAccount && <Address />}
    </>
  );
};
