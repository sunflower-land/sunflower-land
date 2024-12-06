import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";
import { getTradeableDisplay } from "../lib/tradeables";
import { TradeableItemDetails } from "./TradeableSummary";
import { getListingCollection, getListingItem } from "../lib/listings";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { MarketplaceTradeableName } from "features/game/types/marketplace";

const _trades = (state: MachineState) => state.context.state.trades;

interface Props {
  listingId: string;
  authToken: string;
  onClose: () => void;
}

export const RemoveListing: React.FC<Props> = ({
  listingId,
  onClose,
  authToken,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const trades = useSelector(gameService, _trades);
  const listings = trades.listings ?? {};

  const listing = listings[listingId];

  const confirm = async () => {
    gameService.send("marketplace.listingCancelled", {
      effect: {
        type: "marketplace.listingCancelled",
        id: listingId,
      },
      authToken,
    });

    onClose();
  };

  const itemId = getListingItem({ listing });
  const collection = getListingCollection({ listing });
  const display = getTradeableDisplay({ id: itemId, type: collection });

  return (
    <Panel>
      <div className="p-2">
        <Label type="danger" className="mb-2">
          {t("marketplace.cancelListing")}
        </Label>
        <p className="text-sm mb-2">
          {t("marketplace.cancelListing.areYouSure")}
        </p>
        <TradeableItemDetails
          display={display}
          sfl={listing.sfl}
          quantity={
            listing.items[display.name as MarketplaceTradeableName] as number
          }
        />
      </div>
      <div className="flex">
        <Button className="mr-1" onClick={onClose}>
          {t("no")}
        </Button>
        <Button onClick={confirm}>{t("yes")}</Button>
      </div>
    </Panel>
  );
};
