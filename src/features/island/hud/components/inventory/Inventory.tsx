import PubSub from "pubsub-js";
import React, { useEffect, useState } from "react";
import { Box } from "components/ui/Box";
import { InventoryItemsModal } from "./InventoryItemsModal";
import { ITEM_DETAILS } from "features/game/types/images";
import { GameState, InventoryItemName } from "features/game/types/game";
import { getShortcuts } from "features/farming/hud/lib/shortcuts";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleName, getKeys } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import { getChestItems } from "./utils/inventory";
import { KNOWN_IDS } from "features/game/types";
import { BudName } from "features/game/types/buds";
import { useSound } from "lib/utils/hooks/useSound";

interface Props {
  state: GameState;
  selectedItem?: InventoryItemName;
  isFullUser: boolean;
  shortcutItem?: (item: InventoryItemName) => void;
  onPlace?: (item: InventoryItemName) => void;
  onPlaceBud?: (bud: BudName) => void;
  onDepositClick?: () => void;
  isFarming: boolean;
  isSaving?: boolean;
  hideActions: boolean;
}

export const Inventory: React.FC<Props> = ({
  state,
  selectedItem: selectedBasketItem,
  shortcutItem,
  isFullUser,
  isFarming,
  isSaving,
  onPlace,
  onPlaceBud,
  onDepositClick,
  hideActions,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const inventory = useSound("inventory");

  useEffect(() => {
    const eventSubscription = PubSub.subscribe("OPEN_INVENTORY", () => {
      setIsOpen(true);
    });

    return () => {
      PubSub.unsubscribe(eventSubscription);
    };
  }, []);

  const buds = getKeys(state.buds ?? {}).map(
    (budId) => `Bud-${budId}` as BudName,
  );

  const [selectedChestItem, setSelectedChestItem] = useState<
    InventoryItemName | BudName
  >(
    [
      ...buds,
      ...getKeys(getChestItems(state)).sort(
        (a, b) => KNOWN_IDS[a] - KNOWN_IDS[b],
      ),
    ][0],
  );

  const shortcuts = getShortcuts();

  const handleBasketItemClick = (item: InventoryItemName) => {
    if (!shortcutItem) return;

    shortcutItem(item);
  };

  return (
    <>
      <div
        className="flex flex-col items-center absolute z-50"
        style={{
          right: `${PIXEL_SCALE * 3}px`,
          top: `${PIXEL_SCALE * (isFarming ? 58 : 31)}px`,
        }}
      >
        <div
          onClick={() => {
            inventory.play();
            setIsOpen(true);
          }}
          className="relative flex z-50 cursor-pointer hover:img-highlight"
          style={{
            marginLeft: `${PIXEL_SCALE * 2}px`,
            marginBottom: `${PIXEL_SCALE * 25}px`,
            width: `${PIXEL_SCALE * 22}px`,
          }}
        >
          <img
            src={SUNNYSIDE.ui.round_button}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 22}px`,
            }}
          />
          <img
            src={SUNNYSIDE.icons.basket}
            className="absolute"
            style={{
              top: `${PIXEL_SCALE * 5}px`,
              left: `${PIXEL_SCALE * 5}px`,
              width: `${PIXEL_SCALE * 12}px`,
            }}
          />
        </div>

        {!hideActions && (
          <div
            className="flex flex-col items-center"
            style={{
              marginRight: `${PIXEL_SCALE * -3}px`,
            }}
          >
            {shortcuts.map((item, index) => (
              <Box
                key={index}
                isSelected={index === 0}
                image={ITEM_DETAILS[item]?.image}
                secondaryImage={ITEM_DETAILS[item]?.secondaryImage}
                count={state.inventory[item]?.sub(
                  state.collectibles[item as CollectibleName]?.length ?? 0,
                )}
                onClick={() => handleBasketItemClick(item)}
              />
            ))}
          </div>
        )}
      </div>

      <InventoryItemsModal
        show={isOpen}
        onHide={() => {
          setIsOpen(false);
        }}
        state={state}
        selectedBasketItem={selectedBasketItem}
        onSelectBasketItem={handleBasketItemClick}
        selectedChestItem={selectedChestItem}
        onSelectChestItem={setSelectedChestItem}
        onPlace={onPlace}
        onPlaceBud={onPlaceBud}
        onDepositClick={onDepositClick}
        isSaving={isSaving}
        isFarming={isFarming}
        isFullUser={isFullUser}
      />
    </>
  );
};
