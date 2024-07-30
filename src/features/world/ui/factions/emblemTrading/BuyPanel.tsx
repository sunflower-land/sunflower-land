import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";

import { Button } from "components/ui/Button";
import token from "assets/icons/sfl.webp";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";
import { Box } from "components/ui/Box";
import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { FactionEmblem } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  Listing,
  getTradeListings,
} from "features/game/actions/getTradeListings";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { hasMaxItems } from "features/game/lib/processEvent";
import { makeListingType } from "lib/utils/makeTradeListingType";
import { Label } from "components/ui/Label";
import { Loading } from "features/auth/components";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { VIPAccess } from "features/game/components/VipAccess";
import { getDayOfYear } from "lib/utils/time";
import { formatNumber } from "lib/utils/formatNumber";

export const TRADE_LIMITS: Record<FactionEmblem, number> = {
  "Goblin Emblem": 200,
  "Sunflorian Emblem": 200,
  "Bumpkin Emblem": 200,
  "Nightshade Emblem": 200,
};

export const TRADE_MINIMUMS: Record<FactionEmblem, number> = {
  "Goblin Emblem": 1,
  "Sunflorian Emblem": 1,
  "Bumpkin Emblem": 1,
  "Nightshade Emblem": 1,
};

const MAX_NON_VIP_PURCHASES = 3;

function getRemainingFreePurchases(dailyPurchases: {
  count: number;
  date: number;
}) {
  if (dailyPurchases.date != getDayOfYear(new Date())) {
    return MAX_NON_VIP_PURCHASES;
  }
  return MAX_NON_VIP_PURCHASES - dailyPurchases.count;
}

