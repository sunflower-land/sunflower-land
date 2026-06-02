import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import type { Tradeable, Listing } from "features/game/types/marketplace";
import { getTradeableDisplay } from "../lib/tradeables";
import { Context } from "features/game/GameProvider";
import { TradeableItemDetails } from "./TradeableSummary";
import { useSelector } from "@xstate/react";
import type { MachineState } from "features/game/lib/gameMachine";
import { calculateTradePoints } from "features/game/events/landExpansion/addTradePoints";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  MinigameCurrencyDisclaimerPanel,
  showsMinigameCurrencyDisclaimer,
} from "./MinigameCurrencyDisclaimerPanel";

type PurchaseModalContentProps = {
  authToken: string;
  listingId: string;
  tradeable: Tradeable;
  listing: Listing;
  price: number;
  onClose: () => void;
};

const _state = (state: MachineState) => state.context.state;

export const PurchaseModalContent: React.FC<PurchaseModalContentProps> = ({
  authToken,
  tradeable,
  price,
  listingId,
  onClose,
  listing,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const collection = tradeable.collection;
  const display = getTradeableDisplay({
    id: tradeable.id,
    type: collection,
    state,
  });

  const confirm = async () => {
    gameService.send("marketplace.listingPurchased", {
      effect: {
        type: "marketplace.listingPurchased",
        id: listingId,
      },
      authToken,
    });

    onClose();
  };

  const estTradePoints =
    price === 0
      ? 0
      : calculateTradePoints({
          sfl: price,
          points: listing.type === "instant" ? 2 : 4,
        }).multipliedPoints;

  return (
    <>
      <div className="p-2">
        <div className="flex justify-between">
          <Label type="default" className="mb-2 -ml-1">
            {t("marketplace.purchase")}
          </Label>
        </div>
        <p className="mb-3">{t("marketplace.areYouSureYouWantToBuy")}</p>
        <TradeableItemDetails
          display={display}
          sfl={price}
          quantity={listing.quantity}
          estTradePoints={estTradePoints}
        />
        {showsMinigameCurrencyDisclaimer(display.name) && (
          <MinigameCurrencyDisclaimerPanel className="mt-3" />
        )}
      </div>
      <div className="flex space-x-1">
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button onClick={() => confirm()} className="relative">
          <span>{t("confirm")}</span>
        </Button>
      </div>
    </>
  );
};
