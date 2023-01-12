import React, { SyntheticEvent, useContext, useState } from "react";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";
import { Modal } from "react-bootstrap";
import token from "assets/icons/token_2.png";
import hammer from "assets/icons/hammer.png";
import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { Stock } from "components/ui/Stock";
import { CloudFlareCaptcha } from "components/ui/CloudFlareCaptcha";
import { WorkbenchToolName, WORKBENCH_TOOLS } from "features/game/types/tools";
import { getKeys } from "features/game/types/craftables";
import { Label } from "components/ui/Label";
import { acknowledgeTutorial, hasShownTutorial } from "lib/tutorial";
import { Tutorial } from "./Tutorial";
import { Equipped } from "features/game/types/bumpkin";
import { Delayed } from "features/island/buildings/components/building/market/Delayed";
import { RequirementLabel } from "components/ui/RequirementLabel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

interface Props {
  isOpen: boolean;
  onClose: (e?: SyntheticEvent) => void;
}

export const WorkbenchModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedName, setSelectedName] = useState<WorkbenchToolName>("Axe");
  const { setToast } = useContext(ToastContext);
  const { gameService, shortcutItem } = useContext(Context);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showTutorial, setShowTutorial] = useState<boolean>(
    !hasShownTutorial("Workbench")
  );

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const bumpkinParts: Partial<Equipped> = {
    body: "Light Brown Farmer Potion",
    hair: "Blacksmith Hair",
    pants: "Lumberjack Overalls",
    shirt: "SFL T-Shirt",
    tool: "Hammer",
    background: "Farm Background",
    shoes: "Brown Boots",
  };

  const acknowledge = () => {
    acknowledgeTutorial("Workbench");
    setShowTutorial(false);
  };

  if (showTutorial) {
    return (
      <Modal show={isOpen} onHide={acknowledge} centered>
        <Tutorial onClose={acknowledge} bumpkinParts={bumpkinParts} />;
      </Modal>
    );
  }

  const selected = WORKBENCH_TOOLS[selectedName];
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

  const labelState = () => {
    if (stock?.equals(0)) {
      return (
        <Label type="danger" className="-mt-2 mb-1">
          Sold out
        </Label>
      );
    }
    return <Stock item={{ name: selectedName }} inventoryFull={false} />;
  };

  const Action = () => {
    if (stock?.equals(0)) {
      return <Delayed restock={restock}></Delayed>;
    }

    return (
      <>
        <Button
          disabled={lessFunds() || lessIngredients() || stock?.lessThan(1)}
          className="whitespace-nowrap"
          onClick={(e) => craft(e)}
        >
          Craft 1
        </Button>
      </>
    );
  };

  const stock = state.stock[selectedName] || new Decimal(0);

  return (
    <Modal centered show={isOpen} onHide={onClose}>
      <CloseButtonPanel
        bumpkinParts={bumpkinParts}
        tabs={[{ icon: hammer, name: "Tools" }]}
        onClose={onClose}
      >
        <div
          style={{
            minHeight: "200px",
          }}
        >
          <div className="flex flex-col-reverse sm:flex-row">
            <div className="w-full max-h-48 sm:max-h-96 sm:w-3/5 h-fit overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap">
              {getKeys(WORKBENCH_TOOLS).map((toolName) => (
                <Box
                  isSelected={selectedName === toolName}
                  key={toolName}
                  onClick={() => setSelectedName(toolName)}
                  image={ITEM_DETAILS[toolName].image}
                  count={inventory[toolName]}
                />
              ))}
            </div>
            <OuterPanel className="flex flex-col w-full sm:flex-1">
              <div className="flex flex-col justify-center items-start sm:items-center p-2 pb-0 relative">
                {labelState()}
                <div className="flex space-x-2 items-center my-1 sm:flex-col-reverse md:space-x-0">
                  <img
                    src={ITEM_DETAILS[selectedName].image}
                    className="w-5 sm:w-8 sm:my-1"
                    alt={selectedName}
                  />
                  <span className="text-center mb-1">{selectedName}</span>
                </div>
                <span className="text-xs sm:text-center">
                  {selected.description}
                </span>

                <div className="border-t border-white w-full my-2 pt-2 flex justify-between sm:flex-col gap-x-3 gap-y-2 sm:items-center flex-wrap sm:flex-nowrap">
                  {getKeys(selected.ingredients).map(
                    (ingredientName, index) => (
                      <RequirementLabel
                        key={index}
                        type="item"
                        item={ingredientName}
                        balance={inventory[ingredientName] || new Decimal(0)}
                        requirement={
                          selected.ingredients?.[ingredientName] ||
                          new Decimal(0)
                        }
                      />
                    )
                  )}
                  {price.greaterThan(0) && (
                    <RequirementLabel
                      type="sfl"
                      balance={state.balance}
                      requirement={price}
                    />
                  )}
                </div>
                {Action()}
              </div>
            </OuterPanel>
          </div>
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
