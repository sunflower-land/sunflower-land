import React, { useContext, useState } from "react";
import Decimal from "decimal.js-light";
import { useActor } from "@xstate/react";

import token from "assets/icons/token_2.png";
import tokenStatic from "assets/icons/token_2.png";

import { Box } from "components/ui/Box";
import { OuterPanel, Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import { Context } from "features/game/GameProvider";

import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Cake, CAKES } from "features/game/types/craftables";
import { Modal } from "react-bootstrap";
import { getSellPrice } from "features/game/lib/boosts";
import { SellableItem } from "features/game/events/sell";

export const Cakes: React.FC = () => {
  const [selected, setSelected] = useState<Cake>("Sunflower Cake");
  const [isSellModalOpen, showSellModal] = React.useState(false);
  const { setToast } = useContext(ToastContext);
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const inventory = state.inventory;

  const cake = CAKES()[selected];
  const price = getSellPrice(cake as SellableItem, inventory);

  const sell = () => {
    gameService.send("item.sell", {
      item: selected,
      amount: 1,
    });

    setToast({
      icon: tokenStatic,
      content: `+$${price?.toString()}`,
    });
  };

  const amount = new Decimal(inventory[selected] || 0);
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
            isSelected={selected === item.name}
            key={item.name}
            onClick={() => setSelected(item.name as Cake)}
            image={ITEM_DETAILS[item.name].image}
            count={inventory[item.name]}
          />
        ))}
      </div>
      <OuterPanel className="flex-1 w-1/3">
        <div className="flex flex-col justify-center items-center p-2 ">
          <span className="text-shadow text-center">{selected}</span>
          <img
            src={ITEM_DETAILS[selected].image}
            className="h-16 img-highlight mt-1"
            alt={selected}
          />
          <span className="text-shadow text-center mt-2 sm:text-sm">
            {cake.description}
          </span>

          <div className="border-t border-white w-full mt-2 pt-1">
            <div className="flex justify-center items-end">
              <img src={token} className="h-5 mr-1" />
              <span className="text-xs text-shadow text-center mt-2 ">
                {`$${price}`}
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
              sell your {selected}?
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
