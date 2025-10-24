import { useSelector } from "@xstate/react";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { Panel, InnerPanel } from "components/ui/Panel";
import { Loading } from "features/auth/components";
import {
  Listing,
  Tradeable,
  TradeableDetails,
} from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { TradeableListItem } from "./TradeableList";
import { ListingTable } from "./TradeTable";
import { Context } from "features/game/GameProvider";

import tradeIcon from "assets/icons/trade.png";
import {
  Context as ContextType,
  BlockchainEvent,
  MachineState,
} from "features/game/lib/gameMachine";
import { useOnMachineTransition } from "lib/utils/hooks/useOnMachineTransition";
import confetti from "canvas-confetti";
import { ResourceTable } from "./ResourceTable";
import { formatNumber } from "lib/utils/formatNumber";
import { useParams } from "react-router";
import { PurchaseModalContent } from "./PurchaseModalContent";
import { TradeableDisplay } from "../lib/tradeables";
import { KNOWN_ITEMS } from "features/game/types";
import { KeyedMutator } from "swr";
import { isTradeResource } from "features/game/actions/tradeLimits";
import { MAX_LIMITED_SALES } from "./Tradeable";
import { ResourceTaxes } from "./TradeableInfo";
import { Button } from "components/ui/Button";
import { BulkBuyInterface } from "./BulkBuyInterface";
import { InventoryItemName } from "features/game/types/game";
import Decimal from "decimal.js-light";
import { MAX_INVENTORY_ITEMS } from "features/game/lib/processEvent";
import debounce from "lodash.debounce";

type TradeableListingsProps = {
  authToken: string;
  tradeable?: TradeableDetails;
  display: TradeableDisplay;
  limitedTradesLeft: number;
  farmId: number;
  id: number;
  showListItem: boolean;
  count: number;
  onListClick: () => void;
  onListClose: () => void;
  reload: KeyedMutator<TradeableDetails>;
};

type BulkOrder = {
  quantity: number;
  price: number;
  ids: string[];
};

const _isListing = (state: MachineState) => state.matches("marketplaceListing");
const _balance = (state: MachineState) => state.context.state.balance;
const _maxLimit = (item: InventoryItemName) => (state: MachineState) => {
  const max = MAX_INVENTORY_ITEMS[item] || new Decimal(0);
  const current = state.context.state.inventory[item] ?? new Decimal(0);
  const old = state.context.state.previousInventory[item] ?? new Decimal(0);
  const diff = current.minus(old);

  return max.minus(diff).toNumber();
};

