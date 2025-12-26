import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getTradeableDisplay } from "../lib/tradeables";
import { TradeableItemDetails } from "./TradeableSummary";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { Listing, MARKETPLACE_TAX, getResourceTax } from "features/game/types/marketplace";
import { getListingItem, getListingCollection } from "../lib/listings";
import Decimal from "decimal.js-light";
import { isTradeResource } from "features/game/actions/tradeLimits";
import { InventoryItemName } from "features/game/types/game";
import { formatNumber } from "lib/utils/formatNumber";

const _state = (state: MachineState) => state.context.state;

interface Props {
  listing: Listing;
  authToken: string;
  onClose: () => void;
}

export const DuplicateListing: React.FC<Props> = ({
  listing,
  onClose,
  authToken,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemId = getListingItem({ listing });
  const collection = getListingCollection({ listing });
  const display = getTradeableDisplay({ id: itemId, type: collection, state });
  
  const quantity = listing.quantity;
  const price = listing.sfl;
  
  const isResource = isTradeResource(display.name as InventoryItemName);
  
  let tax = new Decimal(price).mul(MARKETPLACE_TAX);
  if (isResource) {
    tax = getResourceTax({ game: state }).mul(price);
  }

  const confirm = () => {
    setIsSubmitting(true);
    gameService.send("marketplace.listed", {
      effect: {
        type: "marketplace.listed",
        itemId,
        collection,
        sfl: price,
        quantity,
      },
      authToken,
    });
    onClose();
  };

  return (
    <Panel>
      <div className="p-2">
        <Label type="default" className="mb-2">
          {t("marketplace.duplicateListing")}
        </Label>
        <p className="text-sm mb-2">
          {t("marketplace.duplicateListing.confirm")}
        </p>
        <TradeableItemDetails
          display={display}
          sfl={price}
          quantity={quantity}
        />
        <div className="flex justify-between mt-2 border-t border-brown-300 pt-2">
            <span className="text-xs">{t("bumpkinTrade.tradingFee")}</span>
            <span className="text-xs">{`${formatNumber(tax, { decimalPlaces: 4 })} FLOWER`}</span>
        </div>
        <div className="flex justify-between">
            <span className="text-xs">{t("bumpkinTrade.youWillReceive")}</span>
            <span className="text-xs">{`${formatNumber(new Decimal(price).minus(tax), { decimalPlaces: 4 })} FLOWER`}</span>
        </div>
      </div>
      <div className="flex">
        <Button className="mr-1" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button onClick={confirm} disabled={isSubmitting}>
            {t("confirm")}
        </Button>
      </div>
    </Panel>
  );
};
