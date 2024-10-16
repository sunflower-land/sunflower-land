import React, { useContext, useState, useMemo, useEffect } from "react";
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
const _craftedItem = (state: MachineState) =>
  state.context.state.craftingBox.item;
const _craftingReadyAt = (state: MachineState) =>
  state.context.state.craftingBox.readyAt;

export const CraftingBox: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const [selectedResource, setSelectedResource] =
    useState<InventoryItemName | null>(null);
  const [selectedItems, setSelectedItems] = useState<
    (InventoryItemName | null)[]
  >(Array(9).fill(null));

  const { gameService } = useContext(Context);
  const inventory = useSelector(gameService, _inventory);
  const craftingStatus = useSelector(gameService, _craftingStatus);
  const craftedItem = useSelector(gameService, _craftedItem);
  const craftingReadyAt = useSelector(gameService, _craftingReadyAt);

  const { t } = useTranslation();

  useEffect(() => {
    if (craftingStatus === "crafting" && craftingReadyAt) {
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, craftingReadyAt - now);
        setRemainingTime(remaining);

        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setRemainingTime(null);
    }
  }, [craftingStatus, craftingReadyAt]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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
  const isReady = remainingTime !== null && remainingTime <= 0;

  const isCraftingBoxEmpty = useMemo(() => {
    return selectedItems.every((item) => item === null);
  }, [selectedItems]);

  const handleOpen = () => {
    gameService.send("SAVE");
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);

  const handleBoxSelect = (index: number) => {
    if (craftingStatus === "pending") return;

    setSelectedItems((prev) => {
      const newItems = [...prev];
      if (newItems[index] !== null) {
        // If the box contains any resource, clear it
        newItems[index] = null;
      } else if (selectedResource) {
        // If the box is empty and a resource is selected, add the selected resource
        newItems[index] = selectedResource;
      }
      return newItems;
    });
  };

  const handleResourceSelect = (itemName: InventoryItemName) => {
    if (craftingStatus === "pending") return;
    setSelectedResource(itemName);
  };

  const handleCraft = () => {
    if (craftingStatus === "pending") return;

    gameService.send("crafting.started", { ingredients: selectedItems });
    gameService.send("SAVE");
  };

  const handleCollect = () => {
    if (isReady) {
      gameService.send("crafting.collected");
      gameService.send("SAVE");
    }
  };

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
        onClick={isPending ? undefined : handleOpen}
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
                      onClick={() => handleBoxSelect(index)}
                      disabled={isPending || !selectedResource}
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
                  {craftedItem ? (
                    <>
                      <Box
                        image={ITEM_DETAILS[craftedItem]?.image}
                        count={new Decimal(1)}
                      />
                      <Label type="default" className="mt-2">
                        {t(craftedItem ?? "")}
                      </Label>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                  {remainingTime !== null ? (
                    <Label
                      type="transparent"
                      className="my-2"
                      icon={SUNNYSIDE.icons.stopwatch}
                    >
                      {formatTime(remainingTime)}
                    </Label>
                  ) : (
                    craftingStatus !== "crafting" && (
                      <Label
                        type="transparent"
                        className="my-2"
                        icon={SUNNYSIDE.icons.stopwatch}
                      >
                        {t("unknown")}
                      </Label>
                    )
                  )}
                  <div>
                    {craftingStatus === "crafting" && !isReady && (
                      <Button
                        className="mt-2 whitespace-nowrap"
                        disabled={true}
                      >
                        {t("crafting")}
                      </Button>
                    )}
                    {craftingStatus === "crafting" && isReady && (
                      <Button
                        className="mt-2 whitespace-nowrap"
                        onClick={handleCollect}
                      >
                        {t("collect")}
                      </Button>
                    )}
                    {craftingStatus === "idle" && (
                      <Button
                        className="mt-2 whitespace-nowrap"
                        onClick={handleCraft}
                        disabled={isCraftingBoxEmpty}
                      >
                        {`${t("craft")} 1`}
                      </Button>
                    )}
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
                        isSelected={selectedResource === inventoryItem}
                        onClick={() => handleResourceSelect(inventoryItem)}
                        disabled={isPending || amount.lessThanOrEqualTo(0)}
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
