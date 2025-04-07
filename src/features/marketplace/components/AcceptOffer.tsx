import React, { useContext } from "react";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Offer } from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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
import { ITEM_NAMES } from "features/game/types/bumpkin";
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
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";
import { hasFeatureAccess } from "lib/flags";
import { isFaceVerified } from "features/retreat/components/personhood/lib/faceRecognition";
import { FaceRecognition } from "features/retreat/components/personhood/FaceRecognition";
import { isTradeResource } from "features/game/actions/tradeLimits";
import { SUNNYSIDE } from "assets/sunnyside";
const _state = (state: MachineState) => state.context.state;
const _hasReputation = (state: MachineState) =>
  hasReputation({
    game: state.context.state,
    reputation: Reputation.Cropkeeper,
  });

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
  const { bertObsession, npcs } = state;
  const hasReputation = useSelector(gameService, _hasReputation);

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

  const estTradePoints =
    offer.sfl === 0
      ? 0
      : calculateTradePoints({
          sfl: offer.sfl,
          points: offer.type === "instant" ? 1 : 3,
        }).multipliedPoints;

  // Check if the item is a bert obsession and whether the bert obsession is completed
  const isItemBertObsession = bertObsession?.name === display.name;
  const obsessionCompletedAt = npcs?.bert?.questCompletedAt;
  const isBertsObesessionCompleted =
    !!obsessionCompletedAt &&
    bertObsession &&
    obsessionCompletedAt >= bertObsession.startDate &&
    obsessionCompletedAt <= bertObsession.endDate;

  const isResource = display.type === "resources";

  if (
    isTradeResource(display.name as InventoryItemName) &&
    hasFeatureAccess(state, "FACE_RECOGNITION") &&
    !isFaceVerified({ game: state })
  ) {
    return (
      <>
        <img
          src={SUNNYSIDE.icons.close}
          onClick={onClose}
          className="w-8 h-8 absolute -top-10 right-2 cursor-pointer"
        />
        <FaceRecognition />
      </>
    );
  }

  return (
    <>
      <div className="p-2">
        <div className="flex justify-between mb-2">
          <Label type="default" className="-ml-1">
            {t("marketplace.acceptOffer")}
          </Label>
          {!hasReputation && (
            <RequiredReputation reputation={Reputation.Cropkeeper} />
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
            !hasReputation ||
            !hasItem ||
            (isItemBertObsession && isBertsObesessionCompleted && !isResource)
          }
          onClick={() => confirm()}
          className="relative"
        >
          <span>{t("confirm")}</span>
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
