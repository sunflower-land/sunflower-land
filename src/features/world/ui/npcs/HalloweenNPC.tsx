import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useContext, useRef, useState } from "react";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { getActiveListedItems } from "features/island/hud/components/inventory/utils/inventory";
import { CollectibleName, getKeys } from "features/game/types/craftables";
import Decimal from "decimal.js-light";
import {
  GameState,
  Inventory,
  InventoryItemName,
} from "features/game/types/game";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";

const bears = [
  "Farmer Bear",
  "Classy Bear",
  "Badass Bear",
  "Turtle Bear",
  "Whale Bear",
  "Chef Bear",
  "Construction Bear",
  "Rich Bear",
  "Brilliant Bear",
  "Snorkel Bear",
  "Cyborg Bear",
  "Eggplant Bear",
  "Easter Bear",
  "Lifeguard Bear",
  "Pirate Bear",
  "Sunflower Bear",
  "Christmas Bear",
  "Bear Trap",
  "Valentine Bear",
  "Beta Bear",
  // "Collectible Bear",
  // "Genie Bear",
  // "Angel Bear",
  "Abandoned Bear",
  "Basic Bear",
  "Goblin Bear",
  "Human Bear",
  // "Rainbow Bear",
];

const MAX_SELECTED_BEARS = 10;

interface Props {
  onClose: () => void;
}
export const HalloweenNPC: React.FC<Props> = ({ onClose }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [showIntro, setShowIntro] = useState(true);
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [selectedItems, setSelectedItems] = useState<InventoryItemName[]>([]);

  const getChestBears = (state: GameState) => {
    const { collectibles: listedItems } = getActiveListedItems(state);

    const availableItems = getKeys(state.inventory).reduce((acc, itemName) => {
      if (typeof itemName === "string" && bears.includes(itemName)) {
        return {
          ...acc,
          [itemName]: new Decimal(
            state.inventory[itemName]
              ?.minus(
                state.collectibles[itemName as CollectibleName]?.length ?? 0,
              )
              ?.minus(listedItems[itemName] ?? 0)
              ?.minus(
                state.home.collectibles[itemName as CollectibleName]?.length ??
                  0,
              ) ?? 0,
          ),
        };
      }

      return acc;
    }, {} as Inventory);

    const validItems = getKeys(availableItems)
      .filter((itemName) => availableItems[itemName]?.greaterThan(0))
      .reduce(
        (acc, name) => ({ ...acc, [name]: availableItems[name] }),
        {} as Inventory,
      );

    return validItems;
  };

  const [bearsCollection, setBearsCollection] = useState<Inventory>(
    getChestBears(gameState.context.state as GameState),
  );

  const sacrifice = () => {
    // Place the purchase function here
    gameService.send({ type: "bear.sacrificed", bears: selectedItems });

    onClose();
  };

  const onAdd = (itemName: InventoryItemName) => {
    if (selectedItems.length === MAX_SELECTED_BEARS) return;
    if (selectedItems.includes(itemName)) return;

    let amount = new Decimal(1);
    setBearsCollection((prev) => {
      const remaining = prev[itemName] ?? new Decimal(0);
      if (remaining.lessThan(1)) {
        amount = remaining;
      }
      return {
        ...prev,
        [itemName]: prev[itemName]?.minus(amount),
      };
    });

    setSelectedItems((prev) => [...prev, itemName]);
  };

  const onRemove = (itemName: InventoryItemName) => {
    const amount = new Decimal(1);
    setBearsCollection((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] ?? new Decimal(0)).add(amount),
    }));

    setSelectedItems((prev) => prev.filter((item) => item !== itemName));
  };

  if (showIntro) {
    return (
      <SpeakingModal
        message={[
          {
            text: t("halloween.sacrifice.intro.one"),
          },
          {
            text: t("halloween.sacrifice.intro.two"),
          },
          {
            text: t("halloween.sacrifice.intro.three"),
          },
          {
            text: t("halloween.sacrifice.intro.four"),
          },
        ]}
        onClose={() => setShowIntro(false)}
        bumpkinParts={NPC_WEARABLES.luna}
      />
    );
  }

  return (
    <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES.luna}>
      <div className="flex flex-col pl-2 mb-2 mt-1 w-full" key="Collectibles">
        <Label
          type="default"
          className="mb-2"
          icon={SUNNYSIDE.decorations.skull}
        >
          {t("halloween.sacrifice.sacrifice")}
        </Label>
        <p className="mb-2">{t("halloween.sacrifice.suggestion")}</p>

        <Label
          type="default"
          className="mb-2"
          icon={ITEM_DETAILS["Basic Bear"].image}
        >
          {t("halloween.sacrifice.select.bears")}
        </Label>
        {Object.values(bearsCollection).length ? (
          <div className="flex mb-2 flex-wrap -ml-1.5">
            {getKeys(bearsCollection).map((itemName, index) => (
              <Box
                count={bearsCollection[itemName]}
                key={`${itemName} ${index}`}
                onClick={() => onAdd(itemName)}
                image={ITEM_DETAILS[itemName].image}
                parentDivRef={divRef}
              />
            ))}
          </div>
        ) : (
          <p className="mb-2">{t("halloween.sacrifice.empty")}</p>
        )}

        <Label type="default" className="mb-2">
          {t("selected")}
        </Label>
        <div className="flex flex-wrap h-fit -ml-1.5">
          {selectedItems.map((itemName, index) => {
            return (
              <Box
                key={`${itemName} ${index}`}
                onClick={() => onRemove(itemName)}
                image={ITEM_DETAILS[itemName].image}
              />
            );
          })}
          {/* Pad with empty boxes */}
          {selectedItems.length < MAX_SELECTED_BEARS &&
            new Array(MAX_SELECTED_BEARS - selectedItems.length)
              .fill(null)
              .map((_, index) => <Box disabled key={index} />)}
        </div>
      </div>

      <Button
        onClick={sacrifice}
        disabled={selectedItems.length < MAX_SELECTED_BEARS}
      >
        {t("halloween.sacrifice.sacrifice")}
      </Button>
    </CloseButtonPanel>
  );
};
