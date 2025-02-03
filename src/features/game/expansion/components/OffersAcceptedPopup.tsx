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
import { InventoryItemName } from "features/game/types/game";
import { tradeToId } from "features/marketplace/lib/offers";
import { getTradeableDisplay } from "features/marketplace/lib/tradeables";
import Decimal from "decimal.js-light";
import { ITEM_DETAILS } from "features/game/types/images";
import { calculateTradePoints } from "features/game/events/landExpansion/addTradePoints";
import { isTradeResource } from "features/game/actions/tradeLimits";
import { KNOWN_ITEMS } from "features/game/types";

/**
 * Display listings that have been fulfilled
 */
export const OffersAcceptedPopup: React.FC = () => {
  const { gameService } = useContext(Context);
  const [state] = useActor(gameService);

  const { t } = useAppTranslation();

  const { trades } = state.context.state;
  const offersAcceptedIds = getKeys(trades.offers ?? {}).filter(
    (id) => !!trades.offers?.[id].fulfilledAt,
  );

  if (offersAcceptedIds.length === 0) return null;

  const claimAll = () => {
    gameService.send("offer.claimed", {
      tradeIds: offersAcceptedIds,
    });

    if (offersAcceptedIds.some((id) => trades.offers?.[id].signature)) {
      gameService.send("RESET");
    }

    gameService.send("CLOSE");
  };

  return (
    <>
      <div className="p-1">
        <Label className="ml-2 mb-2 mt-1" type="success" icon={trade}>
          {t("marketplace.offerAccepted")}
        </Label>
        <div className="mb-2 ml-1">
          <InlineDialogue message={t("marketplace.offersWereAccepted")} />
        </div>
        {offersAcceptedIds.map((listingId) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const offer = trades.offers![listingId];
          const itemName = getKeys(offer.items)[0];
          const itemId = tradeToId({ details: offer });
          const details = getTradeableDisplay({
            id: itemId,
            type: offer.collection,
            state: state.context.state,
          });
          const amount = offer.items[itemName as InventoryItemName];
          const sfl = new Decimal(offer.sfl);
          const estTradePoints = calculateTradePoints({
            sfl: offer.sfl,
            points: !offer.signature ? 2 : 4,
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
                      })} SFL`}</p>
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
      <div className="flex space-x-1">
        <Button className="w-full" onClick={() => gameService.send("CLOSE")}>
          {t("close")}
        </Button>
        <Button className="w-full" onClick={() => claimAll()}>
          {t("claim")}
        </Button>
      </div>
    </>
  );
};
