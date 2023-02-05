import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { Equipped } from "features/game/types/bumpkin";

import { Modal } from "react-bootstrap";
import { Context } from "../GameProvider";
import { Panel } from "components/ui/Panel";
import { useActor } from "@xstate/react";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { ITEM_DETAILS } from "../types/images";
import { SUNNYSIDE } from "assets/sunnyside";

type Pages = 1 | 2 | 3;

export const Welcome: React.FC = () => {
  const { gameService } = useContext(Context);
  const [state] = useActor(gameService);

  const [pageNumber, setPageNumber] = useState<Pages>(1);

  const acknowledge = () => {
    gameService.send("ACKNOWLEDGE");
  };

  const PageOne = () => {
    return (
      <>
        <div className="space-y-3 text-sm p-2 mb-3">
          <p>{`Welcome to the world of Sunflower Land!`}</p>
          <p>
            I am your young Bumpkin with big dreams of becoming the best farmer
            in the world
          </p>
          <p>I will be your guide throughout this journey.</p>
        </div>
        <Button onClick={() => setPageNumber(2)}>Next</Button>
      </>
    );
  };

  const PageTwo = () => {
    return (
      <>
        <div className="space-y-3 text-sm p-2 mb-3">
          <p>In this tutorial, we'll go over 3 basics of Bumpkin farming</p>
          <div className="flex items-center">
            <img src={CROP_LIFECYCLE.Carrot.ready} className="w-8 mr-2" />
            <p>1. Harvesting crops</p>
          </div>
          <div className="flex items-center">
            <img
              src={ITEM_DETAILS["Pumpkin Soup"].image}
              className="w-8 mr-2"
            />
            <p>2. Cooking food</p>
          </div>
          <div className="flex items-center">
            <img src={SUNNYSIDE.icons.hammer} className="w-8 mr-2" />
            <p>3. Crafting powerful NFTs</p>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button onClick={() => setPageNumber(3)}>Next</Button>
        </div>
      </>
    );
  };

  const PageThree = () => {
    return (
      <>
        <div className="space-y-3 text-sm p-2 mb-3">
          <p className="mb-2">Let's get started!</p>
          <p className="mb-2">Step 1: Harvest Sunflowers</p>
          <div className="flex">
            <img src={CROP_LIFECYCLE.Sunflower.ready} className="w-12" />
            <img src={CROP_LIFECYCLE.Sunflower.ready} className="w-12" />
            <img src={CROP_LIFECYCLE.Sunflower.ready} className="w-12" />
          </div>
          <p className="mb-2">
            Locate the sunflowers growing in your field and tap on them to
            harvest.
          </p>
        </div>
        <div className="flex space-x-1">
          <Button onClick={acknowledge}>Got it</Button>
        </div>
      </>
    );
  };

  return (
    <Modal show={true} centered>
      <Panel
        title="Welcome to Sunflower Isles"
        bumpkinParts={state.context.state.bumpkin?.equipped as Equipped}
      >
        {pageNumber === 1 && PageOne()}
        {pageNumber === 2 && PageTwo()}
        {pageNumber === 3 && PageThree()}
      </Panel>
    </Modal>
  );
};
