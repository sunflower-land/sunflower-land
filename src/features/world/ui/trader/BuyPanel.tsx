import React, { useContext, useState } from "react";
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
  Tomato: 300,
  Lemon: 250,
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
  Tomato: 5,
  Blueberry: 5,
  Orange: 5,
  Apple: 5,
  Banana: 5,
  Lemon: 5,
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

interface Props {
  floorPrices: FloorPrices;
}

export const BuyPanel: React.FC<Props> = ({ floorPrices }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthContext);
  const [authState] = useActor(authService);

  const { openModal } = useContext(ModalContext);

  const [view, setView] = useState<"search" | "list">("search");
  const [selected, setSelected] = useState<InventoryItemName>("Sunflower");
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
  const isVIP = hasVipAccess(state.inventory);
  const dailyPurchases = state.trades.dailyPurchases ?? { count: 0, date: 0 };
  const remainingFreePurchases = getRemainingFreePurchases(dailyPurchases);
  const hasPurchasesRemaining = isVIP || remainingFreePurchases > 0;

  const onBack = () => {
    setView("search");
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

  const onSearch = async (resource: Partial<InventoryItemName>) => {
    setSelected(resource);

    setIsSearching(true);
    const listings = await getTradeListings(
      resource.toLowerCase(),
      authState.context.user.rawToken,
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
        <div className="flex flex-col min-h-[150px] items-start justify-between">
          {isSearching && <Loading text={t("searching")} />}
          {!isSearching && (
            <div className="flex overflow-y-auto relative w-full scrollable">
              {view === "search" && (
                <SearchView
                  floorPrices={floorPrices}
                  onSearch={(name) => onSearch(name)}
                />
              )}
              {view === "list" && (
                <ListView
                  listings={listings}
                  onBack={onBack}
                  onClick={() => {
                    setLoading(false);
                    setView("search");
                  }}
                  selected={selected}
                  warning={warning}
                  loading={loading}
                  selectedListing={selectedListing}
                  farmId={farmId}
                  hasPurchasesRemaining={hasPurchasesRemaining}
                  onConfirm={onConfirm}
                  confirm={confirm}
                  state={state}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
interface SearchViewProps extends Props {
  onSearch: (name: InventoryItemName) => void;
}
const SearchView: React.FC<SearchViewProps> = ({ floorPrices, onSearch }) => {
  if (floorPrices.Sunflower == undefined) {
    return <Loading />;
  }

  return (
    <div className="p-2">
      <div className="flex flex-wrap mt-2">
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
  listings: Listing[];
  onBack: () => void;
  selected: InventoryItemName;
  warning?: string;
  loading: boolean;
  selectedListing?: Listing;
  farmId: number;
  hasPurchasesRemaining: boolean;
  onConfirm: (listing: Listing) => void;
  confirm: (listing: Listing) => void;
  state: GameState;
  onClick: () => void;
}

const ListView: React.FC<ListViewProps> = ({
  listings,
  onBack,
  selected,
  warning,
  loading,
  selectedListing,
  farmId,
  hasPurchasesRemaining,
  onConfirm,
  confirm,
  state,
  onClick,
}) => {
  const { gameService } = useContext(Context);
  const inventory = state.inventory;
  const { t } = useAppTranslation();

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
          <Label type="default" icon={ITEM_DETAILS[selected].image}>
            {selected}
          </Label>
        </div>
        <div className="flex flex-col items-center justify-center pb-4">
          <img src={SUNNYSIDE.icons.search} className="w-16 mx-auto my-2" />
          <p className="text-sm">{t("trading.no.listings")}</p>
        </div>
      </div>
    );
  }

  if (warning === "hoarding") {
    return (
      <div className="p-1 flex flex-col items-center">
        <img src={SUNNYSIDE.icons.lock} className="w-1/5 mb-2" />
        <p className="text-sm mb-1 text-center">{t("playerTrade.max.item")}</p>
        <p className="text-xs mb-1 text-center">{t("playerTrade.Progress")}</p>
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
            <Button className="mt-2" onClick={onClick}>
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
        <Label type="default" icon={ITEM_DETAILS[selected].image}>
          {selected}
        </Label>
        <Label type="warning" className="ml-auto">
          {`${t("inventory")}: ${formatNumber(inventory[selected], { decimalPlaces: 0 })}`}
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

                <div>
                  <GetActionButtons
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
  listing: Listing;
  selectedListing?: Listing;
  farmId: number;
  hasPurchasesRemaining: boolean;
  onConfirm: (listing: Listing) => void;
  confirm: (listing: Listing) => void;
  state: GameState;
}

const GetActionButtons: React.FC<ActionButtonsProps> = ({
  listing,
  selectedListing,
  farmId,
  hasPurchasesRemaining,
  onConfirm,
  confirm,
  state,
}) => {
  const { t } = useAppTranslation();
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
    <Button disabled={disabled} onClick={() => confirm(listing)}>
      {t("buy")}
    </Button>
  );
};
