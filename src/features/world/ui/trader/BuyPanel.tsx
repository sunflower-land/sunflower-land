import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import token from "assets/icons/sfl.webp";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getKeys } from "features/game/types/craftables";
import { GameState, InventoryItemName } from "features/game/types/game";
import {
  getTradeListings,
  Listing,
} from "features/game/actions/getTradeListings";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { Label } from "components/ui/Label";
import { Loading } from "features/auth/components";
import { FloorPrices } from "features/game/actions/getListingsFloorPrices";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { VIPAccess } from "features/game/components/VipAccess";
import { getDayOfYear } from "lib/utils/time";
import { ListingCategoryCard } from "components/ui/ListingCategoryCard";
import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { hasMaxItems } from "features/game/lib/processEvent";
import { ITEM_DETAILS } from "features/game/types/images";
import { formatNumber } from "lib/utils/formatNumber";
import { makeListingType } from "lib/utils/makeTradeListingType";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";
import { SquareIcon } from "components/ui/SquareIcon";
import { isMobile } from "mobile-device-detect";

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

interface Props {
  floorPrices: FloorPrices;
}

export const BuyPanel: React.FC<
  Props & {
    setUpdatedAt: (updatedAt: number | undefined) => void;
  }
> = ({ floorPrices, setUpdatedAt }) => {
  const { t } = useAppTranslation();

  const { openModal } = useContext(ModalContext);

  const [view, setView] = useState<"search" | "list">("search");
  const [selected, setSelected] = useState<InventoryItemName>();
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const isVIP = hasVipAccess({ game: state });
  const dailyPurchases = state.trades.dailyPurchases ?? { count: 0, date: 0 };
  const remainingFreePurchases = getRemainingFreePurchases(dailyPurchases);
  const hasPurchasesRemaining = isVIP || remainingFreePurchases > 0;

  const onSearch = async (resource: Partial<InventoryItemName>) => {
    setSelected(resource);
    setView("list");
  };

  return (
    <div className="flex flex-col divide-brown-600">
      <div className="pl-2 pt-2 space-y-1 sm:space-y-0 sm:flex items-center justify-between ml-1">
        <VIPAccess
          isVIP={isVIP}
          onUpgrade={() => openModal("BUY_BANNER")}
          text={t("bumpkinTrade.unlockMoreTrades")}
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
      <div className="flex flex-col items-start justify-between mt-1">
        <div className="flex overflow-y-auto relative w-full max-h-[400px] scrollable">
          {view === "search" && (
            <SearchView
              floorPrices={floorPrices}
              onSearch={(name) => onSearch(name)}
            />
          )}
          {view === "list" && (
            <ListView
              onBack={() => setView("search")}
              selected={selected ?? "Sunflower"}
              hasPurchasesRemaining={hasPurchasesRemaining}
              setUpdatedAt={setUpdatedAt}
            />
          )}
        </div>
      </div>
    </div>
  );
};
interface SearchViewProps extends Props {
  onSearch: (name: InventoryItemName) => void;
}
const SearchView: React.FC<SearchViewProps> = ({ floorPrices, onSearch }) => {
  if (Object.keys(floorPrices).length === 0) {
    return <Loading />;
  }

  return (
    <div className="p-2">
      <div className="flex flex-wrap">
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

interface ListViewProps {
  onBack: () => void;
  selected: InventoryItemName;
  hasPurchasesRemaining: boolean;
  setUpdatedAt: (updatedAt: number | undefined) => void;
}

const ListView: React.FC<ListViewProps> = ({
  onBack,
  selected,
  hasPurchasesRemaining,
  setUpdatedAt,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const THIRTY_SECONDS = 1000 * 30;
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { authService } = useContext(AuthContext);
  const [authState] = useActor(authService);
  const [fulfillListing, setfulfillListing] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing>();
  const [warning, setWarning] = useState<"pendingTransaction" | "hoarding">();
  const [
    {
      context: { state, farmId },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  useEffect(() => {
    if (!selected || fulfillListing) return;

    const load = async () => {
      setLoading(true);
      try {
        const listings = await getTradeListings(
          selected.toLowerCase(),
          authState.context.user.rawToken,
        );
        setUpdatedAt(Date.now());
        setListings(listings);
      } catch {
        setListings([]);
      }
      setLoading(false);
    };

    load();

    const interval = setInterval(load, THIRTY_SECONDS);

    return () => {
      clearInterval(interval);
      setUpdatedAt(undefined);
    };
  }, [
    THIRTY_SECONDS,
    authState.context.user.rawToken,
    selected,
    setUpdatedAt,
    fulfillListing,
  ]);

  const onConfirm = async (listing: Listing) => {
    setfulfillListing(true);
    gameService.send("FULFILL_TRADE_LISTING", {
      sellerId: listing.farmId,
      listingId: listing.id,
      listingType: makeListingType(listing.items),
    });
  };

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
      currentInventory: updatedInventory,
      oldInventory: state.previousInventory,
      currentWardrobe: state.wardrobe,
      oldWardrobe: state.previousWardrobe,
    });

    if (hasMaxedOut) {
      setWarning("hoarding");
      return;
    }

    setSelectedListing(listing);
  };

  if (loading && listings.length === 0) {
    return <Loading text={t("searching")} />;
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center w-full">
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="self-start cursor-pointer mr-3"
            style={{
              top: `${PIXEL_SCALE * 2}px`,
              left: `${PIXEL_SCALE * 2}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
            alt="back"
            onClick={onBack}
          />
          <Label type="default" icon={ITEM_DETAILS[selected].image}>
            {selected}
          </Label>
        </div>
        <div className="flex flex-col items-center justify-center pb-2">
          <img
            src={SUNNYSIDE.icons.search}
            className="mx-auto my-2"
            style={{
              width: `${PIXEL_SCALE * 13}px`,
            }}
          />
          <p className="text-sm">{t("trading.no.listings")}</p>
        </div>
      </div>
    );
  }

  if (warning === "hoarding") {
    return (
      <div className="flex flex-col items-center w-full">
        <img
          src={SUNNYSIDE.icons.lock}
          className="mb-2"
          style={{
            width: `${PIXEL_SCALE * 12}px`,
          }}
        />
        <p className="text-sm mb-1 text-center">{t("playerTrade.max.item")}</p>
        <p className="text-xs mb-1 text-center">{t("playerTrade.Progress")}</p>
        <Button
          className="mt-2"
          onClick={() => {
            setWarning(undefined);
          }}
        >
          {t("back")}
        </Button>
      </div>
    );
  }

  if (gameService.state.matches("fulfillTradeListing")) {
    return <Loading text={t("trading")} />;
  }

  if (fulfillListing && selectedListing) {
    const listingItem = selectedListing.items[
      getKeys(selectedListing.items)[0]
    ] as number;
    const unitPrice = selectedListing.sfl / listingItem;

    return (
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
                    <p className="text-xs">{`${formatNumber(selectedListing.sfl, { decimalPlaces: 4 })} SFL`}</p>
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

            <div className="flex items-start">
              <Label type="success">{t("purchased")}</Label>
            </div>
          </div>
        </OuterPanel>
        <Button
          className="mt-2"
          onClick={() => {
            setLoading(false);
            setfulfillListing(false);
            setSelectedListing(undefined);
          }}
        >
          {t("continue")}
        </Button>
      </div>
    );
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
          onClick={onBack}
        />
        <Label type="default" icon={ITEM_DETAILS[selected].image}>
          {selected}
        </Label>
        {!!inventory[selected] && (
          <Label type="warning" className="ml-auto mr-2">
            {`${t("inventory")}: ${formatNumber(inventory[selected], { decimalPlaces: 0 })}`}
          </Label>
        )}
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
                  <div className="flex flex-wrap w-50 sm:w-52 items-center">
                    {getKeys(listing.items).map((item) => (
                      <Box
                        image={ITEM_DETAILS[item].image}
                        count={new Decimal(listing.items[item] ?? 0)}
                        disabled
                        key={`items-${index}`}
                      />
                    ))}
                    <div className="ml-0.5 sm:ml-1">
                      <div className="flex items-center mb-1">
                        <img src={token} className="h-5 sm:h-6 mr-1" />
                        <p className="text-xs">{`${formatNumber(listing.sfl, { decimalPlaces: 4 })} SFL`}</p>
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

                <div className="flex items-center">
                  <ActionButtons
                    loading={loading}
                    listing={listing}
                    selectedListing={selectedListing}
                    farmId={farmId}
                    hasPurchasesRemaining={hasPurchasesRemaining}
                    onConfirm={onConfirm}
                    confirm={confirm}
                    state={state}
                  />
                </div>
              </div>
            </OuterPanel>
          );
        })}
      </div>
    </div>
  );
};

interface ActionButtonsProps {
  loading: boolean;
  listing: Listing;
  selectedListing?: Listing;
  farmId: number;
  hasPurchasesRemaining: boolean;
  onConfirm: (listing: Listing) => void;
  confirm: (listing: Listing) => void;
  state: GameState;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  loading,
  listing,
  selectedListing,
  farmId,
  hasPurchasesRemaining,
  onConfirm,
  confirm,
  state,
}) => {
  const { t } = useAppTranslation();
  const hasSFL = state.balance.gte(listing.sfl);
  const disabled = !hasSFL || !hasPurchasesRemaining || loading;

  if (listing.farmId == farmId) {
    return (
      <div className="flex items-center sm:h-full">
        <Label type="danger">{t("trading.your.listing")}</Label>
      </div>
    );
  }
  if (selectedListing?.id == listing.id) {
    return (
      <Button disabled={loading} onClick={() => onConfirm(listing)}>
        <div className="flex items-center gap-1 sm:gap-2">
          <SquareIcon icon={SUNNYSIDE.icons.confirm} width={isMobile ? 6 : 7} />
          <span className="text-xxs sm:text-sm">{t("confirm")}</span>
        </div>
      </Button>
    );
  }
  return (
    <Button disabled={disabled} onClick={() => confirm(listing)}>
      {t("buy")}
    </Button>
  );
};
