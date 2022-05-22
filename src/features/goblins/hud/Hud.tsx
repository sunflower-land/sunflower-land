import React, { useContext } from "react";

import { AudioPlayer } from "components/ui/AudioPlayer";
import { BackButton } from "./components/BackButton";

import { Context } from "features/game/GoblinProvider";
import { useActor } from "@xstate/react";
import { Balance } from "components/Balance";
import { Inventory } from "components/Inventory";

/**
 * Heads up display - a concept used in games for the small overlayed display of information.
 * Balances, Inventory, actions etc.
 */
export const Hud: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  return (
    <div data-html2canvas-ignore="true" aria-label="Hud">
      <BackButton />
      <Balance balance={goblinState.context.state.balance} />
      <Inventory inventory={goblinState.context.state.inventory} />
      <AudioPlayer />
    </div>
  );
};
