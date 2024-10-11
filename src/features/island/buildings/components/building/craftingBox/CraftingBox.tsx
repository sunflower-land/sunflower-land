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
import { SimpleBox } from "features/island/hud/components/codex/SimpleBox";
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

  const { gameService } = useContext(Context);
  const inventory = useSelector(gameService, _inventory);
  const craftingStatus = useSelector(gameService, _craftingStatus);

  const { t } = useTranslation();

  const handleClick = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleItemSelect = (itemName: InventoryItemName) => {
    const emptyIndex = selectedItems.findIndex((item) => item === null);
    if (emptyIndex !== -1) {
      setSelectedItems((prev) => {
        const newItems = [...prev];
        newItems[emptyIndex] = itemName;
        return newItems;
      });
    }
  };

  const handleItemRemove = (index: number) => {
    setSelectedItems((prev) => {
      const newItems = [...prev];
      newItems[index] = null;
      return newItems;
    });
  };

  const handleCraft = () => {
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

  return (
    <>
      <img
        src={SUNNYSIDE.icons.expression_confused}
        alt={t("crafting.craftingBox")}
        className="cursor-pointer"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          height: `${PIXEL_SCALE * 16}px`,
        }}
        onClick={handleClick}
      />

      <Modal show={showModal} onHide={handleClose}>
        <CloseButtonPanel
          onClose={handleClose}
          tabs={[
            { name: t("craft"), icon: SUNNYSIDE.icons.hammer },
            { name: t("resources"), icon: SUNNYSIDE.icons.hammer },
          ]}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        >
          {currentTab === 0 && (
            <>
              <Label type="default" className="mb-1">
                {t("craft")}
              </Label>
              <div className="flex space-x-2 sm:space-x-4 mb-2">
                <div className="grid grid-cols-3 gap-1">
                  {selectedItems.map((item, index) => (
                    <div key={index} className="relative">
                      <SimpleBox
                        image={item ? ITEM_DETAILS[item]?.image : undefined}
                        key={`${index}-${item}`}
                        onClick={() => handleItemRemove(index)}
                        silhouette={false}
                      />
                      {item && (
                        <img
                          src={SUNNYSIDE.icons.close}
                          className="absolute top-0 right-0 cursor-pointer"
                          style={{
                            width: `${PIXEL_SCALE * 8}px`,
                            height: `${PIXEL_SCALE * 8}px`,
                          }}
                          onClick={() => handleItemRemove(index)}
                        />
                      )}
                    </div>
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
                  <Box image={SUNNYSIDE.icons.expression_confused} />
                  <div>
                    <Button
                      className="mt-2 whitespace-nowrap"
                      onClick={handleCraft}
                      disabled={craftingStatus === "pending"}
                    >
                      {`${t("craft")} 1`}
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
                        disabled={amount.lessThanOrEqualTo(0)}
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
