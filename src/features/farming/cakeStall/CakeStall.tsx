import React, { useContext, useState } from "react";
import Decimal from "decimal.js-light";
import { useActor } from "@xstate/react";

import token from "assets/icons/token.gif";
import tokenStatic from "assets/icons/token.png";
import questionMark from "assets/icons/expression_confused.png";

import { Box } from "components/ui/Box";
import { OuterPanel, Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import { Context } from "features/game/GameProvider";

import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { CAKES, Craftable } from "features/game/types/craftables";
import { Modal } from "react-bootstrap";

export const Cakes: React.FC = () => {
  const [selected, setSelected] = useState<Craftable>(
    CAKES()["Sunflower Cake"]
  );
  const [isSellModalOpen, showSellModal] = React.useState(false);
  const { setToast } = useContext(ToastContext);
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const inventory = state.inventory;

  const sell = () => {
    gameService.send("item.sell", {
      item: selected.name,
      amount: 1,
    });
    setToast({
      icon: tokenStatic,
      content: `+$${selected.sellPrice?.toString()}`,
    });
  };

  const amount = new Decimal(inventory[selected.name] || 0);
  const noCake = amount.equals(0);

  const handleSell = () => {
    sell();
    showSellModal(false);
  };

  // ask confirmation for  selling
  const openConfirmationModal = () => {
    showSellModal(true);
  };

  const closeConfirmationModal = () => {
    showSellModal(false);
  };

  return (
    <div className="flex">
      <div className="w-3/5 flex flex-wrap h-fit">
        {Object.values(CAKES()).map((item) => (
          <Box
            isSelected={selected.name === item.name}
            key={item.name}
            onClick={() => setSelected(item)}
            image={
              inventory[item.name]?.gte(1)
                ? ITEM_DETAILS[item.name].image
                : questionMark
            }
            count={inventory[item.name]}
          />
        ))}
      </div>
      <OuterPanel className="flex-1 w-1/3">
        <div className="flex flex-col justify-center items-center p-2 ">
          <span className="text-shadow text-center">{selected.name}</span>
          <img
            src={
              amount.gte(1) ? ITEM_DETAILS[selected.name].image : questionMark
            }
            className="h-16 img-highlight mt-1"
            alt={selected.name}
          />
          <span className="text-shadow text-center mt-2 sm:text-sm">
            {selected.description}
          </span>

          <div className="border-t border-white w-full mt-2 pt-1">
            <div className="flex justify-center items-end">
              <img src={token} className="h-5 mr-1" />
              <span className="text-xs text-shadow text-center mt-2 ">
                {`$${selected.sellPrice}`}
              </span>
            </div>
          </div>
          {amount.gte(1) && (
            <Button
              disabled={amount.lessThan(1)}
              className="text-xs mt-1"
              onClick={openConfirmationModal}
            >
              Sell
            </Button>
          )}
        </div>
      </OuterPanel>
      <Modal centered show={isSellModalOpen} onHide={closeConfirmationModal}>
        <Panel className="md:w-4/5 m-auto">
          <div className="m-auto flex flex-col">
            <span className="text-sm text-center text-shadow">
              Are you sure you want to <br className="hidden md:block" />
              sell your {selected.name}?
            </span>
          </div>
          <div className="flex justify-content-around p-1">
            <Button disabled={noCake} className="text-xs" onClick={handleSell}>
              Yes
            </Button>
            <Button
              disabled={noCake}
              className="text-xs ml-2"
              onClick={closeConfirmationModal}
            >
              No
            </Button>
          </div>
        </Panel>
      </Modal>
    </div>
  );
};
