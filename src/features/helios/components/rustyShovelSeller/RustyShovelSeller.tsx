import React, { useContext, useState } from "react";

import shadow from "assets/npcs/shadow.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";

import goblin from "assets/npcs/goblin_jump_rusty_shovel.gif";
import token from "assets/icons/token_2.png";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { CRAFTABLE_TOOLS } from "features/game/events/landExpansion/craftTool";
import { ToastContext } from "features/game/toast/ToastQueueProvider";

import { ITEM_DETAILS } from "features/game/types/images";
import { useActor } from "@xstate/react";
import { Label } from "components/ui/Label";
import { Stock } from "components/ui/Stock";
import { Button } from "components/ui/Button";
import Decimal from "decimal.js-light";

export const RustyShovelSeller: React.FC = () => {
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const { setToast } = useContext(ToastContext);
  const [showModal, setShowModal] = useState(false);
  const stock = state.stock["Rusty Shovel"] || new Decimal(0);

  const { sfl: price } = CRAFTABLE_TOOLS()["Rusty Shovel"];

  const craft = (amount: number) => {
    gameService.send("tool.crafted", {
      tool: "Rusty Shovel",
    });

    setToast({
      icon: token,
      content: `-${price?.mul(amount)}`,
    });

    shortcutItem("Rusty Shovel");
  };

  const restock = () => {
    gameService.send("SYNC", { captcha: "" });

    setShowModal(false);
  };

  const labelState = () => {
    if (stock.equals(0)) {
      return (
        <Label type="danger" className="-mt-2 mb-1">
          Sold out
        </Label>
      );
    }

    return <Stock item={{ name: "Rusty Shovel" }} />;
  };

  const Action = () => {
    if (stock.equals(0)) {
      return (
        <div className="my-1">
          <p className="text-xxs text-center mb-2">
            Sync your farm to the Blockchain to restock.
          </p>
          <Button className="text-xs mt-1" onClick={restock}>
            Sync
          </Button>
        </div>
      );
    }

    return <Button onClick={() => craft(1)}>Buy 1</Button>;
  };

  return (
    <>
      <img
        src={shadow}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 14.9}px`,
          top: `${GRID_WIDTH_PX * 19.14}px`,
          left: `${GRID_WIDTH_PX * 15.2}px`,
        }}
      />
      <img
        src={goblin}
        onClick={() => setShowModal(true)}
        className="absolute cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 26}px`,
          top: `${GRID_WIDTH_PX * 18.2}px`,
          left: `${GRID_WIDTH_PX * 15.1}px`,
        }}
      />
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <CloseButtonPanel
          onClose={() => setShowModal(false)}
          bumpkinParts={{
            body: "Goblin Potion",
            hair: "Sun Spots",
            pants: "Brown Suspenders",
            tool: "Farmer Pitchfork",
            background: "Farm Background",
            shoes: "Black Farmer Boots",
          }}
          title="Need a Rusty Shovel?"
        >
          <div className="flex flex-wrap justify-center mb-3 space-x-2">
            <img
              src={ITEM_DETAILS["Rusty Shovel"].image}
              className="h-7 md:h-8"
            />
          </div>
          <div className="flex justify-center">{labelState()}</div>
          <div className="space-y-3 text-sm px-1 mb-3">
            <p>
              I am assuming you are here because you need to dig something up on
              your land.
            </p>
            <p>Is that correct?</p>
            <p>
              Well, I have plenty of these Rusty Shovels which will be perfect
              for the job.
            </p>
            <div>
              I am selling them for
              <img
                src={token}
                className="h-4 inline mx-1"
                style={{ imageRendering: "pixelated" }}
              />
              {`${price.toString()} SFL a piece. Interested?`}
            </div>
          </div>
          {Action()}
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
