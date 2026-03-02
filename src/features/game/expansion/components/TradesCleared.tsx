import { useActor } from "@xstate/react";
import React, { useContext } from "react";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/decorations";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";
import trade from "assets/icons/trade.png";
import token from "assets/icons/flower_token.webp";
import { formatNumber } from "lib/utils/formatNumber";
import { InventoryItemName } from "features/game/types/game";
import { tradeToId } from "features/marketplace/lib/offers";
import { getTradeableDisplay } from "features/marketplace/lib/tradeables";

/**
 * When a trade has become inactive/cleared from the marketplace
 */
export const TradesCleared: React.FC = () => {
  const { gameService } = useContext(Context);
  const [state] = useActor(gameService);

  const { t } = useAppTranslation();

  const { trades } = state.context.state;

  const clearAll = () => {
    gameService.send({ type: "trades.cleared" });

    gameService.send({ type: "CLOSE" });
  };

  const clearedListings = getKeys(trades.listings ?? {}).filter(
    (id) => !!trades.listings?.[id].clearedAt,
  );

  const clearedOffers = getKeys(trades.offers ?? {}).filter(
    (id) => !!trades.offers?.[id].clearedAt,
  );

  return (
    <>
      <div className="p-1">
        <Label className="mb-2" type="danger" icon={trade}>
          {t("marketplace.tradesCleared")}
        </Label>
        <p className="text-xs mb-2">{t("marketplace.tradesCleared.message")}</p>
        {clearedListings.length > 0 && (
          <>
            <Label type="default">{t("marketplace.listings")}</Label>
            {clearedListings.map((listingId) => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const listing = trades.listings![listingId];
              const itemName = getKeys(listing.items)[0];
              const itemId = tradeToId({ details: listing });
              const details = getTradeableDisplay({
                id: itemId,
                type: listing.collection,
                state: state.context.state,
              });
              const amount = listing.items[itemName as InventoryItemName];

              return (
                <div className="flex flex-col space-y-1" key={listingId}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center w-3/4 space-x-2">
                      <Box image={details.image} />
                      <div className="flex flex-col">
                        <div>
                          <p className="text-xs mt-0.5">{`${amount} x ${itemName}`}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <p className="text-xs mt-0.5">{`${formatNumber(
                            listing.sfl,
                            {
                              decimalPlaces: 4,
                            },
                          )} FLOWER`}</p>
                          <img src={token} className="w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
        {clearedOffers.length > 0 && (
          <>
            <Label type="default">{t("marketplace.offers")}</Label>
            {clearedOffers.map((offerId) => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const offer = trades.offers![offerId];
              const itemName = getKeys(offer.items)[0];
              const itemId = tradeToId({ details: offer });
              const details = getTradeableDisplay({
                id: itemId,
                type: offer.collection,
                state: state.context.state,
              });
              const amount = offer.items[itemName as InventoryItemName];

              return (
                <div className="flex flex-col space-y-1" key={offerId}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center w-3/4 space-x-2">
                      <Box image={details.image} />
                      <div className="flex flex-col">
                        <div>
                          <p className="text-xs mt-0.5">{`${amount} x ${itemName}`}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <p className="text-xs mt-0.5">{`${formatNumber(
                            offer.sfl,
                            {
                              decimalPlaces: 4,
                            },
                          )} FLOWER`}</p>
                          <img src={token} className="w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
      <div className="flex space-x-1">
        <Button className="w-full" onClick={() => clearAll()}>
          {t("clear")}
        </Button>
      </div>
    </>
  );
};
