import React from "react";

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

import hammer from "../../images/ui/hammer.png";
import basket from "../../images/ui/basket.png";
import building from "../../images/buildings/side-house-2.png";

import arrowUp from "../../images/ui/arrow_up.png";
import arrowDown from "../../images/ui/arrow_down.png";
import matic from "../../images/ui/matic.svg";
import coin from "../../images/ui/icon.png";

import { recipes, Recipe, Inventory, Item } from "../../types/crafting";
import { Box, BoxProps } from "./Box";

import "./Crafting.css";
import { useService } from "@xstate/react";
import { CommunityApproval } from "./CommunityApproval";

interface Props {
  onClose: () => void;
  balance: number;
  inventory: Inventory;
  totalItemSupplies: Inventory;
  level: number;
}

const COMMUNITY_RECIPES = recipes.filter(
  (recipe) => !!recipe.communityMember
);

export const CommunityCrafting: React.FC<Props> = ({
  onClose,
  balance,
  inventory,
  totalItemSupplies,
  level,
}) => {
  const [amount, setAmount] = React.useState(1);
  const [isApproving, setIsApproving] = React.useState(false);
  const [selectedRecipe, setSelectedRecipe] = React.useState(
    COMMUNITY_RECIPES[0]
  );
  const [machineState, send] = useService<
    Context,
    BlockchainEvent,
    BlockchainState
  >(service);
  const isUnsaved = machineState.context.blockChain.isUnsaved();

  const quickSwapRate = 2;

  const changeRecipe = (recipe: Recipe) => {
    setAmount(1);
    setSelectedRecipe(recipe);
  };

  const craft = () => {
    setIsApproving(true);
    // service.send("CRAFT", {
    //   recipe: selectedRecipe,
    //   amount,
    // });
    // onClose();
  };

  const boxes: BoxProps[] = COMMUNITY_RECIPES.map((recipe) => ({
    isSelected: recipe.name === selectedRecipe.name,
    onClick: () => changeRecipe(recipe),
    image: recipe.image,
    count: inventory[recipe.name] || undefined,
  }));

  // Pad array with empty boxes
  for (let i = boxes.length; i < 10; i++) {
    boxes.push({ disabled: true });
  }

  // Currently only have statue supply so hardcode the rest to 5000
  const amountLeft =
    selectedRecipe.supply &&
    selectedRecipe.supply - totalItemSupplies[selectedRecipe.name];

  if (isApproving) {
    return (
      <CommunityApproval
        balance={balance}
        onClose={() => setIsApproving(false)}
        recipe={selectedRecipe}
      />
    );
  }

  const Action = () => {
    if (isUnsaved) {
      return (
        <div className="upgrade-required">
          <Message>
            Save your farm first
            <img
              //src={cancel}
              className="insufficient-funds-cross"
            />
          </Message>
        </div>
      );
    }

    if (selectedRecipe.supply && amountLeft === 0) {
      return <span id="recipe-description">No supply left </span>;
    }

    const itemCount = inventory[selectedRecipe.name];
    const limit = selectedRecipe.limit || 1;

    if (itemCount < limit) {
      return (
        <>
          <Button onClick={craft} disabled={!canAfford}>
            <span id="craft-button-text">Craft</span>
          </Button>
        </>
      );
    }

    return <span id="recipe-description">Already minted</span>;
  };

  const sunflowerTokenPrice = selectedRecipe.ingredients[0].amount;
  const maticPrice = sunflowerTokenPrice * quickSwapRate;
  const canAfford = balance >= sunflowerTokenPrice;

  return (
    <div id="crafting">
      <div id="community-left">
        <span className="community-description">
          Features designed by farmers
        </span>
        <span className="community-description">
          - 80% $SFF injected into LP
        </span>
        <span className="community-description">
          - 20% $SFF to the designer
        </span>
        <div id="crafting-items">
          {boxes.map((box) => (
            <Box
              count={box.count}
              onClick={box.onClick}
              image={box.image}
              isSelected={box.isSelected}
              disabled={box.disabled}
            />
          ))}
        </div>
        <div id="community-footer">
          <a
            href="https://docs.sunflower-farmers.com/crafting-guide"
            target="_blank"
          >
            <h3 className="current-price-supply-demand">Read more</h3>
          </a>
          <span className="current-price-supply-demand">(2.5% fee)</span>
        </div>
      </div>
      <div id="recipe">
        <span className={`recipe-type recipe-nft`}>NFT</span>
        {selectedRecipe.supply && !isNaN(amountLeft) && (
          <span className="nft-count">{`${amountLeft} left!`}</span>
        )}
        <span id="recipe-title">{selectedRecipe.name}</span>
        <div id="crafting-item">
          <img src={selectedRecipe.image} />
        </div>
        <span id="recipe-description">{selectedRecipe.description}</span>

        <div id="ingredients">
          <div className="ingredient">
            <div>
              <img className="ingredient-image" src={coin} />
              <span className="ingredient-count">$SFF</span>
            </div>
            <span
              className={`ingredient-text ${
                !canAfford && "ingredient-insufficient"
              }`}
            >
              {sunflowerTokenPrice}
            </span>
          </div>
          <div className="ingredient">
            <div>
              <img className="ingredient-image" src={matic} />
              <span className="ingredient-count">$MATIC</span>
            </div>
            <span className={`ingredient-text`}>{maticPrice}</span>
          </div>
        </div>

        <div id="craft-action">{Action()}</div>
        {selectedRecipe.openSeaLink && (
          <span id="recipe-description">
            <a
              target="_blank"
              href={selectedRecipe.openSeaLink}
              style={{ color: "white", textDecoration: "underline" }}
            >
              View on OpenSea
            </a>
          </span>
        )}
      </div>
    </div>
  );
};
