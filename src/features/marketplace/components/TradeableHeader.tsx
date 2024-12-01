import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { Panel, InnerPanel } from "components/ui/Panel";
import {
  CollectionName,
  TradeableDetails,
  Tradeable,
} from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import sflIcon from "assets/icons/sfl.webp";
import walletIcon from "assets/icons/wallet.png";
import { GameWallet } from "features/wallet/Wallet";
import { Context } from "features/game/GameProvider";
import confetti from "canvas-confetti";
import {
  BlockchainEvent,
  Context as ContextType,
  MachineState,
} from "features/game/lib/gameMachine";
import { useOnMachineTransition } from "lib/utils/hooks/useOnMachineTransition";
import { PurchaseModalContent } from "./PurchaseModalContent";
import { TradeableDisplay } from "../lib/tradeables";
import { formatNumber } from "lib/utils/formatNumber";
import { KNOWN_ITEMS } from "features/game/types";
import { useSelector } from "@xstate/react";
import { useParams } from "react-router-dom";
import { getKeys } from "features/game/types/craftables";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";
import { VIPAccess } from "features/game/components/VipAccess";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import classNames from "classnames";
import { ITEM_DETAILS } from "features/game/types/images";
import { isMobile } from "mobile-device-detect";

type TradeableHeaderProps = {
  authToken: string;
  dailyListings: number;
  farmId: number;
  collection: CollectionName;
  display: TradeableDisplay;
  tradeable?: TradeableDetails;
  count: number;
  pricePerUnit?: number;
  onBack: () => void;
  onListClick: () => void;
  reload: () => void;
};

const _balance = (state: MachineState) => state.context.state.balance;
const _isVIP = (state: MachineState) =>
  hasVipAccess(state.context.state.inventory);

