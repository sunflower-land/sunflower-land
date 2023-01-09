import { useActor } from "@xstate/react";
import classNames from "classnames";
import { FruitDropAnimator } from "components/animation/FruitDropAnimator";
import { InnerPanel } from "components/ui/Panel";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { setImageWidth } from "lib/images";
import React, { useContext, useState } from "react";
import { FruitLifecycle } from "./fruits";

interface Props {
  lifecycle: FruitLifecycle;
  removeTree: () => void;
  fruitImage: string;
  amount: number;
  playAnimation: boolean;
}

export const DeadTree = ({
  lifecycle,
  removeTree,
  fruitImage,
  amount,
  playAnimation,
}: Props) => {
  const { gameService, selectedItem } = useContext(Context);
  const [game] = useActor(gameService);

  const [errorLabel, setErrorLabel] = useState<"noAxe">();
  const [showError, setShowError] = useState<boolean>(false);

  const axeAmount = game.context.state.inventory.Axe || new Decimal(0);

  const hasAxes = selectedItem === "Axe" && axeAmount.gte(1);

  const handleHover = () => {
    if (!hasAxes) {
      setShowError(true);
      setErrorLabel("noAxe");
    }
  };

  const handleMouseLeave = () => {
    setShowError(false);
    setErrorLabel(undefined);
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
              ? "cursor-not-allowed pointer-events-none"
              : "cursor-pointer hover:img-highlight"
          }`,
          style: {
            bottom: "-9px",
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
      <InnerPanel
        className={classNames(
          "transition-opacity absolute top-2 w-fit left-20 ml-2 z-50 pointer-events-none p-1",
          {
            "opacity-100": errorLabel === "noAxe",
            "opacity-0": errorLabel !== "noAxe",
          }
        )}
      >
        <div className="text-xxs text-white mx-1">
          <span>Equip {"axe"}</span>
        </div>
      </InnerPanel>
    </div>
  );
};