export const TradeableListings: React.FC<TradeableListingsProps> = ({
  authToken,
  tradeable,
  limitedTradesLeft,
  farmId,
  display,
  id,
  count,
  showListItem,
  reload,
  onListClose,
}) => {
  const { gameService, showAnimations } = useContext(Context);
  const { t } = useAppTranslation();
  const params = useParams();

  const isListing = useSelector(gameService, _isListing);
  const balance = useSelector(gameService, _balance);
  const maxLimit = useSelector(
    gameService,
    _maxLimit(display.name as InventoryItemName),
  );

  const [selectedListing, setSelectedListing] = useState<Listing>();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showBulkPurchaseModal, setShowBulkPurchaseModal] = useState(false);
  const [showBulkBuy, setShowBulkBuy] = useState(false);
  const [minAmount, setMinAmount] = useState(0); // Min amount of resources to purchase
  const [bulkOrder, setBulkOrder] = useState<BulkOrder>();

  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplaceListingSuccess",
    "playing",
    reload,
  );

  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplaceListing",
    "marketplaceListingSuccess",
  );

  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplacePurchasing",
    "marketplacePurchasingSuccess",
    () => {
      reload();
      if (showAnimations) confetti();
    },
  );

  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplaceListingCancellingSuccess",
    "playing",
    reload,
  );

  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplaceBulkListingsCancellingSuccess",
    "playing",
    reload,
  );

  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "loading",
    "playing",
    () =>
      reload(undefined, {
        optimisticData: tradeable
          ? {
              ...tradeable,
              listings:
                tradeable?.listings?.filter(
                  (listing) => selectedListing?.id !== listing.id,
                ) ?? [],
            }
          : undefined,
      }),
  );

  useEffect(() => {
    const cheapestListing = tradeable?.listings[0];

    if (!cheapestListing) return;
    if (minAmount < cheapestListing.sfl) return;

    const fn = debounce(buildBulkOrder, 200);

    fn();
  }, [minAmount]);

  const listingMap = useMemo(() => {
    return (tradeable?.listings ?? []).reduce(
      (acc, listing) => {
        acc[listing.id] = listing;
        return acc;
      },
      {} as Record<string, Listing>,
    );
  }, [tradeable?.listings]);

  const handleSelectListing = (id: string) => {
    const selectedListing = tradeable?.listings.find(
      (listing) => listing.id === id,
    ) as Listing;

    setSelectedListing(selectedListing);
    setShowPurchaseModal(true);
  };

  const handleBulkSelectListing = (id: string, checked: boolean) => {
    const listing = listingMap[id];

    if (checked) {
      setBulkOrder((prev) => ({
        quantity: (prev?.quantity ?? 0) + listing.quantity,
        price: (prev?.price ?? 0) + listing.sfl,
        ids: [...(prev?.ids ?? []), listing.id],
      }));
    } else {
      setBulkOrder((prev) => ({
        quantity: (prev?.quantity ?? 0) - listing.quantity,
        price: (prev?.price ?? 0) - listing.sfl,
        ids: (prev?.ids ?? []).filter((id) => id !== listing.id),
      }));
    }
  };

  const handleCancelBulkBuy = () => {
    setBulkOrder(undefined);
    setMinAmount(0);
  };

  const buildBulkOrder = () => {
    let selectedQuantity = bulkOrder?.quantity ?? 0;
    let totalPrice = bulkOrder?.price ?? 0;
    const selectedIds = [...(bulkOrder?.ids ?? [])];

    // filter already selected listings
    const unselectedListings = (tradeable?.listings ?? []).filter(
      (listing) => !selectedIds.includes(listing.id),
    );
    // iterate through the listings and add to the selected quantity until next one will push you over the max amount
    for (const listing of unselectedListings) {
      if (selectedQuantity >= minAmount) {
        break;
      }

      selectedIds.push(listing.id);
      selectedQuantity += listing.quantity;
      totalPrice += listing.sfl;
    }

    setBulkOrder({
      quantity: selectedQuantity,
      ids: selectedIds,
      price: totalPrice,
    });
  };

  const handleBuyBulkOrder = () => {};

  const isResource =
    isTradeResource(KNOWN_ITEMS[Number(params.id)]) &&
    params.collection === "collectibles";

  const loading = !tradeable;

  const highestOffer =
    tradeable?.offers.reduce((max, offer) => {
      return Math.max(max, offer.sfl);
    }, 0) ?? 0;

  return (
    <>
      <Modal
        show={showPurchaseModal}
        onHide={() => setShowPurchaseModal(false)}
      >
        <Panel>
          <PurchaseModalContent
            authToken={authToken}
            listingId={selectedListing?.id as string}
            price={selectedListing?.sfl ?? 0}
            tradeable={tradeable as Tradeable}
            onClose={() => setShowPurchaseModal(false)}
            listing={selectedListing as Listing}
          />
        </Panel>
      </Modal>
      <Modal
        show={showBulkPurchaseModal}
        onHide={() => setShowBulkPurchaseModal(false)}
      >
        <Panel>
          <PurchaseModalContent
            authToken={authToken}
            listingId={selectedListing?.id as string}
            price={selectedListing?.sfl ?? 0}
            tradeable={tradeable as Tradeable}
            onClose={() => setShowPurchaseModal(false)}
            listing={selectedListing as Listing}
          />
        </Panel>
      </Modal>
      <Modal show={showListItem} onHide={!isListing ? onListClose : undefined}>
        <Panel className="mb-1">
          <TradeableListItem
            authToken={authToken}
            display={display}
            id={id}
            floorPrice={tradeable?.floor ?? 0}
            highestOffer={highestOffer}
            onClose={onListClose}
          />
        </Panel>
        {isResource && <ResourceTaxes />}
      </Modal>
      <InnerPanel className="mb-1">
        <div className="p-2">
          <div className="flex justify-between">
            <div className="flex flex-col justify-center sm:flex-row gap-1 sm:justify-normal sm:items-center">
              <Label icon={tradeIcon} type="default" className="">
                {t("marketplace.listings")}
              </Label>
              {tradeable?.expiresAt && (
                <Label type={limitedTradesLeft <= 0 ? "danger" : "warning"}>
                  {`${1}/${MAX_LIMITED_SALES} Listings left`}
                </Label>
              )}
            </div>
            <div className="flex">
              {showBulkBuy && (
                <div className="flex gap-1">
                  <Button
                    className="w-fit h-8 rounded-none"
                    onClick={() => setShowBulkBuy(false)}
                  >
                    <p className="text-xxs sm:text-sm">{t("cancel")}</p>
                  </Button>
                  <Button
                    className="w-fit h-8 rounded-none"
                    onClick={handleCancelBulkBuy}
                  >
                    <p className="text-xxs sm:text-sm">{t("clear")}</p>
                  </Button>
                  <Button
                    className="w-fit h-8 rounded-none min-w-[60px]"
                    onClick={handleBuyBulkOrder}
                  >
                    <p className="text-xxs sm:text-sm">{t("buy")}</p>
                  </Button>
                </div>
              )}
              {!!tradeable?.listings.length &&
                isResource &&
                !showBulkBuy &&
                limitedTradesLeft === Infinity && (
                  <Button
                    className="w-fit h-8 rounded-none"
                    onClick={() => setShowBulkBuy(true)}
                  >
                    <p className="text-xxs sm:text-sm">
                      {t("marketplace.bulkBuy")}
                    </p>
                  </Button>
                )}
            </div>
          </div>
          {showBulkBuy && (
            <BulkBuyInterface
              resource={display.name as InventoryItemName}
              totalResources={bulkOrder?.quantity ?? 0}
              totalPrice={bulkOrder?.price ?? 0}
              minAmountToBuy={minAmount}
              onMinAmountChange={setMinAmount}
              maxLimit={maxLimit}
            />
          )}
          <div className="my-2">
            {loading && <Loading />}
            {!loading && tradeable?.listings.length === 0 && (
              <p className="text-sm">{t("marketplace.noListings")}</p>
            )}
            {!!tradeable?.listings.length &&
              (isResource ? (
                <ResourceTable
                  isResource={isResource}
                  isBulkBuy={showBulkBuy}
                  balance={balance}
                  details={display}
                  items={tradeable?.listings.map((listing) => ({
                    id: listing.id,
                    price: listing.sfl,
                    quantity: listing.quantity,
                    pricePerUnit: Number(
                      formatNumber(listing.sfl / listing.quantity, {
                        decimalPlaces: 4,
                      }),
                    ),
                    createdBy: listing.listedBy,
                  }))}
                  inventoryCount={count}
                  id={farmId}
                  tableType="listings"
                  onClick={
                    tradeable.isActive
                      ? (listingId) => {
                          handleSelectListing(listingId);
                          setShowPurchaseModal(true);
                        }
                      : undefined
                  }
                  onBulkListingSelect={handleBulkSelectListing}
                  bulkListingIds={bulkOrder?.ids ?? []}
                />
              ) : (
                <ListingTable
                  listings={tradeable?.listings}
                  details={display}
                  isResource={isResource}
                />
              ))}
          </div>
        </div>
      </InnerPanel>
    </>
  );
};
