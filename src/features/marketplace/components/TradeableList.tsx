import React, { useContext, useState } from "react";
import { useActor, useSelector } from "@xstate/react";
import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { MARKETPLACE_TAX } from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import tradeIcon from "assets/icons/trade.png";
import sflIcon from "assets/icons/flower_token.webp";
import lockIcon from "assets/icons/lock.png";

import { TradeableDisplay } from "../lib/tradeables";
import { Button } from "components/ui/Button";
import {
  getBasketItems,
  getChestBuds,
  getChestItems,
} from "features/island/hud/components/inventory/utils/inventory";
import { NumberInput } from "components/ui/NumberInput";
import { GameWallet } from "features/wallet/Wallet";
import { CONFIG } from "lib/config";
import { formatNumber } from "lib/utils/formatNumber";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { InventoryItemName } from "features/game/types/game";
import { BumpkinItem } from "features/game/types/bumpkin";
import { TradeableSummary } from "./TradeableSummary";
import { getTradeType } from "../lib/getTradeType";
import { ResourceList } from "./ResourceList";
import Decimal from "decimal.js-light";
import {
  CollectibleName,
  COLLECTIBLES_DIMENSIONS,
} from "features/game/types/craftables";
import {
  isTradeResource,
  TradeResource,
} from "features/game/actions/tradeLimits";
import { ITEM_DETAILS } from "features/game/types/images";
import { calculateTradePoints } from "features/game/events/landExpansion/addTradePoints";
import { MachineState } from "features/game/lib/gameMachine";
import { getDayOfYear } from "lib/utils/time";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";
import { SUNNYSIDE } from "assets/sunnyside";
import { FaceRecognition } from "features/retreat/components/personhood/FaceRecognition";
import { hasFeatureAccess } from "lib/flags";
import { isFaceVerified } from "features/retreat/components/personhood/lib/faceRecognition";

const _hasTradeReputation = (state: MachineState) =>
  hasReputation({
    game: state.context.state,
    reputation: Reputation.Cropkeeper,
  });

type TradeableListItemProps = {
  authToken: string;
  display: TradeableDisplay;
  id: number;
  floorPrice: number;
  highestOffer: number;
  onClose: () => void;
};

