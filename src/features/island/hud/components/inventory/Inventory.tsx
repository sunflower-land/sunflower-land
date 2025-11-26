import PubSub from "pubsub-js";
import React, { useContext, useEffect, useState } from "react";
import { Box } from "components/ui/Box";
import { InventoryItemsModal } from "./InventoryItemsModal";
import { ITEM_DETAILS } from "features/game/types/images";
import { GameState, InventoryItemName } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleName } from "features/game/types/craftables";
import { BasketButton } from "./BasketButton";
import { SeedName, SEEDS } from "features/game/types/seeds";
import {
  LandscapingPlaceable,
  LandscapingPlaceableType,
} from "features/game/expansion/placeable/landscapingMachine";
import { NFTName } from "features/game/events/landExpansion/placeNFT";
import { Context } from "features/game/GameProvider";

interface Props {
  state: GameState;
  selectedItem?: InventoryItemName;
  isFullUser: boolean;
  shortcutItem?: (item: InventoryItemName) => void;
  onPlace?: (item: LandscapingPlaceable) => void;
  onPlaceNFT?: (id: string, nft: NFTName) => void;
  onDepositClick?: () => void;
  isFarming: boolean;
  isSaving?: boolean;
  hideActions: boolean;
}

export const Inventory: React.FC<Props> = ({
  state,
  selectedItem,
  shortcutItem,
  isFullUser,
  isFarming,
  isSaving,
  onPlace,
  onPlaceNFT,
  onDepositClick,
  hideActions,
}) => {
  const { shortcuts } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const eventSubscription = PubSub.subscribe("OPEN_INVENTORY", () => {
      setIsOpen(true);
    });

    return () => {
      PubSub.unsubscribe(eventSubscription);
    };
  }, []);

  const [selectedChestItem, setSelectedChestItem] =
    useState<LandscapingPlaceableType>();
  // [
  //   ...buds,
  //   ...getKeys(getChestItems(state)).sort(
  //     (a, b) => KNOWN_IDS[a] - KNOWN_IDS[b],
  //   ),
  // ][0],

  const handleBasketItemClick = (item: InventoryItemName) => {
    if (!shortcutItem) return;

    shortcutItem(item);
  };

  const getSecondaryImage = (item: InventoryItemName) => {
    const seed = SEEDS[item as SeedName];
    return seed?.yield
      ? ITEM_DETAILS[seed.yield].image
      : ITEM_DETAILS[item]?.secondaryImage;
  };

  return (
    <>
      <div
        className="flex flex-col items-end"
        style={{
          right: `${PIXEL_SCALE * 3}px`,
          top: `${PIXEL_SCALE * (isFarming ? 58 : 31)}px`,
        }}
      >
        <BasketButton onClick={() => setIsOpen(true)} />

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
                secondaryImage={getSecondaryImage(item)}
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
        selectedBasketItem={selectedItem}
        onSelectBasketItem={handleBasketItemClick}
        selectedChestItem={selectedChestItem}
        onSelectChestItem={setSelectedChestItem}
        onPlace={onPlace}
        onPlaceNFT={onPlaceNFT}
        onDepositClick={onDepositClick}
        isSaving={isSaving}
        isFarming={isFarming}
        isFullUser={isFullUser}
      />
    </>
  );
};
