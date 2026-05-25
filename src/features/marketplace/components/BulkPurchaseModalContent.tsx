import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import type { Tradeable } from "features/game/types/marketplace";
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

type BulkPurchaseModalContentProps = {
  authToken: string;
  listingIds: string[];
  tradeable: Tradeable;
  quantity: number;
  price: number;
  onClose: () => void;
};

const _state = (state: MachineState) => state.context.state;

export const BulkPurchaseModalContent: React.FC<
  BulkPurchaseModalContentProps
> = ({ authToken, tradeable, quantity, price, listingIds, onClose }) => {
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
    gameService.send("marketplace.buyBulkResources", {
      effect: {
        type: "marketplace.buyBulkResources",
        itemId: tradeable.id,
        listingIds,
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
          points: 2,
        }).multipliedPoints;

  return (
    <>
      <div className="p-2">
        <div className="flex justify-between">
          <Label type="default" className="mb-2 -ml-1">{`Purchase`}</Label>
        </div>
        <p className="mb-3">{t("marketplace.areYouSureBulkBuy")}</p>
        <TradeableItemDetails
          display={display}
          sfl={price}
          quantity={quantity}
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
