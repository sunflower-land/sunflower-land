import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import React, { useContext, useState } from "react";

import trade from "assets/icons/trade.png";

import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { getKeys } from "features/game/types/decorations";
import { getCollectionName, getTradeableDisplay } from "../../lib/tradeables";
import { KNOWN_IDS } from "features/game/types";
import { ListViewCard } from "../ListViewCard";
import Decimal from "decimal.js-light";
import { useNavigate } from "react-router-dom";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { InventoryItemName } from "features/game/types/game";
import { getItemId } from "features/marketplace/lib/offers";
import { getTradeType } from "features/marketplace/lib/getTradeType";
import { Modal } from "components/ui/Modal";
import { ClaimPurchase } from "./ClaimPurchase";

export const MyListings: React.FC = () => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [claimId, setClaimId] = useState<string>();

  const { trades } = gameState.context.state;
  const listings = trades.listings ?? {};

  const claim = () => {
    const listing = listings[claimId as string];

    gameService.send("purchase.claimed", {
      tradeIds: [claimId],
    });

    const itemId = getItemId({ details: listing });

    // For on chain items let's fire a refresh
    const tradeType = getTradeType({
      collection: listing.collection,
      id: itemId,
    });

    if (tradeType === "onchain") {
      gameService.send("RESET");
    }

    setClaimId(undefined);
  };

  const navigate = useNavigate();

  return (
    <>
      <Modal show={!!claimId} onHide={() => setClaimId(undefined)}>
        {claimId && (
          <ClaimPurchase
            sfl={listings[claimId as string].sfl}
            onClaim={claim}
            onClose={() => setClaimId(undefined)}
          />
        )}
      </Modal>
      <InnerPanel className="mb-2">
        <div className="p-2">
          <Label className="mb-2" type="default" icon={trade}>
            {t("marketplace.myListings")}
          </Label>
          <div className="flex flex-wrap">
            {getKeys(listings).length === 0 && (
              <p className="text-sm">{t("marketplace.noMyListings")}</p>
            )}
            {getKeys(listings).map((id) => {
              const listing = listings[id];

              // TODO - more listed types. Only resources currently support
              const itemName = getKeys(
                listing.items ?? {},
              )[0] as InventoryItemName;
              const itemId = KNOWN_IDS[itemName];
              const collection = getCollectionName(itemName);
              const details = getTradeableDisplay({
                id: itemId,
                type: collection,
              });

              return (
                <div
                  className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 pr-1 pb-1"
                  key={id}
                >
                  <ListViewCard
                    name={details.name}
                    hasBoost={!!details.buff}
                    price={new Decimal(listing.sfl)}
                    image={details.image}
                    supply={0}
                    type={details.type}
                    id={itemId}
                    isSold={!!listing.fulfilledAt}
                    onClick={
                      listing.fulfilledAt
                        ? () => setClaimId(id)
                        : () => {
                            navigate(`/marketplace/${details.type}/${itemId}`);
                          }
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InnerPanel>
    </>
  );
};
