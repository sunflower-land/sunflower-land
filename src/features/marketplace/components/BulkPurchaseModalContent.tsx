import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Tradeable } from "features/game/types/marketplace";
import { getTradeableDisplay } from "../lib/tradeables";
import walletIcon from "assets/icons/wallet.png";
import { Context } from "features/game/GameProvider";
import { TradeableItemDetails } from "./TradeableSummary";
import { KNOWN_ITEMS } from "features/game/types";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { hasMaxItems } from "features/game/lib/processEvent";
import Decimal from "decimal.js-light";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { calculateTradePoints } from "features/game/events/landExpansion/addTradePoints";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";

const _inventory = (state: MachineState) => state.context.state.inventory;
const _previousInventory = (state: MachineState) =>
  state.context.state.previousInventory;
const _wardrobe = (state: MachineState) => state.context.state.wardrobe;
const _previousWardrobe = (state: MachineState) =>
  state.context.state.previousWardrobe;

type BulkPurchaseModalContentProps = {
  authToken: string;
  listingIds: string[];
  tradeable: Tradeable;
  quantity: number;
  price: number;
  onClose: () => void;
};

const _state = (state: MachineState) => state.context.state;

export const BulkPurchaseModalContent: React.FC<
  BulkPurchaseModalContentProps
> = ({ authToken, tradeable, quantity, price, listingIds, onClose }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const { openModal } = useContext(ModalContext);
  const state = useSelector(gameService, _state);

  const inventory = useSelector(gameService, _inventory);
  const previousInventory = useSelector(gameService, _previousInventory);
  const wardrobe = useSelector(gameService, _wardrobe);
  const previousWardrobe = useSelector(gameService, _previousWardrobe);

  const collection = tradeable.collection;
  const display = getTradeableDisplay({
    id: tradeable.id,
    type: collection,
    state,
  });

  const updatedInventory = {
    ...inventory,
    [KNOWN_ITEMS[tradeable.id]]: (
      inventory[KNOWN_ITEMS[tradeable.id]] ?? new Decimal(0)
    ).add(quantity),
  };

  const now = useNow();

  const hasMax = hasMaxItems({
    currentInventory: updatedInventory,
    oldInventory: previousInventory,
    currentWardrobe: wardrobe,
    oldWardrobe: previousWardrobe,
    now,
  });

  const confirm = async () => {
    gameService.send("marketplace.buyBulkResources", {
      effect: {
        type: "marketplace.buyBulkResources",
        itemId: tradeable.id,
        listingIds,
      },
      authToken,
    });

    onClose();
  };

  const estTradePoints =
    price === 0
      ? 0
      : calculateTradePoints({
          sfl: price,
          points: 2,
        }).multipliedPoints;

  if (hasMax) {
    return (
      <>
        <div className="p-2">
          <div className="flex justify-between">
            <Label type="danger" className="mb-2 ml-1" icon={walletIcon}>
              {t("marketplace.hoarding")}
            </Label>
          </div>
          <p className="mb-3">{t("marketplace.hoarding.description")}</p>
          <div className="opacity-50">
            <TradeableItemDetails
              display={display}
              sfl={price}
              quantity={quantity}
            />
          </div>
        </div>
        <div className="flex space-x-1">
          <Button onClick={onClose}>{t("cancel")}</Button>
          <Button
            onClick={() => {
              onClose();
              openModal("STORE_ON_CHAIN");
            }}
            className="relative"
          >
            <span>{t("gameOptions.blockchainSettings.storeOnChain")}</span>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="p-2">
        <div className="flex justify-between">
          <Label type="default" className="mb-2 -ml-1">{`Purchase`}</Label>
        </div>
        <p className="mb-3">{t("marketplace.areYouSureBulkBuy")}</p>
        <TradeableItemDetails
          display={display}
          sfl={price}
          quantity={quantity}
          estTradePoints={estTradePoints}
        />
      </div>
      <div className="flex space-x-1">
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button
          onClick={() => confirm()}
          disabled={hasMax}
          className="relative"
        >
          <span>{t("confirm")}</span>
        </Button>
      </div>
    </>
  );
};
