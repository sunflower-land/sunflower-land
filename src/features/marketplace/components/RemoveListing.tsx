import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";
import { getTradeableDisplay } from "../lib/tradeables";
import { TradeableSummary } from "./TradeableSummary";
import { CollectionName } from "features/game/types/marketplace";
import { getListingItem } from "../lib/listings";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";

const _trades = (state: MachineState) => state.context.state.trades;

interface Props {
  listingId?: string;
  authToken: string;
  onClose: () => void;
  collection: CollectionName;
}
export const RemoveListing: React.FC<Props> = ({
  listingId,
  onClose,
  authToken,
  collection,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const trades = useSelector(gameService, _trades);
  const listings = trades.listings ?? {};

  if (!listingId) return null;
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
        <TradeableSummary display={display} sfl={listing.sfl} />
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
