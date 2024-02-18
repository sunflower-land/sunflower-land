import React, { useContext, useLayoutEffect } from "react";

import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { GoblinProvider } from "features/game/GoblinProvider";

import { Game } from "./Game";
import { Context, GameProvider } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { Loading } from "features/auth/components";
import { Wallet } from "features/wallet/Wallet";
import { Ocean } from "features/world/ui/Ocean";

const GoblinRetreat: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  if (!gameState.context.farmAddress) {
    return (
      <Ocean>
        {/* <GameBoard /> */}
        <Modal show backdrop={false}>
          <Panel>
            <Loading />
          </Panel>
        </Modal>
      </Ocean>
    );
  }

  return (
    <Ocean>
      <Wallet
        action="withdraw"
        id={gameState.context.farmId}
        linkedAddress={gameState.context.linkedWallet}
        wallet={gameState.context.wallet}
        farmAddress={gameState.context.farmAddress}
        wrapper={({ children }) => (
          <Modal show>
            <Panel>{children}</Panel>
          </Modal>
        )}
      >
        <GoblinProvider
          farmAddress={gameState.context.farmAddress}
          farmId={gameState.context.farmId}
        >
          <Game />
        </GoblinProvider>
      </Wallet>
    </Ocean>
  );
};

export const Retreat: React.FC = () => {
  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    // Start with island
    scrollIntoView(Section.RetreatBackground, "auto");
  }, []);

  // Load data
  return (
    <GameProvider>
      <GoblinRetreat />
    </GameProvider>
  );
};
