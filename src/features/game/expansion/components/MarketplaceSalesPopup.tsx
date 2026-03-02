import { useActor } from "@xstate/react";
import React, { useContext } from "react";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/decorations";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InlineDialogue } from "features/world/ui/TypingMessage";
import { Box } from "components/ui/Box";
import trade from "assets/icons/trade.png";
import token from "assets/icons/flower_token.webp";
import { formatNumber } from "lib/utils/formatNumber";
import { InventoryItemName } from "features/game/types/game";
import { tradeToId } from "features/marketplace/lib/offers";
import { getTradeableDisplay } from "features/marketplace/lib/tradeables";
import Decimal from "decimal.js-light";
import { MARKETPLACE_TAX } from "features/game/types/marketplace";
import { calculateTradePoints } from "features/game/events/landExpansion/addTradePoints";
import { ITEM_DETAILS } from "features/game/types/images";
import { isTradeResource } from "features/game/actions/tradeLimits";
import { KNOWN_ITEMS } from "features/game/types";

/**
 * Display listings that have been fulfilled
 */
export const MarketplaceSalesPopup: React.FC = () => {
  const { gameService } = useContext(Context);
  const [state] = useActor(gameService);

  const { t } = useAppTranslation();

  const { trades } = state.context.state;
  const soldListingIds = getKeys(trades.listings ?? {}).filter(
    (id) => !!trades.listings?.[id].fulfilledAt,
  );

  if (soldListingIds.length === 0) return null;

  const claimAll = () => {
    gameService.send({ type: "purchase.claimed", tradeIds: soldListingIds });

    if (soldListingIds.some((id) => trades.listings?.[id].signature)) {
      gameService.send({ type: "RESET" });
      return;
    }

    gameService.send({ type: "CLOSE" });
  };

  return (
    <>
      <div className="p-1">
        <Label className="ml-2 mb-2 mt-1" type="success" icon={trade}>
          {t("marketplace.itemSold")}
        </Label>
        <div className="mb-2 ml-1">
          <InlineDialogue message={t("marketplace.youHaveHadSales")} />
        </div>
        <div className="max-h-[450px] overflow-y-auto scrollable">
          {soldListingIds.map((listingId) => {
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

            const tax = listing.tax ?? listing.sfl * MARKETPLACE_TAX;
            const sfl = new Decimal(listing.sfl).sub(tax);
            const estTradePoints = calculateTradePoints({
              sfl: listing.sfl,
              points: !listing.signature ? 1 : 3,
            }).multipliedPoints;

            const isResource = isTradeResource(KNOWN_ITEMS[Number(itemId)]);

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
                        <p className="text-xs mt-0.5">{`${formatNumber(sfl, {
                          decimalPlaces: 4,
                        })} FLOWER`}</p>
                        <img src={token} className="w-4" />
                      </div>
                      {!isResource && (
                        <div className="flex items-center">
                          <span className="text-xs">
                            {`${formatNumber(estTradePoints, {
                              decimalPlaces: 2,
                            })} Trade Points`}
                          </span>
                          <img
                            src={ITEM_DETAILS["Trade Point"].image}
                            className="h-6 ml-1"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex space-x-1">
        <Button
          className="w-full"
          onClick={() => gameService.send({ type: "CLOSE" })}
        >
          {t("close")}
        </Button>
        <Button className="w-full" onClick={() => claimAll()}>
          {t("claim")}
        </Button>
      </div>
    </>
  );
};
