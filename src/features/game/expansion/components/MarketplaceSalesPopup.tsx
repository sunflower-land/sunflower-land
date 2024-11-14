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
import token from "assets/icons/sfl.webp";
import { formatNumber } from "lib/utils/formatNumber";
import { ITEM_DETAILS } from "features/game/types/images";
import { InventoryItemName } from "features/game/types/game";

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

  if (soldListingIds.length === 0) {
    return (
      <div>
        <Button onClick={() => gameService.send("RESET")}>
          {t("continue")}
        </Button>
      </div>
    );
  }

  const claimAll = () => {
    gameService.send("purchase.claimed", {
      tradeIds: soldListingIds,
    });

    if (soldListingIds.some((id) => trades.listings?.[id].signature)) {
      gameService.send("RESET");
    }

    gameService.send("CLOSE");
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
        {soldListingIds.map((listingId) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const listing = trades.listings![listingId];
          const itemName = getKeys(listing.items)[0];
          const amount = listing.items[itemName as InventoryItemName];
          const sfl = listing.sfl;
          return (
            <div className="flex flex-col space-y-1" key={listingId}>
              <div className="flex items-center justify-between">
                <div className="flex items-center w-3/4 space-x-2">
                  <Box
                    image={ITEM_DETAILS[itemName as InventoryItemName].image}
                  />
                  <div className="flex flex-col">
                    <div>
                      <p className="text-xs mt-0.5">{`${amount} x ${itemName}`}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <p className="text-xs mt-0.5">{`${formatNumber(sfl, {
                        decimalPlaces: 4,
                      })} SFL`}</p>
                      <img src={token} className="w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Button onClick={() => claimAll()}>{t("claim")}</Button>
    </>
  );
};
