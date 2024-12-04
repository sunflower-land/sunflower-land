import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import React, { useContext, useState } from "react";
import * as Auth from "features/auth/lib/Provider";

import trade from "assets/icons/trade.png";
import sflIcon from "assets/icons/sfl.webp";

import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { getKeys } from "features/game/types/decorations";
import { getTradeableDisplay } from "../../lib/tradeables";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { InventoryItemName } from "features/game/types/game";
import { Modal } from "components/ui/Modal";
import { ClaimPurchase } from "./ClaimPurchase";
import { Button } from "components/ui/Button";
import classNames from "classnames";
import { MachineState } from "features/game/lib/gameMachine";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { RemoveListing } from "../RemoveListing";
import { tradeToId } from "features/marketplace/lib/offers";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";

const _isCancellingOffer = (state: MachineState) =>
  state.matches("marketplaceListingCancelling");
const _trades = (state: MachineState) => state.context.state.trades;
const _authToken = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

export const MyListings: React.FC = () => {
  const { t } = useAppTranslation();
  const params = useParams();
  const { gameService } = useContext(Context);
  const { authService } = useContext(Auth.Context);
  const isWorldRoute = useLocation().pathname.includes("/world");

  const [claimId, setClaimId] = useState<string>();
  const [removeListingId, setRemoveListingId] = useState<string>();

  const isCancellingListing = useSelector(gameService, _isCancellingOffer);
  const trades = useSelector(gameService, _trades);
  const authToken = useSelector(authService, _authToken);

  const navigate = useNavigate();

  const listings = trades.listings ?? {};

  const filteredListings =
    params.id && params.collection
      ? Object.fromEntries(
          Object.entries(listings).filter(([_, listing]) => {
            const listingItemId = tradeToId({
              details: {
                collection: listing.collection,
                items: listing.items,
              },
            });

            return (
              listing.collection === params.collection &&
              listingItemId === Number(params.id)
            );
          }),
        )
      : listings;

  if (getKeys(filteredListings).length === 0) return null;

  const claim = () => {
    const listing = listings[claimId as string];

    gameService.send("purchase.claimed", {
      tradeIds: [claimId],
    });

    // For on chain items let's fire a refresh
    const tradeType = listing.signature ? "onchain" : "instant";

    if (tradeType === "onchain") {
      gameService.send("RESET");
    }

    setClaimId(undefined);
  };

  const handleHide = () => {
    if (isCancellingListing) return;

    setRemoveListingId(undefined);
  };

  return (
    <>
      <Modal show={!!removeListingId} onHide={handleHide}>
        <RemoveListing
          listingIds={removeListingId ? [removeListingId] : []}
          authToken={authToken}
          onClose={() => setRemoveListingId(undefined)}
        />
      </Modal>
      <Modal show={!!claimId} onHide={() => setClaimId(undefined)}>
        {claimId && (
          <ClaimPurchase
            sfl={listings[claimId as string].sfl}
            onClaim={claim}
            onClose={() => setClaimId(undefined)}
          />
        )}
      </Modal>

      <InnerPanel className="mb-1">
        <div className="p-2">
          <div className="flex items-center justify-between">
            <Label className="mb-2" type="default" icon={trade}>
              {t("marketplace.myListings")}
            </Label>
          </div>
          <div className="flex flex-wrap">
            {getKeys(filteredListings).length === 0 ? (
              <p className="text-sm">{t("marketplace.noMyListings")}</p>
            ) : (
              <div className="w-full text-xs border-collapse mb-2">
                {getKeys(filteredListings).map((id, index) => {
                  const listing = listings[id];
                  const itemName = getKeys(
                    listing.items ?? {},
                  )[0] as InventoryItemName;
                  const itemId = tradeToId({
                    details: {
                      collection: listing.collection,
                      items: listing.items,
                    },
                  });
                  const details = getTradeableDisplay({
                    id: itemId,
                    type: listing.collection,
                  });

                  const isResource =
                    getKeys(TRADE_LIMITS).includes(itemName) &&
                    listing.collection === "collectibles";

                  const quantity = listing.items[itemName];
                  const price = listing.sfl;
                  const unitPrice = price / (quantity ?? 1);

                  return (
                    <div
                      key={index}
                      className={classNames(
                        "relative bg-[#ead4aa] transition-all flex items-center",
                        {
                          "hover:shadow-md hover:scale-[100.5%] cursor-pointer":
                            Number(params.id) !== itemId,
                        },
                      )}
                      style={{
                        borderBottom: "1px solid #b96f50",
                        borderTop: index === 0 ? "1px solid #b96f50" : "",
                      }}
                      onClick={() =>
                        navigate(
                          `${isWorldRoute ? "/world" : ""}/marketplace/${listing.collection}/${itemId}`,
                        )
                      }
                    >
                      <div className="p-1.5 flex w-1/2 sm:w-1/3 items-center">
                        <div className="flex items-center">
                          <img
                            src={details.image}
                            className="object-contain h-8 w-8 mr-3 sm:mr-4"
                          />
                          <p className="text-xxs py-0.5 sm:text-sm">
                            {`${isResource ? `${quantity} x` : ""} ${details.name}`}
                          </p>
                        </div>
                      </div>
                      <div className="p-1.5 truncate flex flex-1 items-center">
                        <div className="flex flex-col items-start justify-center">
                          <div className="flex justify-start space-x-1">
                            <img src={sflIcon} className="h-5" />
                            <span className="sm:text-sm">{`${price.toFixed(2)}`}</span>
                          </div>
                          {isResource && (
                            <div className="text-xxs w-full text-end">
                              {t("bumpkinTrade.price/unit", {
                                price: unitPrice.toFixed(4),
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-1 text-center w-[65px] sm:min-w-[94px]">
                        <Button
                          variant="secondary"
                          className="w-full h-8 rounded-none"
                          onClick={
                            listing.boughtAt
                              ? () => setClaimId(id)
                              : () => setRemoveListingId(id)
                          }
                        >
                          <p className="text-xxs sm:text-sm">
                            {t(listing.boughtAt ? "claim" : "cancel")}
                          </p>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </InnerPanel>
    </>
  );
};