export const TradeableHeader: React.FC<TradeableHeaderProps> = ({
  dailyListings,
  authToken,
  farmId,
  count,
  tradeable,
  onListClick,
  reload,
}) => {
  const { gameService } = useContext(Context);
  const { openModal } = useContext(ModalContext);
  const balance = useSelector(gameService, _balance);
  const isVIP = useSelector(gameService, _isVIP);
  const params = useParams();

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const { t } = useAppTranslation();
  // Remove listings that are mine
  const filteredListings =
    tradeable?.listings.filter((listing) => listing.listedById !== farmId) ??
    [];

  // Filter out my own listings
  const cheapestListing = filteredListings.reduce((cheapest, listing) => {
    return listing.sfl < cheapest.sfl ? listing : cheapest;
  }, filteredListings[0]);

  // Handle instant purchase
  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplacePurchasingSuccess",
    "playing",
    reload,
    cheapestListing?.type === "instant",
  );

  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplacePurchasing",
    "marketplacePurchasingSuccess",
    confetti,
    cheapestListing?.type === "instant",
  );

  // Auto close this success modal because the transaction modal will be shown
  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplacePurchasing",
    "marketplacePurchasingSuccess",
    () => {
      gameService.send("CONTINUE");
      setShowPurchaseModal(false);
    },
    cheapestListing?.type === "onchain",
  );

  const isResources =
    getKeys(TRADE_LIMITS).includes(KNOWN_ITEMS[Number(params.id)]) &&
    params.collection === "collectibles";

  if (!isResources && !cheapestListing) return null;

  const showBuyNow = !isResources && cheapestListing;
  const showWalletRequired = showBuyNow && cheapestListing?.type === "onchain";
  const showFreeListing = !isVIP && dailyListings === 0;

  return (
    <>
      {cheapestListing && (
        <Modal
          show={showPurchaseModal}
          onHide={() => setShowPurchaseModal(false)}
        >
          <Panel>
            {cheapestListing.type === "onchain" ? (
              <GameWallet action="marketplace">
                <PurchaseModalContent
                  authToken={authToken}
                  listingId={cheapestListing.id}
                  price={cheapestListing?.sfl ?? 0}
                  tradeable={tradeable as Tradeable}
                  onClose={() => setShowPurchaseModal(false)}
                  listing={cheapestListing}
                />
              </GameWallet>
            ) : (
              <PurchaseModalContent
                authToken={authToken}
                listingId={cheapestListing.id}
                price={cheapestListing?.sfl ?? 0}
                tradeable={tradeable as Tradeable}
                onClose={() => setShowPurchaseModal(false)}
                listing={cheapestListing}
              />
            )}
          </Panel>
        </Modal>
      )}
      <InnerPanel className="w-full mb-1">
        <div className="p-2 pt-1">
          <div className="flex flex-wrap items-center justify-between mb-3 space-y-1">
            <div
              className={classNames("flex items-center justify-between", {
                "w-full": isMobile && showWalletRequired,
              })}
            >
              <Label
                type="default"
                className="mr-0 sm:mr-3"
                icon={
                  isResources
                    ? ITEM_DETAILS[KNOWN_ITEMS[Number(params.id)]].image
                    : undefined
                }
              >
                {t("marketplace.youOwn", {
                  count: Math.floor(count),
                })}
              </Label>
              {showWalletRequired && (
                <Label type="formula" icon={walletIcon}>
                  {t("marketplace.walletRequired")}
                </Label>
              )}
            </div>
            <div
              className={classNames("flex items-center justify-between", {
                "w-full": isMobile && showFreeListing,
              })}
            >
              <VIPAccess
                isVIP={isVIP}
                onUpgrade={() => {
                  openModal("BUY_BANNER");
                }}
                text={t("marketplace.unlockSelling")}
              />
              {!isVIP && dailyListings === 0 && (
                <Label type="success" className="ml-0 sm:ml-3">
                  {t("remaining.free.listing")}
                </Label>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap">
            {showBuyNow && (
              <div className="flex items-center mr-2 sm:mb-0.5 -ml-1">
                <>
                  <img src={sflIcon} className="h-8 ml-1 mr-2" />
                  <p className="text-base">{`${cheapestListing.sfl} SFL`}</p>
                </>
              </div>
            )}
            {isResources ? (
              <div className="flex h-full items-center mr-2 sm:mb-0.5 -ml-1">
                <>
                  <div className="flex flex-col space-y-1">
                    <div className="flex">
                      <img src={sflIcon} className="h-8 mr-2 ml-1" />
                      {tradeable ? (
                        <p className="text-base">
                          {t("marketplace.pricePerUnit", {
                            price: tradeable.floor
                              ? formatNumber(tradeable.floor, {
                                  decimalPlaces: 4,
                                  showTrailingZeros: true,
                                })
                              : "?",
                          })}
                        </p>
                      ) : (
                        <>
                          <span className="text-base loading-fade-pulse">
                            {t("marketplace.pricePerUnit", {
                              price: "0.0000",
                            })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </>
              </div>
            ) : (
              // Dummy div to keep the layout consistent
              <div className="flex items-center mr-2 sm:mb-0.5 -ml-1" />
            )}
            {/* Desktop display */}
            <div className="self-end justify-between hidden sm:flex sm:visible w-full sm:w-auto">
              {showBuyNow && (
                <Button
                  onClick={() => setShowPurchaseModal(true)}
                  disabled={!balance.gt(cheapestListing.sfl)}
                  className="mr-1 w-full sm:w-auto"
                >
                  {t("marketplace.buyNow")}
                </Button>
              )}
              <Button
                disabled={!tradeable}
                onClick={onListClick}
                className="w-full sm:w-auto"
              >
                {t("marketplace.listForSale")}
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile display */}
        <div className="flex items-center justify-between sm:hidden w-full sm:w-auto">
          {showBuyNow && (
            <Button
              onClick={() => setShowPurchaseModal(true)}
              disabled={!balance.gt(cheapestListing.sfl)}
              className="mr-1 w-full sm:w-auto"
            >
              {t("marketplace.buyNow")}
            </Button>
          )}
          <Button
            onClick={onListClick}
            disabled={!count || (!isVIP && dailyListings >= 1)}
            className="w-full sm:w-auto"
          >
            {t("marketplace.listForSale")}
          </Button>
        </div>
      </InnerPanel>
    </>
  );
};
