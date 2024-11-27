import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { Panel, InnerPanel } from "components/ui/Panel";
import {
  CollectionName,
  TradeableDetails,
  Tradeable,
} from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import sflIcon from "assets/icons/sfl.webp";
import { GameWallet } from "features/wallet/Wallet";
import { Context } from "features/game/GameProvider";
import confetti from "canvas-confetti";
import {
  BlockchainEvent,
  Context as ContextType,
} from "features/game/lib/gameMachine";
import { useOnMachineTransition } from "lib/utils/hooks/useOnMachineTransition";
import { PurchaseModalContent } from "./PurchaseModalContent";
import { TradeableDisplay } from "../lib/tradeables";
import { formatNumber } from "lib/utils/formatNumber";
import { useParams } from "react-router-dom";
import { Label } from "components/ui/Label";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";
import { getKeys } from "features/game/types/craftables";
import { KNOWN_ITEMS } from "features/game/types";

type TradeableHeaderProps = {
  authToken: string;
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

export const TradeableHeader: React.FC<TradeableHeaderProps> = ({
  authToken,
  farmId,
  count,
  tradeable,
  onListClick,
  reload,
}) => {
  const { gameService } = useContext(Context);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const params = useParams();
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

  // If no listings or offers, return null
  if (!isResources && !cheapestListing) {
    return null;
  }

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
        <div className="p-2">
          <div className="flex items-center h-full justify-between flex-wrap">
            {isResources ? (
              <div className="flex h-full items-center mr-2 sm:mb-0.5 -ml-1">
                <>
                  <div className="flex flex-col space-y-1">
                    <Label type="default" className="mb-2">
                      {t("marketplace.youOwn", {
                        count: Math.floor(count),
                      })}
                    </Label>
                    <div className="flex">
                      <img src={sflIcon} className="h-8 mr-2" />
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
        <div className="flex justify-between sm:hidden w-full sm:w-auto">
          <Button
            onClick={onListClick}
            disabled={!count}
            className="w-full sm:w-auto"
          >
            {t("marketplace.listForSale")}
          </Button>
        </div>
      </InnerPanel>
    </>
  );
};
