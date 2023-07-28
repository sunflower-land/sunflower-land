import { useActor } from "@xstate/react";
import { FruitDropAnimator } from "components/animation/FruitDropAnimator";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { setImageWidth } from "lib/images";
import React, { useContext, useState } from "react";
import { InfoPopover } from "../common/InfoPopover";
import { FruitLifecycle } from "./fruits";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";
import { FRUIT, FruitName } from "features/game/types/fruits";
import { getRequiredAxeAmount } from "features/game/events/landExpansion/fruitTreeRemoved";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";

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
  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);
  const [isMobile] = useIsMobile();
  const { isBush } = FRUIT()[fruit];

  const [showError, setShowError] = useState<boolean>(false);

  const { inventory, collectibles } = game.context.state;

  const axesNeeded = getRequiredAxeAmount(fruit, inventory, collectibles);
  const axeAmount = inventory.Axe || new Decimal(0);

  // Has enough axes to chop the tree
  const hasAxes = axeAmount.gte(axesNeeded);

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
      className={classNames("absolute w-full h-full", {
        "cursor-not-allowed": showError,
        "cursor-pointer": !showError,
      })}
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
      onMouseOver={handleHover}
      onClick={removeTree}
    >
      <FruitDropAnimator
        wrapperClassName="h-full"
        mainImageProps={{
          src: lifecycle.dead,
          className: "absolute hover:img-highlight",
          style: {
            bottom: `${PIXEL_SCALE * (isBush ? 9 : 5)}px`,
            left: `${PIXEL_SCALE * (isBush ? 8 : 4)}px`,
          },
          onLoad: (e) => setImageWidth(e.currentTarget),
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
          <img src={SUNNYSIDE.tools.axe} className="w-4 mr-1" />
          <span>No Axe Selected!</span>
        </div>
      </InfoPopover>
    </div>
  );
};
