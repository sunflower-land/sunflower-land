import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import React, { useContext, useState } from "react";
import * as Auth from "features/auth/lib/Provider";

import trade from "assets/icons/trade.png";

import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { getKeys } from "features/game/types/decorations";
import { getTradeableDisplay } from "../../lib/tradeables";
import { useLocation, useNavigate, useParams } from "react-router";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { InventoryItemName } from "features/game/types/game";
import { Modal } from "components/ui/Modal";
import { ClaimPurchase } from "./ClaimPurchase";
import { MachineState } from "features/game/lib/gameMachine";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { RemoveListing } from "../RemoveListing";
import { tradeToId } from "features/marketplace/lib/offers";
import { isTradeResource } from "features/game/actions/tradeLimits";
import { MyTableRow } from "./MyTableRow";
import { MARKETPLACE_TAX } from "features/game/types/marketplace";
import { Button } from "components/ui/Button";
import { BulkRemoveTrades } from "../BulkRemoveListings";

const _isCancellingOffer = (state: MachineState) =>
  state.matches("marketplaceListingCancelling");
const _trades = (state: MachineState) => state.context.state.trades;
const _authToken = (state: AuthMachineState) =>
  state.context.user.rawToken as string;
const _state = (state: MachineState) => state.context.state;

export const MyListings: React.FC = () => {
  const { t } = useAppTranslation();
  const params = useParams();
  const { gameService } = useContext(Context);

  const { authService } = useContext(Auth.Context);
  const isWorldRoute = useLocation().pathname.includes("/world");

  const usd = gameService.getSnapshot().context.prices.sfl?.usd ?? 0.0;

  const [claimId, setClaimId] = useState<string>();
  const [removeListingId, setRemoveListingId] = useState<string>();
  const [bulkCancel, setBulkCancel] = useState<boolean>(false);

  const state = useSelector(gameService, _state);
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

    gameService.send({ type: "purchase.claimed", tradeIds: [claimId] });

    // For on chain items let's fire a refresh
    const tradeType = listing.signature ? "onchain" : "instant";

    if (tradeType === "onchain") {
      gameService.send({ type: "RESET" });
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
        {!!removeListingId && (
          <RemoveListing
            listingId={removeListingId}
            authToken={authToken}
            onClose={() => setRemoveListingId(undefined)}
          />
        )}
      </Modal>
      <Modal show={!!bulkCancel} onHide={() => setBulkCancel(false)}>
        <BulkRemoveTrades
          ids={Object.keys(filteredListings)}
          type="listings"
          authToken={authToken}
          onClose={() => setBulkCancel(false)}
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
          <div className="flex items-center justify-between mb-2">
            <Label type="default" icon={trade}>
              {t("marketplace.myListings")}
            </Label>
            <Button
              className="w-fit h-8 rounded-none"
              onClick={() => setBulkCancel(true)}
            >
              <p className="text-xxs sm:text-sm">
                {t("marketplace.bulkCancel")}
              </p>
            </Button>
          </div>
          <div className="flex flex-wrap">
            {getKeys(filteredListings).length === 0 ? (
              <p className="text-sm">{t("marketplace.noMyListings")}</p>
            ) : (
              <div className="w-full relative border-collapse mb-2 max-h-[200px] scrollable overflow-y-auto overflow-x-hidden">
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
                    state,
                  });

                  const isResource =
                    isTradeResource(itemName) &&
                    listing.collection === "collectibles";

                  const quantity = listing.items[itemName];
                  const price = listing.sfl;
                  const unitPrice = price / (quantity ?? 1);

                  return (
                    <MyTableRow
                      key={id}
                      index={index}
                      id={id}
                      pageItemId={params.id ?? ""}
                      itemId={itemId}
                      itemName={itemName}
                      quantity={quantity ?? 0}
                      price={price}
                      collection={listing.collection}
                      unitPrice={unitPrice}
                      usdPrice={usd}
                      isFulfilled={!!listing.fulfilledAt || !!listing.boughtAt}
                      isResource={isResource}
                      fee={listing.tax ?? listing.sfl * MARKETPLACE_TAX}
                      onCancel={() => setRemoveListingId(id)}
                      onRowClick={() =>
                        navigate(
                          `${isWorldRoute ? "/world" : ""}/marketplace/${details.type}/${itemId}`,
                        )
                      }
                      onClaim={() => setClaimId(id)}
                    />
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
