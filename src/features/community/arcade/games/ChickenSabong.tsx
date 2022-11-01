import React, { useRef, useState } from "react";

import gameBackground from "assets/community/arcade/greedy_goblin/images/greedy_goblin_background.png";
import leftChickenIdle from "assets/community/arcade/chicken_sabong/images/left_chicken_idle.gif";
import leftChickenPunch from "assets/community/arcade/chicken_sabong/images/left_chicken_punch.gif";
import rightChickenIdle from "assets/community/arcade/chicken_sabong/images/right_chicken_idle.gif";
import rightChickenPunch from "assets/community/arcade/chicken_sabong/images/right_chicken_punch.gif";
import leftArrow from "assets/icons/arrow_left.png";
import rightArrow from "assets/icons/arrow_right.png";
import disc from "assets/icons/disc.png";

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;
const CHICKEN_SIDE = 50;
const CHICKEN_X_MOVEMENT = 10;

type Id = "left" | "right";
type Action = "idle" | "punch" | "block";
type ChickenStatus = {
  action: Action;
  position: number;
};

interface DiscButtonProps {
  letter: string;
  onClick: () => void;
  alt?: string;
}

const ACTIONS_TO_IMAGES: Record<string, Record<string, any>> = {
  left: {
    idle: leftChickenIdle,
    punch: leftChickenPunch,
  },
  right: {
    idle: rightChickenIdle,
    punch: rightChickenPunch,
  },
};

const DiscButton: React.FC<DiscButtonProps> = ({ letter, onClick, alt }) => {
  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <img src={disc} alt={alt} className="h-8 w-8" />
      <span className="absolute top-1 right-2">{letter}</span>
    </div>
  );
};

export const ChickenSabong: React.FC = () => {
  const [leftChicken, setLeftChicken] = useState<ChickenStatus>({
    action: "idle",
    position: 60,
  });
  const [rightChicken, setRightChicken] = useState<ChickenStatus>({
    action: "idle",
    position: 60,
  });

  const leftChickenRef = useRef(null);
  const rightChickenRef = useRef(null);

  const moveChicken = (id: Id, toRight: boolean) => {
    const isLeftChicken = id === "left";
    const currentPos = isLeftChicken
      ? leftChicken.position
      : rightChicken.position;
    const newPos =
      currentPos +
      CHICKEN_X_MOVEMENT * (isLeftChicken ? 1 : -1) * (toRight ? 1 : -1);

    if (willCollide(id, newPos)) return;

    // set new chicken position
    if (isLeftChicken) {
      setLeftChicken((prev) => ({ ...prev, position: newPos }));
    } else {
      setRightChicken((prev) => ({ ...prev, position: newPos }));
    }
  };

  /**
   * Checks for collision so chickens don't overlap, switch sides, or go beyond boundary
   * Compare newPos to 0 for boundaries since they are with respect to absolute position side (left or right)
   * Enemy boundaries are computed with respect to left side for both chickens!
   */
  const willCollide = (id: Id, newPos: number): boolean => {
    let collideWithEnemy;

    if (id === "left") {
      collideWithEnemy =
        newPos + CHICKEN_SIDE >=
        CANVAS_WIDTH - rightChicken.position - CHICKEN_SIDE;
    } else {
      collideWithEnemy =
        CANVAS_WIDTH - newPos - CHICKEN_SIDE <=
        leftChicken.position + CHICKEN_SIDE;
    }

    return newPos <= 0 || collideWithEnemy;
  };

  const punch = (id: Id) => {
    if (id === "left") {
      setLeftChicken((prev) => ({ ...prev, action: "punch" }));

      setTimeout(
        () => setLeftChicken((prev) => ({ ...prev, action: "idle" })),
        500
      );
    } else {
      setRightChicken((prev) => ({ ...prev, action: "punch" }));

      setTimeout(
        () => setRightChicken((prev) => ({ ...prev, action: "idle" })),
        500
      );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center">
        <div
          style={{
            position: "relative",
            borderStyle: "solid",
            borderWidth: "5px",
            borderRadius: "20px",
            width: `${CANVAS_WIDTH}px`,
            height: `${CANVAS_HEIGHT}px`,
            backgroundImage: `url(${gameBackground})`,
            backgroundSize: "contain",
          }}
        >
          <img
            src={ACTIONS_TO_IMAGES["left"][leftChicken.action]}
            alt="left-chicken"
            style={{
              position: "absolute",
              height: `${CHICKEN_SIDE}px`,
              width: `${CHICKEN_SIDE}px`,
              bottom: "100px",
              left: `${leftChicken.position}px`,
            }}
            ref={leftChickenRef}
          />
          <img
            src={ACTIONS_TO_IMAGES["right"][rightChicken.action]}
            alt="right-chicken"
            style={{
              position: "absolute",
              height: `${CHICKEN_SIDE}px`,
              width: `${CHICKEN_SIDE}px`,
              right: `${rightChicken.position}px`,
              bottom: "100px",
            }}
            ref={rightChickenRef}
          />
        </div>
      </div>
      <div className="flex pt-1">
        <div className="w-1/2 flex justify-around">
          <img
            src={leftArrow}
            alt="left-chicken-left-arrow"
            className="h-8 w-8 cursor-pointer"
            onClick={() => moveChicken("left", false)}
          />
          <DiscButton
            letter="Q"
            alt="left-chicken-punch"
            onClick={() => punch("left")}
          />
          <img
            src={rightArrow}
            alt="left-chicken-right-arrow"
            className="h-8 w-8 cursor-pointer"
            onClick={() => moveChicken("left", true)}
          />
        </div>
        <div className="w-1/2 flex justify-around">
          <img
            src={leftArrow}
            alt="right-chicken-left-arrow"
            className="h-8 w-8 cursor-pointer"
            onClick={() => moveChicken("right", false)}
          />
          <DiscButton
            letter="I"
            alt="right-chicken-punch"
            onClick={() => punch("right")}
          />
          <img
            src={rightArrow}
            alt="right-chicken-right-arrow"
            className="h-8 w-8 cursor-pointer"
            onClick={() => moveChicken("right", true)}
          />
        </div>
      </div>
    </div>
  );
};