export const TradeableListItem: React.FC<TradeableListItemProps> = ({
  authToken,
  display,
  id,
  floorPrice,
  highestOffer,
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { t } = useAppTranslation();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showItemInUseWarning, setShowItemInUseWarning] = useState(false);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const hasTradeReputation = useSelector(gameService, _hasTradeReputation);

  const { state } = gameState.context;

  const getDailyListings = () => {
    const today = getDayOfYear(new Date());
    const dailyListings = gameState.context.state.trades.dailyListings ?? {
      date: 0,
      count: 0,
    };

    return dailyListings.date === today ? dailyListings.count : 0;
  };

  const dailyListings = getDailyListings();

  const hasAccess = hasTradeReputation || dailyListings < 1;

  const tradeType = getTradeType({
    collection: display.type,
    id,
    trade: {
      sfl: price,
    },
  });

  const isResource =
    isTradeResource(display.name as InventoryItemName) &&
    display.type === "collectibles";

  // Check inventory count
  const getCount = () => {
    switch (display.type) {
      case "collectibles":
        return (
          state.inventory[display.name as InventoryItemName]?.toNumber() || 0
        );
      case "buds":
        return getChestBuds(state)[id] ? 1 : 0;
      case "wearables":
        return state.wardrobe[display.name as BumpkinItem] || 0;

      default:
        return 0;
    }
  };

  const getAvailable = () => {
    const isPlaceable =
      COLLECTIBLES_DIMENSIONS[display.name as CollectibleName];
    switch (display.type) {
      case "collectibles":
        if (isPlaceable) {
          return (
            getChestItems(state)[
              display.name as InventoryItemName
            ]?.toNumber() ?? 0
          );
        }

        return (
          getBasketItems(state.inventory)[
            display.name as InventoryItemName
          ]?.toNumber() ?? 0
        );
      case "buds":
        return getChestBuds(state)[id] ? 1 : 0;
      case "wearables":
        return availableWardrobe(state)[display.name as BumpkinItem] ?? 0;
      default:
        return 0;
    }
  };

  // Otherwise show the list item UI
  const submitListing = () => {
    if (count > 0 && available === 0) {
      setShowItemInUseWarning(true);
      return;
    }

    setShowConfirmation(true);
  };

  const confirm = async ({ signature }: { signature?: string }) => {
    gameService.send("marketplace.listed", {
      effect: {
        type: "marketplace.listed",
        itemId: id,
        collection: display.type,
        sfl: price,
        signature,
        quantity: Math.max(1, quantity),
        contract: CONFIG.MARKETPLACE_VERIFIER_CONTRACT,
      },
      authToken,
    });

    onClose();
  };

  const count = getCount();
  const available = getAvailable();

  if (showItemInUseWarning) {
    return (
      <div className="flex flex-col">
        <Label type="danger" className="my-1 ml-2" icon={lockIcon}>
          {t("marketplace.itemInUse")}
        </Label>
        <div className="p-2 mb-1">{t("marketplace.itemInUseWarning")}</div>
        <Button onClick={onClose}>{t("close")}</Button>
      </div>
    );
  }

  const estTradePoints =
    price === 0
      ? 0
      : calculateTradePoints({
          sfl: price,
          points: tradeType === "instant" ? 1 : 3,
        }).multipliedPoints;

  const isLessThanOffer = price <= highestOffer && !isResource;

  if (
    showConfirmation &&
    isResource &&
    hasFeatureAccess(gameState.context.state, "FACE_RECOGNITION") &&
    !isFaceVerified({ game: gameState.context.state })
  ) {
    return <FaceRecognition />;
  }

  const needsLinkedWallet =
    tradeType === "onchain" && !gameService.getSnapshot().context.linkedWallet;

  if (showConfirmation) {
    if (needsLinkedWallet) {
      return (
        <GameWallet action="marketplace">
          <div className="p-2">
            <Label type="danger" className="-ml-1 mb-2">
              {t("are.you.sure")}
            </Label>
            {isLessThanOffer && (
              <Label type="danger" icon={lockIcon} className="my-1 mr-0.5">
                {t("marketplace.higherThanOffer", { price: highestOffer })}
              </Label>
            )}
            <p className="text-xs mb-2">{t("marketplace.confirmDetails")}</p>
            <TradeableSummary
              display={display}
              sfl={price}
              quantity={Math.max(1, quantity)}
              estTradePoints={estTradePoints}
            />
            <div className="flex items-start mt-2">
              <img src={SUNNYSIDE.icons.search} className="h-6 mr-2" />
              <p className="text-xs mb-2">{t("marketplace.dodgyTrades")}</p>
            </div>
          </div>

          <div className="flex">
            <Button onClick={() => setShowConfirmation(false)} className="mr-1">
              {t("cancel")}
            </Button>
            <Button disabled={isLessThanOffer} onClick={() => confirm({})}>
              {t("confirm")}
            </Button>
          </div>
        </GameWallet>
      );
    }

    return (
      <>
        <div className="p-2">
          <Label type="danger" className="-ml-1 mb-2">
            {t("are.you.sure")}
          </Label>
          {isLessThanOffer && (
            <Label type="danger" icon={lockIcon} className="my-1 mr-0.5">
              {t("marketplace.higherThanOffer", { price: highestOffer })}
            </Label>
          )}
          <p className="text-xs mb-2">{t("marketplace.confirmDetails")}</p>
          <TradeableSummary
            display={display}
            sfl={price}
            quantity={Math.max(1, quantity)}
            estTradePoints={estTradePoints}
          />
          <div className="flex items-start mt-2">
            <img src={SUNNYSIDE.icons.search} className="h-6 mr-2" />
            <p className="text-xs mb-2">{t("marketplace.dodgyTrades")}</p>
          </div>
        </div>

        <div className="flex">
          <Button onClick={() => setShowConfirmation(false)} className="mr-1">
            {t("cancel")}
          </Button>
          <Button disabled={isLessThanOffer} onClick={() => confirm({})}>
            {t("confirm")}
          </Button>
        </div>
      </>
    );
  }

  if (isResource) {
    return (
      <ResourceList
        inventoryCount={new Decimal(available)}
        itemName={display.name as TradeResource}
        floorPrice={floorPrice}
        isSaving={false}
        onCancel={onClose}
        onList={submitListing}
        price={price}
        quantity={quantity}
        setPrice={setPrice}
        setQuantity={setQuantity}
      />
    );
  }

  const usd = gameService.getSnapshot().context.prices.sfl?.usd ?? 0.0;

  return (
    <div className="flex flex-col">
      <div className="flex justify-between flex-wrap">
        <Label type="default" className="my-1 ml-2" icon={tradeIcon}>
          {t("marketplace.listItem", {
            type: `${display.type.slice(0, display.type.length - 1)}`,
          })}
        </Label>

        {!hasAccess && (
          <RequiredReputation reputation={Reputation.Cropkeeper} />
        )}
      </div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <Box image={display.image} disabled />
          <span className="text-sm">{display.name}</span>
        </div>
        <div className="flex items-center mr-1">
          <Label type={available < 1 ? "danger" : "default"}>
            {t("marketplace.availableCount", { count: available })}
          </Label>
        </div>
      </div>
      {count < 1 ? (
        <>
          <div className="p-2">{t("marketplace.youDontOwn")}</div>
          <Button onClick={onClose}>{t("close")}</Button>
        </>
      ) : (
        <>
          <div className="flex flex-col p-2">
            <Label type="default" icon={sflIcon}>
              {t("bumpkinTrade.price")}
            </Label>
            <div className="my-2 -mx-2">
              <NumberInput
                value={price}
                onValueChange={(decimal) => setPrice(decimal.toNumber())}
                maxDecimalPlaces={tradeType === "onchain" ? 0 : 4}
                icon={sflIcon}
              />
              <p className="text-xxs ml-2">
                {`$${new Decimal(usd).mul(price).toFixed(2)}`}
              </p>
            </div>
            <div
              className="flex justify-between"
              style={{
                borderBottom: "1px solid #ead4aa",
                padding: "5px 5px 5px 2px",
              }}
            >
              <span className="text-xs"> {t("bumpkinTrade.listingPrice")}</span>
              <p className="text-xs font-secondary">{`${formatNumber(price, {
                decimalPlaces: 4,
                showTrailingZeros: true,
              })} FLOWER`}</p>
            </div>
            <div
              className="flex justify-between"
              style={{
                borderBottom: "1px solid #ead4aa",
                padding: "5px 5px 5px 2px",
              }}
            >
              <span className="text-xs"> {t("bumpkinTrade.tradingFee")}</span>
              <p className="text-xs font-secondary">{`${formatNumber(
                price * 0.1,
                {
                  decimalPlaces: 4,
                  showTrailingZeros: true,
                },
              )} FLOWER`}</p>
            </div>
            <div
              className="flex justify-between"
              style={{
                borderBottom: "1px solid #ead4aa",
                padding: "5px 5px 5px 2px",
              }}
            >
              <span className="text-xs">
                {t("bumpkinTrade.youWillReceive")}
              </span>
              <p className="text-xs font-secondary">{`${formatNumber(
                new Decimal(price).mul(1 - MARKETPLACE_TAX),
                {
                  decimalPlaces: 4,
                  showTrailingZeros: true,
                },
              )} FLOWER`}</p>
            </div>
            <div
              className="flex justify-between"
              style={{
                padding: "5px 5px 5px 2px",
              }}
            >
              <span className="text-xs">{`Trade Points earned`}</span>
              <div className="flex flex-row">
                <p className="text-xs font-secondary mr-1">{`${formatNumber(
                  new Decimal(estTradePoints),
                  {
                    decimalPlaces: 2,
                  },
                )}`}</p>
                <img src={ITEM_DETAILS["Trade Point"].image} />
              </div>
            </div>
            <Label type="default" icon={lockIcon} className="my-1 -ml-0.5">
              {t("marketplace.itemSecured")}
            </Label>
            <div className="text-xxs">
              {t("marketplace.itemSecuredWarning")}
            </div>
          </div>

          <div className="flex space-x-1">
            <Button onClick={onClose}>{t("close")}</Button>
            <Button
              disabled={!price}
              onClick={submitListing}
              className="relative"
            >
              <span>{t("list")}</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
