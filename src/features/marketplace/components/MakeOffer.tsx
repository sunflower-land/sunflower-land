import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { NumberInput } from "components/ui/NumberInput";
import { MachineState } from "features/game/lib/gameMachine";
import { GameWallet } from "features/wallet/Wallet";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { TradeableDisplay } from "../lib/tradeables";
import { Context } from "features/game/GameProvider";

import sflIcon from "assets/icons/flower_token.webp";
import lockIcon from "assets/icons/lock.png";
import { TradeableItemDetails } from "./TradeableSummary";
import { getTradeType } from "../lib/getTradeType";
import { ResourceOffer } from "./ResourceOffer";
import {
  isTradeResource,
  TradeResource,
} from "features/game/actions/tradeLimits";
import { KNOWN_ITEMS } from "features/game/types";
import Decimal from "decimal.js-light";
import { calculateTradePoints } from "features/game/events/landExpansion/addTradePoints";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";
import { SUNNYSIDE } from "assets/sunnyside";
import { getKeys } from "features/game/lib/crafting";

const _balance = (state: MachineState) => state.context.state.balance;
const _hasReputation = (state: MachineState) =>
  hasReputation({
    game: state.context.state,
    reputation: Reputation.Cropkeeper,
  });
const _usd = (state: MachineState) => state.context.prices.sfl?.usd ?? 0.0;

export const MakeOffer: React.FC<{
  display: TradeableDisplay;
  floorPrice: number;
  itemId: number;
  authToken: string;
  onClose: () => void;
}> = ({ onClose, display, itemId, authToken, floorPrice }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const balance = useSelector(gameService, _balance);
  const hasTradeReputation = useSelector(gameService, _hasReputation);
  const usd = useSelector(gameService, _usd);

  const [offer, setOffer] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const isResource =
    display.type === "collectibles" &&
    isTradeResource(KNOWN_ITEMS[Number(itemId)]);

  const tradeType = getTradeType({
    collection: display.type,
    id: itemId,
    trade: {
      sfl: offer,
    },
  });

  const offers = gameService.getSnapshot().context.state.trades.offers ?? {};
  const offerCount = getKeys(offers).length;

  const itemOfferCount = getKeys(offers).filter(
    (id) => !!offers[id].items[display.name],
  ).length;

  const submitOffer = () => {
    setShowConfirmation(true);
  };

  const confirm = async ({ signature }: { signature?: string }) => {
    gameService.send("marketplace.offerMade", {
      effect: {
        type: "marketplace.offerMade",
        id: itemId,
        collection: display.type,
        signature,
        quantity: Math.max(1, quantity),
        sfl: offer,
      },
      authToken,
    });

    onClose();
  };

  const estTradePoints =
    offer === 0
      ? 0
      : calculateTradePoints({
          sfl: offer,
          points: tradeType === "instant" ? 2 : 4,
        }).multipliedPoints;

  const needsLinkedWallet =
    tradeType === "onchain" && !gameService.getSnapshot().context.linkedWallet;

  if (offerCount >= 100) {
    return (
      <>
        <div className="p-2">
          <Label type="danger" className="-ml-1 mb-2">
            {t("marketplace.offerLimitReached.label")}
          </Label>
          <p className="text-xs mb-2">{t("marketplace.offerLimitReached")}</p>
        </div>
        <Button onClick={() => onClose()}>{t("close")}</Button>
      </>
    );
  }

  if (itemOfferCount >= 5) {
    return (
      <>
        <div className="p-2">
          <Label type="danger" className="-ml-1 mb-2">
            {t("marketplace.offerItemLimitReached.label")}
          </Label>
          <p className="text-xs mb-2">
            {t("marketplace.offerItemLimitReached")}
          </p>
        </div>
        <Button onClick={() => onClose()}>{t("close")}</Button>
      </>
    );
  }

  if (showConfirmation) {
    if (needsLinkedWallet) {
      return (
        <GameWallet action="marketplace">
          <div className="p-2">
            <Label type="danger" className="-ml-1 mb-2">
              {t("are.you.sure")}
            </Label>
            <p className="text-xs mb-2">{t("marketplace.confirmDetails")}</p>
            <TradeableItemDetails
              display={display}
              quantity={Math.max(1, quantity)}
              sfl={offer}
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
            <Button onClick={() => confirm({})}>{t("confirm")}</Button>
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
          <p className="text-xs mb-2">{t("marketplace.confirmDetails")}</p>
          <TradeableItemDetails
            display={display}
            quantity={Math.max(1, quantity)}
            sfl={offer}
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
          <Button onClick={() => confirm({})}>{t("confirm")}</Button>
        </div>
      </>
    );
  }

  if (isResource) {
    return (
      <ResourceOffer
        itemName={display.name as TradeResource}
        floorPrice={floorPrice}
        isSaving={false}
        onCancel={onClose}
        onOffer={() => confirm({})}
        price={offer}
        quantity={quantity}
        setPrice={setOffer}
        setQuantity={setQuantity}
      />
    );
  }

  /* TODO only use game wallet when required */
  return (
    <>
      <div className="p-2">
        <div className="flex flex-wrap justify-between mb-2">
          <Label type="default" className="-ml-1 mb-1">
            {t("marketplace.makeOffer")}
          </Label>
          {!hasTradeReputation && (
            <RequiredReputation reputation={Reputation.Cropkeeper} />
          )}
        </div>
        <p className="text-sm">{t("marketplace.howMuch")}</p>
        <div className="my-2 -mx-2">
          <NumberInput
            value={offer}
            onValueChange={(decimal) => setOffer(decimal.toNumber())}
            maxDecimalPlaces={tradeType === "onchain" ? 0 : 4}
            isOutOfRange={balance.lt(offer)}
            icon={sflIcon}
          />
          <p className="text-xxs ml-2">
            {`$${new Decimal(usd).mul(offer).toFixed(2)}`}
          </p>
        </div>

        <Label type="default" className="-ml-1 mb-1" icon={lockIcon}>
          {t("marketplace.sflLocked")}
        </Label>
        <p className="text-xs mb-2">{t("marketplace.sflLocked.description")}</p>
      </div>

      <div className="flex">
        <Button className="mr-1" onClick={() => onClose()}>
          {t("cancel")}
        </Button>
        <Button
          disabled={!offer || balance.lt(offer) || !hasTradeReputation}
          onClick={submitOffer}
          className="relative"
        >
          <span>{t("confirm")}</span>
        </Button>
      </div>
    </>
  );
};
