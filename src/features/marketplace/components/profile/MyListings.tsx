import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import React, { useContext, useState } from "react";

import trade from "assets/icons/trade.png";
import sflIcon from "assets/icons/sfl.webp";

import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { getKeys } from "features/game/types/decorations";
import { getCollectionName, getTradeableDisplay } from "../../lib/tradeables";
import { KNOWN_IDS } from "features/game/types";
import Decimal from "decimal.js-light";
import { useNavigate } from "react-router-dom";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { InventoryItemName } from "features/game/types/game";
import { getItemId } from "features/marketplace/lib/offers";
import { Modal } from "components/ui/Modal";
import { ClaimPurchase } from "./ClaimPurchase";
import { Button } from "components/ui/Button";
import classNames from "classnames";
import { RemoveListing } from "../RemoveListing";
import * as AuthProvider from "features/auth/lib/Provider";

export const MyListings: React.FC = () => {
  const { t } = useAppTranslation();

  const { authService } = useContext(AuthProvider.Context);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [claimId, setClaimId] = useState<string>();
  const [removeListingId, setRemoveListingId] = useState<string>();

  const { trades } = gameState.context.state;
  const listings = trades.listings ?? {};

  const claim = () => {
    const listing = listings[claimId as string];

    gameService.send("purchase.claimed", {
      tradeIds: [claimId],
    });

    const itemId = getItemId({ details: listing });

    // For on chain items let's fire a refresh
    const tradeType = listing.signature ? "onchain" : "instant";

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

      <Modal
        show={!!removeListingId}
        onHide={() => setRemoveListingId(undefined)}
      >
        <RemoveListing
          listingIds={removeListingId ? [removeListingId] : []}
          authToken={authService.state.context.user.rawToken as string}
          onClose={() => setRemoveListingId(undefined)}
        />
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

            {getKeys(listings).length > 0 && (
              <table className="w-full text-xs  border-collapse bg-[#ead4aa] ">
                <thead>
                  <tr>
                    <th className="p-1.5 w-1/5 text-left">
                      <p>{t("marketplace.item")}</p>
                    </th>
                    <th className="p-1.5 text-left">
                      <p>{t("marketplace.unitPrice")}</p>
                    </th>
                    <th className="p-1.5 w-1/5"></th>
                  </tr>
                </thead>
                <tbody>
                  {getKeys(listings).map((id, index) => {
                    const listing = listings[id];

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
                      <tr
                        key={index}
                        className={classNames(
                          "relative cursor-pointer bg-[#ead4aa] !py-10 hover:shadow-md hover:scale-[100.5%] transition-all",
                          {},
                        )}
                        style={{
                          borderBottom: "1px solid #b96f50",
                          borderTop: index === 0 ? "1px solid #b96f50" : "",
                        }}
                        onClick={() => {
                          if (listing.boughtAt) {
                            setClaimId(id);
                          } else {
                            navigate(`/marketplace/${collection}/${itemId}`);
                          }
                        }}
                      >
                        <td className="p-1.5 text-left w-12">
                          <div className="flex items-center">
                            <img src={details.image} className="h-8 mr-4" />
                            <p className="text-sm">{details.name}</p>
                          </div>
                        </td>
                        <td className="p-1.5 text-left relative">
                          <div className="flex items-center">
                            <img src={sflIcon} className="h-5 mr-1" />
                            <p className="text-sm">
                              {new Decimal(listing.sfl).toFixed(2)}
                            </p>
                          </div>
                        </td>
                        <td className="p-1.5 truncate flex items-center justify-end pr-2 h-full">
                          {listing.boughtAt ? (
                            <Label type="success">
                              {t("marketplace.sold")}
                            </Label>
                          ) : (
                            <Button
                              variant="secondary"
                              className="w-auto h-10"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRemoveListingId(id);
                              }}
                            >
                              {t("cancel")}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </InnerPanel>
    </>
  );
};
