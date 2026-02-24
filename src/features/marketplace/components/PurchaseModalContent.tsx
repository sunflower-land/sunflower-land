import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Tradeable, Listing } from "features/game/types/marketplace";
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

type PurchaseModalContentProps = {
  authToken: string;
  listingId: string;
  tradeable: Tradeable;
  listing: Listing;
  price: number;
  onClose: () => void;
};

const _state = (state: MachineState) => state.context.state;

export const PurchaseModalContent: React.FC<PurchaseModalContentProps> = ({
  authToken,
  tradeable,
  price,
  listingId,
  onClose,
  listing,
}) => {
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

  let updatedInventory = inventory;
  if (collection === "collectibles") {
    updatedInventory = {
      ...inventory,
      [KNOWN_ITEMS[tradeable.id]]: (
        inventory[KNOWN_ITEMS[tradeable.id]] ?? new Decimal(0)
      ).add(listing.quantity),
    };
  }

  const now = useNow();

  const hasMax = hasMaxItems({
    currentInventory: updatedInventory,
    oldInventory: previousInventory,
    currentWardrobe: wardrobe,
    oldWardrobe: previousWardrobe,
    now,
  });

  const confirm = async () => {
    gameService.send("marketplace.listingPurchased", {
      effect: {
        type: "marketplace.listingPurchased",
        id: listingId,
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
          points: listing.type === "instant" ? 2 : 4,
        }).multipliedPoints;

  if (hasMax && listing.type === "instant") {
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
              quantity={listing.quantity}
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
        <p className="mb-3">{t("marketplace.areYouSureYouWantToBuy")}</p>
        <TradeableItemDetails
          display={display}
          sfl={price}
          quantity={listing.quantity}
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
