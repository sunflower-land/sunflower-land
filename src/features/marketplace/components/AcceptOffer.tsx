import React, { useContext } from "react";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Offer, TradeableDetails } from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import walletIcon from "assets/icons/wallet.png";
import { useActor } from "@xstate/react";
import { GameWallet } from "features/wallet/Wallet";
import { TradeableDisplay } from "../lib/tradeables";
import confetti from "canvas-confetti";
import {
  getChestBuds,
  getChestItems,
} from "features/island/hud/components/inventory/utils/inventory";
import { KNOWN_ITEMS } from "features/game/types";
import { ITEM_NAMES } from "features/game/types/bumpkin";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import {
  BlockchainEvent,
  Context as ContextType,
} from "features/game/lib/gameMachine";
import { useOnMachineTransition } from "lib/utils/hooks/useOnMachineTransition";
import { Context } from "features/game/GameProvider";
import { TradeableSummary } from "./TradeableSummary";

export const AcceptOffer: React.FC<{
  onClose: () => void;
  tradeable?: TradeableDetails;
  authToken: string;
  display: TradeableDisplay;
  offer: Offer;
  id: number;
  onOfferAccepted: () => void;
}> = ({
  onClose,
  tradeable,
  display,
  id,
  authToken,
  offer,
  onOfferAccepted,
}) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplaceAcceptingSuccess",
    "playing",
    onOfferAccepted,
  );

  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplaceAccepting",
    "marketplaceAcceptingSuccess",
    confetti,
  );

  const confirm = async () => {
    gameService.send("marketplace.offerAccepted", {
      effect: {
        type: "marketplace.offerAccepted",
        id: offer.tradeId,
      },
      authToken,
    });

    onClose();
  };

  // if (gameState.context.state.transaction && tradeable?.type === "onchain") {
  //   return <Transaction isBlocked />;
  // }

  const game = gameState.context.state;

  let hasItem = false;

  if (display.type === "collectibles") {
    const name = KNOWN_ITEMS[tradeable?.id as number];
    hasItem = !!getChestItems(game)[name]?.gte(1);
  }

  if (display.type === "wearables") {
    const name = ITEM_NAMES[tradeable?.id as number];
    hasItem = !!availableWardrobe(game)[name];
  }

  if (display.type === "buds") {
    hasItem = !!getChestBuds(game)[tradeable?.id as number];
  }

  const Content = () => {
    return (
      <>
        <div className="p-2">
          <div className="flex justify-between mb-2">
            <Label type="default" className="-ml-1">
              {t("marketplace.acceptOffer")}
            </Label>
            {offer.type === "onchain" && (
              <Label type="formula" icon={walletIcon} className="-mr-1">
                {t("marketplace.walletRequired")}
              </Label>
            )}
          </div>
          <TradeableSummary display={display} sfl={offer.sfl} />
        </div>

        {!hasItem && (
          <Label
            type="danger"
            className="my-2"
          >{`You do not have ${display.name}`}</Label>
        )}

        <div className="flex">
          <Button className="mr-1" onClick={() => onClose()}>
            {t("cancel")}
          </Button>
          <Button
            disabled={!hasItem}
            onClick={() => confirm()}
            className="relative"
          >
            <span>{t("confirm")}</span>
            {offer.type === "onchain" && (
              <img src={walletIcon} className="absolute right-1 top-0.5 h-7" />
            )}
          </Button>
        </div>
      </>
    );
  };

  if (offer.type === "onchain") {
    return (
      <GameWallet action="marketplace">
        <Content />
      </GameWallet>
    );
  }

  return <Content />;
};
