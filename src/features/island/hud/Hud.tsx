import React, { useContext } from "react";

import { Balance } from "components/Balance";
import { Inventory } from "components/Inventory";
import { VisitBanner } from "../../../components/ui/VisitBanner";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { BumpkinHUD } from "./components/BumpkinHUD";

import disc from "assets/icons/disc.png";
import hammer from "assets/icons/hammer.png";
import { Label } from "components/ui/Label";
import { Menu } from "./components/Menu";

/**
 * Heads up display - a concept used in games for the small overlayed display of information.
 * Balances, Inventory, actions etc.
 */
export const Hud: React.FC = () => {
  const { gameService, shortcutItem } = useContext(Context);
  const [gameState] = useActor(gameService);

  const landId = gameState.context.state.id;

  return (
    <div data-html2canvas-ignore="true" aria-label="Hud">
      <Menu />

      <div className="fixed bottom-2 right-2 z-50 flex flex-col items-end ">
        <div className="relative w-14 h-14 flex items-center justify-center">
          <img src={disc} className="w-full absolute inset-0" />
          <img src={hammer} className="w-10 mb-1 z-10" />
        </div>
        <Label className="mt-1">Build</Label>
      </div>

      <BumpkinHUD />
      <Balance balance={gameState.context.state.balance} />
      <Inventory
        inventory={gameState.context.state.inventory}
        shortcutItem={shortcutItem}
        isFarming
      />
      {/* <AudioPlayer isFarming /> */}
      <VisitBanner id={landId} />
    </div>
  );
};
