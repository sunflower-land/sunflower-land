import PubSub from "pubsub-js";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Box } from "components/ui/Box";
import { InventoryItemsModal } from "./InventoryItemsModal";
import { ITEM_DETAILS } from "features/game/types/images";
import type { GameState, InventoryItemName } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { CollectibleName } from "features/game/types/craftables";
import { BasketButton } from "./BasketButton";
import { type SeedName, SEEDS } from "features/game/types/seeds";
import type {
  LandscapingPlaceable,
  LandscapingPlaceableType,
} from "features/game/expansion/placeable/landscapingMachine";
import type { NFTName } from "features/game/events/landExpansion/placeNFT";
import { Context } from "features/game/GameProvider";
import type { PlaceableLocation } from "features/game/types/collectibles";
import { ChestButton } from "./ChestButton";
import { hasChestItemAndNoCollectiblesPlaced } from "./utils/inventory";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import {
  type InventoryMarketplaceRestore,
  type MarketplaceInterfaceRestore,
  useMarketplaceNavigation,
} from "features/marketplace/lib/navigation";
import { KNOWN_IDS } from "features/game/types";

interface Props {
  state: GameState;
  selectedItem?: InventoryItemName;
  isFullUser: boolean;
  shortcutItem?: (item: InventoryItemName) => void;
  onPlace?: (item: LandscapingPlaceable) => void;
  onPlaceNFT?: (id: string, nft: NFTName) => void;
  onPlaceFarmHand?: (id: string) => void;
  onDepositClick?: () => void;
  isFarming: boolean;
  isSaving?: boolean;
  hideActions: boolean;
  location?: PlaceableLocation;
}

const isInventoryRestore = (
  restore: MarketplaceInterfaceRestore | undefined,
): restore is InventoryMarketplaceRestore => {
  const candidate = restore as Partial<InventoryMarketplaceRestore> | undefined;

  return (
    candidate?.type === "inventory" &&
    (candidate.tab === "Basket" || candidate.tab === "Chest")
  );
};

export const Inventory: React.FC<Props> = ({
  state,
  selectedItem,
  shortcutItem,
  isFullUser,
  isFarming,
  isSaving,
  onPlace,
  onPlaceNFT,
  onPlaceFarmHand,
  onDepositClick,
  hideActions,
  location,
}) => {
  const { shortcuts } = useContext(Context);
  const { t } = useAppTranslation();
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const { openMarketplace } = useMarketplaceNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const [basketItem, setBasketItem] = useState<InventoryItemName>();
  const showPlaceFirstHelper =
    location !== "petHouse" && hasChestItemAndNoCollectiblesPlaced(state);

  useEffect(() => {
    const eventSubscription = PubSub.subscribe("OPEN_INVENTORY", () => {
      setIsOpen(true);
    });

    return () => {
      PubSub.unsubscribe(eventSubscription);
    };
  }, []);

  const marketplaceRestore = routerLocation.state?.marketplaceRestore as
    | MarketplaceInterfaceRestore
    | undefined;
  const inventoryRestore = isInventoryRestore(marketplaceRestore)
    ? marketplaceRestore
    : undefined;

  const closeInventory = () => {
    setIsOpen(false);

    if (inventoryRestore) {
      navigate(`${routerLocation.pathname}${routerLocation.search}`, {
        replace: true,
        state: undefined,
      });
    }
  };

  const [selectedChestItem, setSelectedChestItem] =
    useState<LandscapingPlaceableType>();

  const handleBasketItemClick = (item: InventoryItemName) => {
    setBasketItem(item);

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
        {showPlaceFirstHelper && (
          <Label type="vibrant" className="absolute top-[90px] right-[70px]">
            {t("chest.placeFirst")}
          </Label>
        )}
        {location !== "petHouse" ? (
          <BasketButton
            pulse={showPlaceFirstHelper}
            onClick={() => setIsOpen(true)}
          />
        ) : (
          <ChestButton onClick={() => setIsOpen(true)} />
        )}

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
        key={
          isOpen
            ? `open-${!!showPlaceFirstHelper}`
            : `closed-${inventoryRestore?.tab ?? "none"}`
        }
        show={isOpen || !!inventoryRestore}
        onHide={closeInventory}
        state={state}
        selectedBasketItem={
          basketItem ?? inventoryRestore?.selectedItem ?? selectedItem
        }
        onSelectBasketItem={handleBasketItemClick}
        onOpenMarketplace={(item) => {
          setBasketItem(item);
          setIsOpen(false);

          openMarketplace({
            item: {
              collection: "collectibles",
              id: KNOWN_IDS[item],
            },
            restore: {
              type: "inventory",
              tab: "Basket",
              selectedItem: item,
            },
          });
        }}
        selectedChestItem={selectedChestItem}
        onSelectChestItem={setSelectedChestItem}
        onPlace={onPlace}
        onPlaceNFT={onPlaceNFT}
        onPlaceFarmHand={onPlaceFarmHand}
        onDepositClick={onDepositClick}
        isSaving={isSaving}
        isFarming={isFarming}
        isFullUser={isFullUser}
        location={location}
        defaultToChest={
          showPlaceFirstHelper || inventoryRestore?.tab === "Chest"
        }
      />
    </>
  );
};
