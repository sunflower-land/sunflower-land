import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";
import { getTradeableDisplay, TradeableDisplay } from "../lib/tradeables";
import { TradeableItemDetails } from "./TradeableSummary";
import { getListingCollection, getListingItem } from "../lib/listings";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import {
  MarketplaceTradeableName,
  TRADE_INITIATION_MS,
} from "features/game/types/marketplace";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { useNow } from "lib/utils/hooks/useNow";

const _trades = (state: MachineState) => state.context.state.trades;

interface Props {
  listingId: string;
  authToken: string;
  onClose: () => void;
}

const _state = (state: MachineState) => state.context.state;

export const RemoveListing: React.FC<Props> = ({
  listingId,
  onClose,
  authToken,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const now = useNow({ live: true });

  const trades = useSelector(gameService, _trades);
  const listings = trades.listings ?? {};

  const listing = listings[listingId];

  const initiatedAt = listing.initiatedAt;
  const isBeingPurchased =
    !!initiatedAt && now - initiatedAt < TRADE_INITIATION_MS;

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
  const display = getTradeableDisplay({ id: itemId, type: collection, state });

  if (isBeingPurchased) {
    return (
      <TradeInitiated
        initiatedAt={initiatedAt}
        display={display}
        quantity={
          listing.items[display.name as MarketplaceTradeableName] as number
        }
        sfl={listing.sfl}
      />
    );
  }

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

export const TradeInitiated: React.FC<{
  initiatedAt: number;
  display: TradeableDisplay;
  quantity: number;
  sfl: number;
}> = ({ initiatedAt, display, quantity, sfl }) => {
  const end = useCountdown(initiatedAt + TRADE_INITIATION_MS);
  const { t } = useAppTranslation();
  return (
    <Panel>
      <div className="p-2">
        <Label type="danger" className="mb-2">
          {t("marketplace.cancelListing")}
        </Label>
        <TradeableItemDetails display={display} sfl={sfl} quantity={quantity} />
      </div>
      <div className="p-2">
        <p className="text-sm mb-2">{t("marketplace.tradeInitiated")}</p>
        <TimerDisplay fontSize={24} time={end} />
      </div>
    </Panel>
  );
};
