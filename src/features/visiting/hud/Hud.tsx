import React, { useContext } from "react";

import { AudioPlayer } from "components/ui/AudioPlayer";
import { Menu } from "./components/Menu";
import { Context } from "features/game/VisitingProvider";
import { useActor } from "@xstate/react";
import { VisitBanner } from "components/ui/VisitBanner";
import { Inventory } from "components/Inventory";
import { Balance } from "components/Balance";

/**
 * Heads up display - a concept used in games for the small overlayed display of information.
 * Balances, Inventory, actions etc.
 */
export const Hud: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const visitingLandId = gameState.context.farmId;

  return (
    <div data-html2canvas-ignore="true" aria-label="Hud">
      <Menu />
      <Balance balance={gameState.context.state.balance} />
      <Inventory inventory={gameState.context.state.inventory} />
      <AudioPlayer isFarming />
      <VisitBanner id={visitingLandId} />
    </div>
  );
};
