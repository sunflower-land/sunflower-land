import React, { useContext, useState, useMemo } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { ITEM_DETAILS } from "features/game/types/images";
import { MachineState } from "features/game/lib/gameMachine";
import { Label } from "components/ui/Label";
import { InventoryItemName } from "features/game/types/game";
import { Button } from "components/ui/Button";
import { useTranslation } from "react-i18next";
import { Box } from "components/ui/Box";
import Decimal from "decimal.js-light";

const VALID_CRAFTING_RESOURCES = ["Wood", "Stone", "Iron", "Gold"];

const _inventory = (state: MachineState) => state.context.state.inventory;
const _craftingStatus = (state: MachineState) =>
  state.context.state.craftingBox.status;

export const CraftingBox: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedItems, setSelectedItems] = useState<
    (InventoryItemName | null)[]
  >(Array(9).fill(null));
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(0);

  const { gameService } = useContext(Context);
  const inventory = useSelector(gameService, _inventory);
  const craftingStatus = useSelector(gameService, _craftingStatus);

  const { t } = useTranslation();

  const handleClick = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleBoxSelect = (index: number) => {
    if (craftingStatus === "pending") return;
    if (selectedItems[index] !== null) {
      setSelectedItems((prev) => {
        const newItems = [...prev];
        newItems[index] = null;
        return newItems;
      });
    }
    setSelectedBoxIndex(index);
  };

  const moveToNextAvailableBox = () => {
    const nextIndex = selectedItems.findIndex(
      (item, index) => item === null && index > (selectedBoxIndex ?? -1),
    );
    if (nextIndex !== -1) {
      setSelectedBoxIndex(nextIndex);
    } else {
      const firstEmptyIndex = selectedItems.findIndex((item) => item === null);
      setSelectedBoxIndex(
        firstEmptyIndex !== -1 ? firstEmptyIndex : selectedBoxIndex,
      );
    }
  };

  const handleItemSelect = (itemName: InventoryItemName) => {
    if (craftingStatus === "pending") return;
    if (selectedBoxIndex !== null) {
      setSelectedItems((prev) => {
        const newItems = [...prev];
        newItems[selectedBoxIndex] = itemName;
        return newItems;
      });
      moveToNextAvailableBox();
    }
  };

  const handleCraft = () => {
    if (craftingStatus === "pending") return;
    const ingredients = selectedItems.reduce(
      (acc, item) => {
        if (item) {
          acc[item] = (acc[item] || 0) + 1;
        }
        return acc;
      },
      {} as Partial<Record<InventoryItemName, number>>,
    );

    gameService.send("crafting.started", { ingredients });
  };

  const remainingInventory = useMemo(() => {
    const updatedInventory = { ...inventory };
    selectedItems.forEach((item) => {
      if (item && updatedInventory[item]) {
        updatedInventory[item] = updatedInventory[item].minus(1);
      }
    });
    return updatedInventory;
  }, [inventory, selectedItems]);

  const isPending = craftingStatus === "pending";

  return (
    <>
      <img
        src={SUNNYSIDE.icons.expression_confused}
        alt={t("crafting.craftingBox")}
        className={`cursor-pointer ${isPending ? "opacity-50" : ""}`}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          height: `${PIXEL_SCALE * 16}px`,
        }}
        onClick={isPending ? undefined : handleClick}
      />

      <Modal show={showModal} onHide={handleClose}>
        <CloseButtonPanel
          onClose={handleClose}
          tabs={[
            { name: t("craft"), icon: SUNNYSIDE.icons.hammer },
            { name: t("recipes"), icon: SUNNYSIDE.icons.basket },
          ]}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          disabled={isPending}
        >
          {currentTab === 0 && (
            <>
              <Label type="default" className="mb-1">
                {t("craft")}
              </Label>
              <div className="flex space-x-2 sm:space-x-4 mb-2">
                <div className="grid grid-cols-3 gap-1">
                  {selectedItems.map((item, index) => (
                    <Box
                      image={item ? ITEM_DETAILS[item]?.image : undefined}
                      key={`${index}-${item}`}
                      isSelected={selectedBoxIndex === index}
                      onClick={() => handleBoxSelect(index)}
                      disabled={isPending}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-center">
                  <img
                    src={SUNNYSIDE.icons.arrow_right}
                    className="pointer-events-none mb-2"
                    style={{
                      width: `${PIXEL_SCALE * 8}px`,
                      height: `${PIXEL_SCALE * 8}px`,
                    }}
                  />
                </div>
                <div className="flex flex-col items-center justify-center flex-grow">
                  <div className="flex mb-1">
                    {[...Array(3)].map((_, index) => (
                      <img
                        key={index}
                        src={SUNNYSIDE.icons.expression_confused}
                        alt="Question Mark"
                        className="mx-0.5"
                        style={{
                          width: `${PIXEL_SCALE * 8}px`,
                          height: `${PIXEL_SCALE * 8}px`,
                        }}
                      />
                    ))}
                  </div>
                  <Box image={SUNNYSIDE.icons.expression_confused} />
                  <Label
                    type="transparent"
                    className="my-2"
                    icon={SUNNYSIDE.icons.stopwatch}
                  >
                    {t("unknown")}
                  </Label>
                  <div>
                    <Button
                      className="mt-2 whitespace-nowrap"
                      onClick={handleCraft}
                      disabled={isPending}
                    >
                      {isPending ? t("crafting") : `${t("craft")} 1`}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <Label type="default" className="mb-1">
                  {t("resources")}
                </Label>
                <div className="flex flex-wrap max-h-48 overflow-y-auto">
                  {VALID_CRAFTING_RESOURCES.map((itemName) => {
                    const inventoryItem = itemName as InventoryItemName;
                    const amount =
                      remainingInventory[inventoryItem] || new Decimal(0);
                    return (
                      <Box
                        key={itemName}
                        count={amount}
                        image={ITEM_DETAILS[inventoryItem]?.image}
                        onClick={() => handleItemSelect(inventoryItem)}
                        disabled={
                          isPending ||
                          amount.lessThanOrEqualTo(0) ||
                          selectedBoxIndex === null
                        }
                      />
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
