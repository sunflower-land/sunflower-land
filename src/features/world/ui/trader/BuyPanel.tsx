import React, { useContext, useEffect, useRef, useState } from "react";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";

import { Button } from "components/ui/Button";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";
import { Box } from "components/ui/Box";
import Decimal from "decimal.js-light";
import token from "assets/icons/sfl.webp";
import lock from "assets/skills/lock.png";
import { getKeys } from "features/game/types/craftables";
import { InventoryItemName } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  Listing,
  getTradeListings,
} from "features/game/actions/getTradeListings";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { hasMaxItems } from "features/game/lib/processEvent";
import { makeListingType } from "lib/utils/makeTradeListingType";
import { Label } from "components/ui/Label";
import { Loading } from "features/auth/components";
import { FloorPrices } from "features/game/actions/getListingsFloorPrices";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { VIPAccess } from "features/game/components/VipAccess";
import { getDayOfYear } from "lib/utils/time";
import { setPrecision } from "lib/utils/formatNumber";
import { ListingCategoryCard } from "components/ui/ListingCategoryCard";

export const TRADE_LIMITS: Partial<Record<InventoryItemName, number>> = {
  Sunflower: 2000,
  Potato: 2000,
  Pumpkin: 2000,
  Carrot: 2000,
  Cabbage: 2000,
  Soybean: 2000,
  Beetroot: 1000,
  Cauliflower: 1000,
  Parsnip: 1000,
  Eggplant: 1000,
  Corn: 1000,
  Radish: 500,
  Wheat: 500,
  Kale: 500,
  Blueberry: 200,
  Orange: 200,
  Apple: 200,
  Banana: 200,
  Grape: 100,
  Rice: 100,
  Olive: 100,
  Wood: 500,
  Stone: 200,
  Iron: 200,
  Gold: 100,
  Egg: 500,
  Honey: 100,
  Crimstone: 20,
};

export const TRADE_MINIMUMS: Partial<Record<InventoryItemName, number>> = {
  Sunflower: 200,
  Potato: 200,
  Pumpkin: 100,
  Carrot: 100,
  Cabbage: 100,
  Soybean: 50,
  Beetroot: 50,
  Cauliflower: 50,
  Parsnip: 20,
  Eggplant: 20,
  Corn: 20,
  Radish: 10,
  Wheat: 10,
  Kale: 10,
  Blueberry: 5,
  Orange: 5,
  Apple: 5,
  Banana: 5,
  Grape: 5,
  Rice: 5,
  Olive: 5,
  Wood: 50,
  Stone: 10,
  Iron: 5,
  Gold: 3,
  Egg: 10,
  Honey: 5,
  Crimstone: 1,
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
  floorPrices: FloorPrices;
}> = ({ floorPrices }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthContext);
  const [authState] = useActor(authService);

  const { openModal } = useContext(ModalContext);

  const [view, setView] = useState<"search" | "list">("search");
  const selected = useRef<InventoryItemName>();
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing>();
  const [isSearching, setIsSearching] = useState(false);
  const [warning, setWarning] = useState<"pendingTransaction" | "hoarding">();
  const [loading, setLoading] = useState(false);
  const [floor, setFloor] = useState<FloorPrices>({});
  const [
    {
      context: { state, transaction, farmId },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  useEffect(() => {
    setFloor(floorPrices);
  }, [floorPrices]);

  const isVIP = hasVipAccess(state.inventory);
  const dailyPurchases = state.trades.dailyPurchases ?? { count: 0, date: 0 };
  const remainingFreePurchases = getRemainingFreePurchases(dailyPurchases);
  const hasPurchasesRemaining = isVIP || remainingFreePurchases > 0;

  const searchView = () => {
    if (floor.Sunflower == undefined) {
      return <Loading />;
    }

    return (
      <div className="flex flex-col pl-2 pt-2">
        {hasPurchasesRemaining && (
          <Label type="default" icon={SUNNYSIDE.icons.basket} className="ml-2">
            {t("trading.select.resources")}
          </Label>
        )}
        <div className="flex flex-wrap flex-1 pr-2 overflow-y-auto scrollable mt-2">
          {getKeys(TRADE_LIMITS).map((name) => (
            <div
              key={name}
              className="w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 pr-1 pb-1"
            >
              <ListingCategoryCard
                itemName={name}
                pricePerUnit={floorPrices[name]}
                onClick={() => onSearch(name)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const onBack = () => {
    setView("search");
  };

  const listView = (listings: Listing[]) => {
    if (listings.length === 0) {
      return (
        <div>
          <div className="flex items-center">
            <img
              src={SUNNYSIDE.icons.arrow_left}
              className="self-start cursor-pointer mr-3"
              style={{
                top: `${PIXEL_SCALE * 2}px`,
                left: `${PIXEL_SCALE * 2}px`,
                width: `${PIXEL_SCALE * 11}px`,
              }}
              alt="back"
              onClick={() => onBack()}
            />
            <Label
              type="default"
              icon={ITEM_DETAILS[selected.current as InventoryItemName].image}
            >
              {selected.current}
            </Label>
          </div>
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
            listing.items[name] ?? 0
          ),
        }),
        inventory
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
          <img src={lock} className="w-1/5 mb-2" />
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
                            price: setPrecision(new Decimal(unitPrice)).toFixed(
                              4
                            ),
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
                  setView("search");
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
        <div className="flex items-center">
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="self-start cursor-pointer mr-3"
            style={{
              top: `${PIXEL_SCALE * 2}px`,
              left: `${PIXEL_SCALE * 2}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
            alt="back"
            onClick={() => onBack()}
          />
          <Label
            type="default"
            icon={ITEM_DETAILS[selected.current as InventoryItemName].image}
          >
            {selected.current}
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
                            price: setPrecision(new Decimal(unitPrice)).toFixed(
                              4
                            ),
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

  const onSearch = async (resource: Partial<InventoryItemName>) => {
    selected.current = resource;

    setIsSearching(true);
    const listings = await getTradeListings(
      resource.toLowerCase(),
      authState.context.user.rawToken
    );

    setListings(listings);
    setIsSearching(false);
    setView("list");
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
              {remainingFreePurchases == 0
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
          {isSearching && <p className="loading mt-1">{t("searching")}</p>}
          {!isSearching && (
            <div className="flex overflow-y-auto relative w-full">
              {view === "search" && searchView()}
              {view === "list" && listView(listings)}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
