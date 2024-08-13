import React, { useContext, useEffect } from "react";
import { Modal } from "components/ui/Modal";

import { useActor, useInterpret } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  MachineInterpreter,
  createAuctioneerMachine,
} from "features/game/lib/auctionMachine";
import { GameState } from "features/game/types/game";
import * as AuthProvider from "features/auth/lib/Provider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { VIPAccess } from "features/game/components/VipAccess";
import { Loading } from "features/auth/components";

interface Props {
  gameState: GameState;
  farmId: number;
}

export const AuctionSummary: React.FC<Props> = ({ farmId, gameState }) => {
  const { t } = useAppTranslation();
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const auctionService = useInterpret(
    createAuctioneerMachine({ onUpdate: console.log }),
    {
      context: {
        farmId: farmId,
        token: authState.context.user.rawToken,
        bid: gameState.auctioneer.bid,
        deviceTrackerId: "0x",
        canAccess: true,
        linkedAddress: "0x",
      },
    },
  ) as unknown as MachineInterpreter;

  const [auctioneerState] = useActor(auctionService);

  useEffect(() => {
    auctionService.send("OPEN", { gameState });
  }, []);

  if (auctioneerState.matches("idle")) {
    return null;
  }

  if (auctioneerState.matches("loading")) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col">
      {JSON.stringify({ auctions: auctioneerState.context.auctions })}
    </div>
  );
};
