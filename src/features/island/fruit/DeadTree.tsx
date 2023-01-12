import { useActor } from "@xstate/react";
import { FruitDropAnimator } from "components/animation/FruitDropAnimator";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { setImageWidth } from "lib/images";
import React, { useContext, useState } from "react";
import { InfoPopover } from "../common/InfoPopover";
import { FruitLifecycle } from "./fruits";
import axe from "assets/tools/axe.png";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";
import { FruitName } from "features/game/types/fruits";
import { getRequiredAxeAmount } from "features/game/events/landExpansion/fruitTreeRemoved";

interface Props {
  lifecycle: FruitLifecycle;
  fruit: FruitName;
  removeTree: () => void;
  fruitImage: string;
  amount: number;
  playAnimation: boolean;
  showOnClickInfo: boolean;
}

export const DeadTree = ({
  lifecycle,
  fruit,
  removeTree,
  fruitImage,
  amount,
  playAnimation,
  showOnClickInfo,
}: Props) => {
  const { gameService, selectedItem } = useContext(Context);
  const [game] = useActor(gameService);
  const [isMobile] = useIsMobile();

  const [showError, setShowError] = useState<boolean>(false);

  const { inventory, collectibles } = game.context.state;

  const axesNeeded = getRequiredAxeAmount(fruit, inventory, collectibles);
  const axeAmount = inventory.Axe || new Decimal(0);

  // Has enough axes to chop the tree
  const hasAxes =
    (selectedItem === "Axe" || axesNeeded.eq(0)) && axeAmount.gte(axesNeeded);

  const handleHover = () => {
    if (!hasAxes) {
      setShowError(true);
    }
  };

  const handleMouseLeave = () => {
    setShowError(false);
  };
  return (
    <div
      className={`${showError ? "cursor-not-allowed" : ""}`}
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
      onMouseOver={handleHover}
    >
      <FruitDropAnimator
        wrapperClassName="h-full"
        mainImageProps={{
          src: lifecycle.dead,
          className: `relative ${
            showError
              ? "cursor-not-allowed"
              : "cursor-pointer hover:img-highlight"
          }`,
          style: {
            bottom: fruit === "Blueberry" ? "-4px" : "-9px",
            zIndex: "1",
          },
          onLoad: (e) => setImageWidth(e.currentTarget),
          onClick: removeTree,
        }}
        dropImageProps={{
          src: fruitImage,
        }}
        dropCount={amount}
        playDropAnimation={playAnimation}
        playShakeAnimation={false}
      />
      <InfoPopover
        showPopover={isMobile ? showOnClickInfo : showError}
        position={{ top: -2, left: 23 }}
      >
        <div className="flex flex-1 items-center text-xxs justify-center text-white px-2 py-1 whitespace-nowrap">
          <img src={axe} className="w-4 mr-1" />
          <span>No Axe Selected!</span>
        </div>
      </InfoPopover>
    </div>
  );
};
