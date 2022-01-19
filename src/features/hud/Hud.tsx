import React from "react";

import { Balance } from "./components/Balance";
import { Inventory } from "./components/Inventory";
import { Menu } from "./components/Menu";
import { Address } from "./components/Address";

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
      {/* TODO: Pass actual address */}
      <Address address="0xc23Ea4b3fFA70DF89874ff65759031d78e40251d" />
    </>
  );
};
