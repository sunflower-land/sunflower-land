import React, { useState } from "react";

import { Panel } from "../ui/Panel";
import { Button } from "../ui/Button";
import { Message } from "../ui/Message";
import { InventoryItems } from "../ui/InventoryItems";

import {
  Context,
  BlockchainEvent,
  BlockchainState,
  service,
} from "../../machine";

import matic from "../../images/ui/matic.svg";
import icon from "../../images/ui/icon.png";
import carry from "../../images/characters/goblin_carry.gif";

import { recipes, Recipe, Inventory, Item } from "../../types/crafting";
import { Box, BoxProps } from "./Box";

import "./Crafting.css";
import { useService } from "@xstate/react";

interface Props {
  onClose: () => void;
  balance: number;
  recipe: Recipe;
}

export const CommunityApproval: React.FC<Props> = ({
  onClose,
  balance,
  recipe,
}) => {
  const [isApproving, setIsApproving] = useState(false);
  const [machineState, send] = useService<
    Context,
    BlockchainEvent,
    BlockchainState
  >(service);
  const isUnsaved = machineState.context.blockChain.isUnsaved();

  const quickSwapRate = 2;

  const craft = () => {
    // service.send("CRAFT", {
    //   recipe: selectedRecipe,
    //   amount,
    // });
    onClose();
  };

  const approve = () => {
    setIsApproving(true);
  };

  const sunflowerTokenAmount = recipe.ingredients[0].amount;

  return (
    <div id="crafting">
      <div id="community-left">
        <span className="community-guide-text">
          By crafting this item you will be sending $SFF and $MATIC into
          the Community QuickSwap pool.
        </span>
        <span className="community-guide-text">
          Please note that prices change frequently and the $SFF amount may
          have a slippage. By crafting you accept these conditions.
        </span>
        <div>
          <span className="community-guide-text">
            Step 1 - Approve $SFF
          </span>
          <Button onClick={approve}>Approve</Button>
          {(isApproving || true) && (
            <>
              <div id="approving-animation">
                <img id="approving-goblin" src={carry} />
                <img id="approving-sff" src={icon} />
              </div>
              <span className="community-guide-text">Approving...</span>
            </>
          )}
        </div>

        <span>Step 2 - Craft item</span>
      </div>
      <div id="recipe">
        <span className={`recipe-type recipe-nft`}>NFT</span>
        <span id="recipe-title">{recipe.name}</span>
        <div id="crafting-item">
          <img src={recipe.image} />
        </div>
        <span id="recipe-description">{recipe.description}</span>

        <div id="ingredients">
          <div className="ingredient">
            <div>
              <img
                className="ingredient-image"
                src={recipe.ingredients[0].image}
              />
              <span className="ingredient-count">$SFF</span>
            </div>
            <span className={`ingredient-text`}>
              {sunflowerTokenAmount}
            </span>
          </div>
          <div className="ingredient">
            <div>
              <img className="ingredient-image" src={matic} />
              <span className="ingredient-count">$MATIC</span>
            </div>
            <span className={`ingredient-text`}>
              {sunflowerTokenAmount * quickSwapRate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
