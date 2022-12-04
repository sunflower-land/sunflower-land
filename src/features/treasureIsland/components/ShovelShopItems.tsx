import React, { SyntheticEvent, useContext, useState } from "react";
import { useActor } from "@xstate/react";
import classNames from "classnames";
import Decimal from "decimal.js-light";

import token from "assets/icons/token_2.png";
import close from "assets/icons/close.png";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";

import { Stock } from "components/ui/Stock";
import { CloudFlareCaptcha } from "components/ui/CloudFlareCaptcha";
import { TreasureToolName, TREASURE_TOOLS } from "features/game/types/tools";
import { getKeys } from "features/game/types/craftables";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";
import { TAB_CONTENT_HEIGHT } from "features/island/hud/components/inventory/Basket";

interface Props {
  onClose: (e?: SyntheticEvent) => void;
}

const CloseButton = ({ onClose }: { onClose: (e: SyntheticEvent) => void }) => {
  return (
    <img
      src={close}
      className="absolute cursor-pointer z-20"
      onClick={onClose}
      style={{
        top: `${PIXEL_SCALE * 1}px`,
        right: `${PIXEL_SCALE * 1}px`,
        width: `${PIXEL_SCALE * 11}px`,
      }}
    />
  );
};

export const ShovelShopItems: React.FC<Props> = ({ onClose }) => {
  const craftableItems = TREASURE_TOOLS();

  const [selectedName, setSelectedName] =
    useState<TreasureToolName>("Sand Shovel");
  const { setToast } = useContext(ToastContext);
  const { gameService, shortcutItem } = useContext(Context);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const selected = craftableItems[selectedName];
  const inventory = state.inventory;

  const price = selected.sfl;

  const lessIngredients = (amount = 1) =>
    getKeys(selected.ingredients).some((name) =>
      selected.ingredients[name]?.mul(amount).greaterThan(inventory[name] || 0)
    );

  const lessFunds = (amount = 1) => {
    if (!price) return;

    return state.balance.lessThan(price.mul(amount));
  };

  const craft = (event: SyntheticEvent, amount = 1) => {
    event.stopPropagation();
    gameService.send("tool.crafted", {
      tool: selectedName,
    });

    setToast({
      icon: token,
      content: `-${price?.mul(amount)}`,
    });

    getKeys(selected.ingredients).map((name) => {
      const item = ITEM_DETAILS[name];
      setToast({
        icon: item.image,
        content: `-${selected.ingredients[name]?.mul(amount)}`,
      });
    });

    shortcutItem(selectedName);
  };

  const onCaptchaSolved = async (captcha: string | null) => {
    await new Promise((res) => setTimeout(res, 1000));

    gameService.send("SYNC", { captcha });

    onClose();
  };

  const sync = () => {
    gameService.send("SYNC", { captcha: "" });

    onClose();
  };

  const restock = (event: SyntheticEvent) => {
    event.stopPropagation();
    // setShowCaptcha(true);
    sync();
  };

  if (showCaptcha) {
    return (
      <CloudFlareCaptcha
        action="carfting-sync"
        onDone={onCaptchaSolved}
        onExpire={() => setShowCaptcha(false)}
        onError={() => setShowCaptcha(false)}
      />
    );
  }

  const Action = () => {
    if (stock?.equals(0)) {
      return (
        <div>
          <p className="text-xxs no-wrap text-center my-1 underline">
            Sold out
          </p>
          <p className="text-xxs text-center">
            Sync your farm to the Blockchain to restock
          </p>
          <Button className="text-xs mt-1" onClick={restock}>
            Sync
          </Button>
        </div>
      );
    }

    return (
      <>
        <Button
          disabled={lessFunds() || lessIngredients() || stock?.lessThan(1)}
          className="text-xs mt-1 whitespace-nowrap"
          onClick={(e) => craft(e)}
        >
          Craft 1
        </Button>
      </>
    );
  };

  const stock = state.stock[selectedName] || new Decimal(0);

  return (
    <div
      style={{
        minHeight: "200px",
      }}
    >
      <div className="flex flex-col-reverse sm:flex-row">
        <div
          className="w-full sm:w-3/5 h-fit h-fit overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap"
          style={{ maxHeight: TAB_CONTENT_HEIGHT }}
        >
          {getKeys(craftableItems).map((toolName) => (
            <Box
              isSelected={selectedName === toolName}
              key={toolName}
              onClick={() => setSelectedName(toolName)}
              image={ITEM_DETAILS[toolName].image}
              count={inventory[toolName]}
            />
          ))}
        </div>
        <OuterPanel className="w-full flex-1">
          <div className="flex flex-col justify-center items-center p-2 relative">
            <Stock item={{ name: selectedName }} />
            <span className="text-center">{selectedName}</span>
            <img
              src={ITEM_DETAILS[selectedName].image}
              className="h-16 img-highlight mt-1"
              alt={selectedName}
            />
            <span className="text-center mt-2 text-sm">
              {selected.description}
            </span>

            <div className="border-t border-white w-full mt-2 pt-1">
              {getKeys(selected.ingredients).map((ingredientName, index) => {
                const item = ITEM_DETAILS[ingredientName];
                const inventoryAmount =
                  inventory[ingredientName]?.toDecimalPlaces(1) || 0;
                const requiredAmount =
                  selected.ingredients[ingredientName]?.toDecimalPlaces(1) || 0;

                // Ingredient difference
                const lessIngredient = new Decimal(inventoryAmount).lessThan(
                  requiredAmount
                );

                // rendering item remenants
                const renderRemnants = () => {
                  if (lessIngredient) {
                    // if inventory items is less than required items
                    return (
                      <Label type="danger">
                        {`${inventoryAmount}/${requiredAmount}`}
                      </Label>
                    );
                  } else {
                    // if inventory items is equal to required items
                    return (
                      <span className="text-xs text-center mt-2">
                        {`${requiredAmount}`}
                      </span>
                    );
                  }
                };

                return (
                  <div
                    className="flex justify-center flex-wrap items-end"
                    key={index}
                  >
                    <img src={item.image} className="h-5 me-2" />
                    {renderRemnants()}
                  </div>
                );
              })}

              {/* SFL requirement */}
              {price?.gt(0) && (
                <div className="flex justify-center items-end">
                  <img src={token} className="h-5 mr-1" />
                  {lessFunds() ? (
                    <Label type="danger">{`${price?.toNumber()}`}</Label>
                  ) : (
                    <span
                      className={classNames("text-xs text-center mt-2", {})}
                    >
                      {`${price?.toNumber()}`}
                    </span>
                  )}
                </div>
              )}
            </div>
            {Action()}
          </div>
        </OuterPanel>
      </div>
    </div>
  );
};