export const BuyPanel: React.FC<{
  emblem: FactionEmblem;
}> = ({ emblem }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthContext);
  const [authState] = useActor(authService);

  const { openModal } = useContext(ModalContext);

  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing>();
  const [isSearching, setIsSearching] = useState(false);
  const [warning, setWarning] = useState<"pendingTransaction" | "hoarding">();
  const [loading, setLoading] = useState(false);
  const [
    {
      context: { state, transaction, farmId },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  useEffect(() => {
    onSearch();
  }, []);

  const isVIP = hasVipAccess(state.inventory);
  const dailyPurchases = state.trades.dailyPurchases ?? { count: 0, date: 0 };
  const remainingFreePurchases = getRemainingFreePurchases(dailyPurchases);
  const hasPurchasesRemaining = isVIP || remainingFreePurchases > 0;

  const listView = (listings: Listing[]) => {
    if (listings.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="flex flex-col items-center justify-center pb-4">
            <img src={SUNNYSIDE.icons.search} className="w-16 mx-auto my-2" />
            <p className="text-sm">{t("trading.no.listings")}</p>
          </div>
        </div>
      );
    }

    const confirm = (listing: Listing) => {
      const updatedInventory = getKeys(listing.items).reduce(
        (acc, name) => ({
          ...acc,
          [name]: (inventory[name] ?? new Decimal(0)).add(
            listing.items[name] ?? 0,
          ),
        }),
        inventory,
      );

      const hasMaxedOut = hasMaxItems({
        current: updatedInventory,
        old: state.previousInventory,
      });

      if (hasMaxedOut) {
        setWarning("hoarding");
        return;
      }

      if (transaction && transaction.expiresAt > Date.now()) {
        setWarning("pendingTransaction");
        return;
      }

      setSelectedListing(listing);
    };

    const onConfirm = async (listing: Listing) => {
      gameService.send("FULFILL_TRADE_LISTING", {
        sellerId: listing.farmId,
        listingId: listing.id,
        listingType: makeListingType(listing.items),
      });
      setLoading(true);
    };

    const getAction = (listing: Listing) => {
      if (listing.farmId == farmId) {
        return (
          <div className="flex items-center mt-1  justify-end mr-0.5">
            <Label type="danger" className="mb-4">
              {t("trading.your.listing")}
            </Label>
          </div>
        );
      }

      if (selectedListing?.id == listing.id) {
        return (
          <Button onClick={() => onConfirm(listing)}>
            <div className="flex items-center">
              <img src={SUNNYSIDE.icons.confirm} className="h-4 mr-1" />
              <span className="text-xs">{t("confirm")}</span>
            </div>
          </Button>
        );
      }

      const hasSFL = state.balance.gte(listing.sfl);
      const disabled = !hasSFL || !hasPurchasesRemaining;

      return (
        <Button
          disabled={disabled}
          onClick={() => {
            confirm(listing);
          }}
        >
          {t("buy")}
        </Button>
      );
    };

    if (warning === "hoarding") {
      return (
        <div className="p-1 flex flex-col items-center">
          <img src={SUNNYSIDE.icons.lock} className="w-1/5 mb-2" />
          <p className="text-sm mb-1 text-center">
            {t("playerTrade.max.item")}
          </p>
          <p className="text-xs mb-1 text-center">
            {t("playerTrade.Progress")}
          </p>
        </div>
      );
    }

    if (warning === "pendingTransaction") {
      return (
        <div className="p-1 flex flex-col items-center">
          <img src={SUNNYSIDE.icons.timer} className="w-1/6 mb-2" />
          <p className="text-sm mb-1 text-center">
            {t("playerTrade.transaction")}
          </p>
          <p className="text-xs mb-1 text-center">{t("playerTrade.Please")}</p>
        </div>
      );
    }

    if (loading) {
      if (gameService.state.matches("fulfillTradeListing")) {
        return <Loading text={t("trading")} />;
      }

      if (selectedListing) {
        const listingItem = selectedListing.items[
          getKeys(selectedListing.items)[0]
        ] as number;
        const unitPrice = selectedListing.sfl / listingItem;

        return (
          <>
            <div className="flex flex-col w-full p-2">
              <img src={SUNNYSIDE.icons.confirm} className="mx-auto h-6 my-2" />
              <p className="text-sm mb-2 text-center">
                {t("trading.listing.fulfilled")}
              </p>
              <OuterPanel>
                <div className="flex justify-between">
                  <div>
                    <div className="flex flex-wrap w-52 items-center">
                      {getKeys(selectedListing.items).map((item, index) => (
                        <Box
                          image={ITEM_DETAILS[item].image}
                          count={new Decimal(selectedListing.items[item] ?? 0)}
                          disabled
                          key={`items-${index}`}
                        />
                      ))}
                      <div className="ml-1">
                        <div className="flex items-center mb-1">
                          <img src={token} className="h-6 mr-1" />
                          <p className="text-xs">{`${selectedListing.sfl} SFL`}</p>
                        </div>
                        <p className="text-xxs">
                          {t("bumpkinTrade.price/unit", {
                            price: formatNumber(unitPrice, {
                              decimalPlaces: 4,
                              showTrailingZeros: true,
                            }),
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="">
                    <div className="flex items-center mt-1  justify-end mr-0.5">
                      <Label type="success" className="mb-4 capitalize">
                        {t("purchased")}
                      </Label>
                    </div>
                  </div>
                </div>
              </OuterPanel>
              <Button
                className="mt-2"
                onClick={() => {
                  setLoading(false);
                  onSearch();
                }}
              >
                {t("continue")}
              </Button>
            </div>
          </>
        );
      }
    }

    return (
      <div className="flex flex-col w-full pl-2 pt-1">
        <div className="flex items-center ml-1">
          <Label type="default" icon={ITEM_DETAILS[emblem].image}>
            {emblem}
          </Label>
          <Label type="warning" className="ml-auto">
            {`${t("inventory")}: ${formatNumber(inventory[emblem], { decimalPlaces: 0 })}`}
          </Label>
        </div>
        <div className="flex-1 pr-2 overflow-y-auto scrollable mt-1">
          {listings.map((listing, index) => {
            // only one resource listing
            const listingItem = listing.items[
              getKeys(listing.items)[0]
            ] as number;
            const unitPrice = listing.sfl / listingItem;
            return (
              <OuterPanel className="mb-2" key={`data-${index}`}>
                <div className="flex justify-between">
                  <div className="justify-start">
                    <div className="flex flex-wrap w-52 items-center">
                      {getKeys(listing.items).map((item) => (
                        <Box
                          image={ITEM_DETAILS[item].image}
                          count={new Decimal(listing.items[item] ?? 0)}
                          disabled
                          key={`items-${index}`}
                        />
                      ))}
                      <div className="ml-1">
                        <div className="flex items-center mb-1">
                          <img src={token} className="h-6 mr-1" />
                          <p className="text-xs">{`${listing.sfl} SFL`}</p>
                        </div>
                        <p className="text-xxs">
                          {t("bumpkinTrade.price/unit", {
                            price: formatNumber(unitPrice, {
                              decimalPlaces: 4,
                              showTrailingZeros: true,
                            }),
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>{getAction(listing)}</div>
                </div>
              </OuterPanel>
            );
          })}
        </div>
      </div>
    );
  };

  const onSearch = async () => {
    setIsSearching(true);
    const listings = await getTradeListings(
      makeListingType({ [emblem]: 1 }),
      authState.context.user.rawToken,
    );

    setListings(listings);
    setIsSearching(false);
  };

  return (
    <>
      <div className="flex flex-col max-h-[400px] divide-brown-600">
        <div className="pl-2 pt-2 space-y-1 sm:space-y-0 sm:flex items-center justify-between ml-1.5">
          <VIPAccess
            isVIP={isVIP}
            onUpgrade={() => {
              openModal("BUY_BANNER");
            }}
          />
          {!isVIP && (
            <Label
              type={hasPurchasesRemaining ? "success" : "danger"}
              className="-ml-2"
            >
              {remainingFreePurchases === 1
                ? `${t("remaining.free.purchase")}`
                : `${t("remaining.free.purchases", {
                    purchasesRemaining: hasPurchasesRemaining
                      ? remainingFreePurchases
                      : t("no"),
                  })}`}
            </Label>
          )}
        </div>
        <div className="flex flex-col min-h-[150px] items-start justify-between">
          {isSearching && (
            <div className="flex items-center justify-center w-full mt-4">
              <p className="loading mt-1">{t("searching")}</p>
            </div>
          )}
          {!isSearching && (
            <div className="flex overflow-y-auto relative w-full mt-4">
              {listView(listings)}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
