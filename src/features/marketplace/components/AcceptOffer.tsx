import React, { useContext, useState } from "react";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Offer } from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import walletIcon from "assets/icons/wallet.png";
import { useSelector } from "@xstate/react";
import { GameWallet } from "features/wallet/Wallet";
import { TradeableDisplay } from "../lib/tradeables";
import confetti from "canvas-confetti";
import {
  getBasketItems,
  getChestBuds,
  getChestItems,
} from "features/island/hud/components/inventory/utils/inventory";
import { KNOWN_ITEMS } from "features/game/types";
import { BumpkinItem, ITEM_NAMES } from "features/game/types/bumpkin";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import {
  BlockchainEvent,
  Context as ContextType,
  MachineState,
} from "features/game/lib/gameMachine";
import { useOnMachineTransition } from "lib/utils/hooks/useOnMachineTransition";
import { Context } from "features/game/GameProvider";
import { TradeableSummary } from "./TradeableSummary";
import { calculateTradePoints } from "features/game/events/landExpansion/addTradePoints";
import { InventoryItemName } from "features/game/types/game";
import Decimal from "decimal.js-light";
import { StoreOnChain } from "./StoreOnChain";

const _state = (state: MachineState) => state.context.state;

const AcceptOfferContent: React.FC<{
  onClose: () => void;
  authToken: string;
  display: TradeableDisplay;
  offer: Offer;
  itemId: number;
  onOfferAccepted: () => void;
}> = ({ onClose, display, itemId, authToken, offer, onOfferAccepted }) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const [needsSync, setNeedsSync] = useState(false);
  const { previousInventory, previousWardrobe, bertObsession, npcs } = state;

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
    if (offer.type === "onchain") {
      if (display.type === "collectibles") {
        const prevBal =
          previousInventory[display.name as InventoryItemName] ??
          new Decimal(0);

        if (prevBal.lt(offer.quantity)) {
          setNeedsSync(true);
          return;
        }
      }

      if (display.type === "wearables") {
        const prevBal = new Decimal(
          previousWardrobe[display.name as BumpkinItem] ?? 0,
        );

        if (prevBal.lt(offer.quantity)) {
          setNeedsSync(true);
          return;
        }
      }
    }

    gameService.send("marketplace.offerAccepted", {
      effect: {
        type: "marketplace.offerAccepted",
        id: offer.tradeId,
      },
      authToken,
    });

    onClose();
  };

  let hasItem = false;

  if (display.type === "collectibles") {
    const name = KNOWN_ITEMS[itemId];
    hasItem =
      !!getChestItems(state)[name]?.gte(offer.quantity) ||
      !!getBasketItems(state.inventory)[name]?.gte(offer.quantity);
  }

  if (display.type === "resources") {
    const name = KNOWN_ITEMS[itemId];
    hasItem = !!getBasketItems(state.inventory)[name]?.gte(offer.quantity);
  }

  if (display.type === "wearables") {
    const name = ITEM_NAMES[itemId];
    hasItem = !!availableWardrobe(state)[name];
  }

  if (display.type === "buds") {
    hasItem = !!getChestBuds(state)[itemId];
  }

  if (display.type === "resources") {
    const name = KNOWN_ITEMS[itemId];
    hasItem = !!getBasketItems(state.inventory)[name]?.gte(offer.quantity);
  }

  const estTradePoints =
    offer.sfl === 0
      ? 0
      : calculateTradePoints({
          sfl: offer.sfl,
          points: offer.type === "instant" ? 1 : 5,
        }).multipliedPoints;

  if (needsSync) {
    return (
      <StoreOnChain
        itemName={display.name}
        onClose={onClose}
        actionType="acceptOffer"
      />
    );
  }

  // Check if the item is a bert obsession and whether the bert obsession is completed
  const isItemBertObsession = bertObsession?.name === display.name;
  const obsessionCompletedAt = npcs?.bert?.questCompletedAt;
  const isBertsObesessionCompleted =
    !!obsessionCompletedAt &&
    bertObsession &&
    obsessionCompletedAt >= bertObsession.startDate &&
    obsessionCompletedAt <= bertObsession.endDate;

  const isResource = display.type === "resources";

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
        <TradeableSummary
          display={display}
          sfl={offer.sfl}
          quantity={offer.quantity}
          estTradePoints={estTradePoints}
        />
      </div>

      {!hasItem && (
        <Label type="danger" className="my-2">
          {`You do not have ${display.name}`}
        </Label>
      )}

      <div className="flex">
        <Button className="mr-1" onClick={() => onClose()}>
          {t("cancel")}
        </Button>
        <Button
          disabled={
            !hasItem ||
            (isItemBertObsession && isBertsObesessionCompleted && !isResource)
          }
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

export const AcceptOffer: React.FC<{
  onClose: () => void;
  authToken: string;
  display: TradeableDisplay;
  offer: Offer;
  itemId: number;
  onOfferAccepted: () => void;
}> = ({ onClose, authToken, display, offer, itemId, onOfferAccepted }) => {
  if (offer.type === "onchain") {
    return (
      <GameWallet action="marketplace">
        <AcceptOfferContent
          onClose={onClose}
          authToken={authToken}
          display={display}
          offer={offer}
          itemId={itemId}
          onOfferAccepted={onOfferAccepted}
        />
      </GameWallet>
    );
  }

  return (
    <AcceptOfferContent
      onClose={onClose}
      authToken={authToken}
      display={display}
      offer={offer}
      itemId={itemId}
      onOfferAccepted={onOfferAccepted}
    />
  );
};
