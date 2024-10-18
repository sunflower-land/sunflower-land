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
import { SquareIcon } from "components/ui/SquareIcon";
import { hasFeatureAccess } from "lib/flags";

const VALID_CRAFTING_RESOURCES = ["Wood", "Stone", "Iron", "Gold"];

const _inventory = (state: MachineState) => state.context.state.inventory;
const _craftingStatus = (state: MachineState) =>
  state.context.state.craftingBox.status;
const _craftedItem = (state: MachineState) =>
  state.context.state.craftingBox.item;
const _craftingReadyAt = (state: MachineState) =>
  state.context.state.craftingBox.readyAt;

export const CraftingBox: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const { t } = useTranslation();

  const { gameService } = useContext(Context);
  const inventory = useSelector(gameService, _inventory);
  const craftingStatus = useSelector(gameService, _craftingStatus);
  const craftedItem = useSelector(gameService, _craftedItem);
  const craftingReadyAt = useSelector(gameService, _craftingReadyAt);

  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [failedAttempt, setFailedAttempt] = useState(false);

  const [selectedResource, setSelectedResource] =
    useState<InventoryItemName | null>(null);
  const [selectedItems, setSelectedItems] = useState<
    (InventoryItemName | null)[]
  >(Array(9).fill(null));

  const processRemainingTime = () => {
    const now = Date.now();
    const remaining = Math.max(0, craftingReadyAt - now);
    setRemainingTime(remaining);

    return remaining;
  };

  useEffect(() => {
    if (craftingStatus === "crafting" && craftingReadyAt) {
      processRemainingTime();

      const interval = setInterval(() => {
        const remaining = processRemainingTime();
        if (remaining <= 0) clearInterval(interval);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setRemainingTime(null);
    }
  }, [craftingStatus, craftingReadyAt]);

  useEffect(() => {
    if (showModal === false) {
      setFailedAttempt(false);
      return;
    }

    if (craftingStatus === "pending") {
      setFailedAttempt(true);
    }

    if (craftingStatus === "crafting") {
      setFailedAttempt(false);
    }
  }, [craftingStatus, showModal]);

  useEffect(() => {
    if (craftingStatus !== "pending") {
      setFailedAttempt(false);
    }
  }, [selectedItems]);

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

  const isCraftingBoxEmpty = useMemo(() => {
    return selectedItems.every((item) => item === null);
  }, [selectedItems]);

  const isPending = craftingStatus === "pending";
  const isCrafting = craftingStatus === "crafting";
  const isIdle = craftingStatus === "idle";
  const isReady = remainingTime !== null && remainingTime <= 0;

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

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    itemName: InventoryItemName,
  ) => {
    if (!VALID_CRAFTING_RESOURCES.includes(itemName)) {
      e.preventDefault();
      return;
    }

    e.dataTransfer.setData("application/json", JSON.stringify({ itemName }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      const itemName = data.itemName as InventoryItemName;

      if (
        craftingStatus === "pending" ||
        !VALID_CRAFTING_RESOURCES.includes(itemName) ||
        remainingInventory[itemName]?.lessThanOrEqualTo(0)
      )
        return;

      setSelectedItems((prev) => {
        const newItems = [...prev];
        newItems[index] = itemName;
        return newItems;
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Invalid drag data", error);
    }
  };

  const hasAccess = hasFeatureAccess(
    gameService.getSnapshot().context.state,
    "CRAFTING_BOX",
  );

  return (
    <>
      <div className="absolute bottom-0">
        <img
          src={ITEM_DETAILS["Crafting Box"].image}
          alt={t("crafting.craftingBox")}
          className={`cursor-pointer hover:img-highlight`}
          style={{
            width: `${PIXEL_SCALE * 46}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          onClick={isPending ? undefined : handleOpen}
        />
      </div>

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
          {!hasAccess ? (
            <p className="text-sm">{t("coming.soon")}</p>
          ) : (
            <>
              {currentTab === 0 && (
                <>
                  <Label type="default" className="mb-1">
                    {t("craft")}
                  </Label>
                  <div className="flex mb-2">
                    {/** Crafting Grid */}
                    <div className="grid grid-cols-3 gap-1 flex-shrink-0">
                      {selectedItems.map((item, index) => (
                        <Box
                          key={`${index}-${item}`}
                          image={item ? ITEM_DETAILS[item]?.image : undefined}
                          onClick={() => handleBoxSelect(index)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                          disabled={isPending}
                        />
                      ))}
                    </div>
                    {/** Arrow */}
                    <div className="flex items-center justify-center flex-grow">
                      <img
                        src={SUNNYSIDE.icons.arrow_right}
                        className="pointer-events-none mb-2"
                        style={{
                          width: `${PIXEL_SCALE * 8}px`,
                          height: `${PIXEL_SCALE * 8}px`,
                        }}
                      />
                    </div>

                    {/** Crafting Result */}
                    <div className="flex flex-col items-center justify-center flex-grow">
                      {craftedItem && (
                        <>
                          <Label
                            type="default"
                            className="mt-2 mb-1"
                            icon={SUNNYSIDE.icons.hammer}
                          >
                            {craftedItem}
                          </Label>
                          <Box
                            image={ITEM_DETAILS[craftedItem]?.image}
                            count={new Decimal(1)}
                          />
                        </>
                      )}
                      {!craftedItem && (
                        <>
                          <Label
                            type="default"
                            icon={
                              isPending
                                ? SUNNYSIDE.icons.hammer
                                : failedAttempt
                                  ? SUNNYSIDE.icons.cancel
                                  : SUNNYSIDE.icons.search
                            }
                            className="mt-2 mb-1"
                          >
                            {isPending
                              ? "Pending"
                              : failedAttempt
                                ? "Failed"
                                : "Unknown"}
                          </Label>
                          <Box
                            image={
                              isPending
                                ? SUNNYSIDE.icons.expression_confused
                                : undefined
                            }
                            key={`box-${isPending}`}
                          />
                        </>
                      )}

                      <div className="flex items-center justify-center">
                        {remainingTime !== null && (
                          <Label
                            type="transparent"
                            className="ml-3 my-1"
                            icon={SUNNYSIDE.icons.stopwatch}
                          >
                            {remainingTime
                              ? formatTime(remainingTime)
                              : "Ready"}
                          </Label>
                        )}
                        {remainingTime === null && (
                          <Label
                            type="transparent"
                            className="ml-3 my-1"
                            icon={SUNNYSIDE.icons.stopwatch}
                          >
                            <SquareIcon
                              icon={SUNNYSIDE.icons.expression_confused}
                              width={7}
                            />
                          </Label>
                        )}
                      </div>

                      <div>
                        {(isCrafting || isPending) && !isReady && (
                          <Button
                            className="mt-2 whitespace-nowrap"
                            disabled={true}
                          >
                            {t("crafting")}
                          </Button>
                        )}
                        {isCrafting && isReady && (
                          <Button
                            className="mt-2 whitespace-nowrap"
                            onClick={handleCollect}
                          >
                            {t("collect")}
                          </Button>
                        )}
                        {isIdle && (
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
                          <div
                            key={itemName}
                            draggable={!isPending && amount.greaterThan(0)}
                            onDragStart={(e) =>
                              handleDragStart(e, inventoryItem)
                            }
                            className="m-1 flex"
                          >
                            <Box
                              count={amount}
                              image={ITEM_DETAILS[inventoryItem]?.image}
                              isSelected={selectedResource === inventoryItem}
                              onClick={() =>
                                handleResourceSelect(inventoryItem)
                              }
                              disabled={
                                isPending || amount.lessThanOrEqualTo(0)
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
