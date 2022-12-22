import React, { useCallback, useEffect, useMemo, useState } from "react";

import gameBackground from "assets/community/arcade/chicken_fight/images/boxing_ring.png";
import leftChickenIdle from "assets/community/arcade/chicken_fight/images/left_chicken_idle.gif";
import leftChickenPunch from "assets/community/arcade/chicken_fight/images/left_chicken_punch.gif";
import leftChickenBlock from "assets/community/arcade/chicken_fight/images/left_chicken_block.png";
import leftChickenHit from "assets/community/arcade/chicken_fight/images/left_chicken_hit.gif";
import rightChickenIdle from "assets/community/arcade/chicken_fight/images/right_chicken_idle.gif";
import rightChickenPunch from "assets/community/arcade/chicken_fight/images/right_chicken_punch.gif";
import rightChickenBlock from "assets/community/arcade/chicken_fight/images/right_chicken_block.png";
import rightChickenHit from "assets/community/arcade/chicken_fight/images/right_chicken_hit.gif";
import referee from "assets/community/arcade/chicken_fight/images/referee.gif";
import audience from "assets/community/arcade/chicken_fight/images/audience.gif";
import heart from "assets/community/arcade/chicken_fight/images/heart.png";
import emptyHeart from "assets/community/arcade/chicken_fight/images/heart_empty.png";
import leftArrow from "assets/icons/arrow_left.png";
import rightArrow from "assets/icons/arrow_right.png";
import disc from "assets/icons/disc.png";

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;
const CHICKEN_SIDE = 50;
const CHICKEN_MOVE = 10;

type Id = "left" | "right";
type Action = "idle" | "punch" | "block" | "hit";
type Chicken = {
  action: Action;
  position: number;
  lives: number;
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
    block: leftChickenBlock,
    hit: leftChickenHit,
  },
  right: {
    idle: rightChickenIdle,
    punch: rightChickenPunch,
    block: rightChickenBlock,
    hit: rightChickenHit,
  },
};

enum KeyboardButtons {
  LEFT_MOVE_LEFT = "A",
  LEFT_MOVE_RIGHT = "D",
  LEFT_PUNCH = "Q",
  LEFT_BLOCK = "E",
  RIGHT_MOVE_LEFT = "J",
  RIGHT_MOVE_RIGHT = "L",
  RIGHT_PUNCH = "U",
  RIGHT_BLOCK = "O",
}

const DiscButton: React.FC<DiscButtonProps> = ({ letter, onClick, alt }) => {
  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <img src={disc} alt={alt} className="h-10 w-10" />
      <span className="absolute top-1 left-3">{letter}</span>
    </div>
  );
};

export const ChickenFight: React.FC = () => {
  const [leftChicken, setLeftChicken] = useState<Chicken>({
    action: "idle",
    position: 60,
    lives: 3,
  });
  const [rightChicken, setRightChicken] = useState<Chicken>({
    action: "idle",
    position: 60,
    lives: 3,
  });

  /**
   * Move chicken to desired position without overlapping
   * Movestep is based on xnor logic (since right chicken movement is inverted)
   * @param id left or right chicken
   * @param toRight if direction is to right from player POV
   */
  const moveChicken = (id: Id, toRight: boolean) => {
    const isLeftChicken = id === "left";
    const actorSetter = isLeftChicken ? setLeftChicken : setRightChicken;
    const currentPos = isLeftChicken
      ? leftChicken.position
      : rightChicken.position;
    const newPos =
      currentPos + CHICKEN_MOVE * (isLeftChicken === toRight ? 1 : -1);

    if (willCollide(id, newPos)) return;

    // set new chicken position
    actorSetter((prev) => ({ ...prev, position: newPos }));
  };

  /**
   * Checks for collision so chickens don't overlap, switch sides, or go beyond boundary
   * Compare newPos to 0 for boundaries since they are with respect to absolute position side (left or right)
   * Enemy boundaries are computed with respect to left side for both chickens!
   * @param id left or right
   * @param newPos new position of moving chicken
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

  /**
   * Apply punch gif and decrease life of enemy on hit
   * @param id left or right
   */
  const punch = (id: Id) => {
    const setters = [setLeftChicken, setRightChicken];
    const isLeftChicken = id === "left";
    const [actorSetter, enemySetter] = isLeftChicken
      ? setters
      : setters.reverse();
    const isEnemyBlocking =
      (isLeftChicken ? rightChicken : leftChicken).action === "block";

    actorSetter((prev) => ({ ...prev, action: "punch" }));

    if (isAdjacent && !isEnemyBlocking) {
      // hit, decrease enemy life
      enemySetter((prev) => ({
        ...prev,
        action: "hit",
        lives: Math.max(0, prev.lives - 1),
      }));
      setTimeout(
        () => enemySetter((prev) => ({ ...prev, action: "idle" })),
        300
      );
    }

    setTimeout(() => actorSetter((prev) => ({ ...prev, action: "idle" })), 500);
  };

  /**
   * Block then idle after 500ms
   * @param id left or right
   */
  const block = (id: Id) => {
    const actorSetter = id === "left" ? setLeftChicken : setRightChicken;

    actorSetter((prev) => ({ ...prev, action: "block" }));
    setTimeout(() => actorSetter((prev) => ({ ...prev, action: "idle" })), 500);
  };

  /**
   * Handler for keyboard events
   * Need to check state dependencies and re attach via useEffect
   * @param event keyboard event
   */
  const keyboardListener = useCallback(
    (event: KeyboardEvent) => {
      event.stopPropagation();
      const key = event.key.toUpperCase();

      switch (key) {
        // left chicken
        case KeyboardButtons.LEFT_MOVE_LEFT:
          moveChicken("left", false);
          break;
        case KeyboardButtons.LEFT_MOVE_RIGHT:
          moveChicken("left", true);
          break;
        case KeyboardButtons.LEFT_PUNCH:
          punch("left");
          break;
        case KeyboardButtons.LEFT_BLOCK:
          block("left");
          break;

        // right chicken
        case KeyboardButtons.RIGHT_MOVE_LEFT:
          moveChicken("right", false);
          break;
        case KeyboardButtons.RIGHT_MOVE_RIGHT:
          moveChicken("right", true);
          break;
        case KeyboardButtons.RIGHT_PUNCH:
          punch("right");
          break;
        case KeyboardButtons.RIGHT_BLOCK:
          block("right");
          break;
        default:
      }
    },
    [leftChicken, rightChicken]
  );

  /**
   * Check if chickens are adjacent to each other
   * Use move step as buffer when chickens are adjacent near boundary
   */
  const isAdjacent = useMemo((): boolean => {
    return (
      leftChicken.position + rightChicken.position + 2 * CHICKEN_SIDE ===
      CANVAS_WIDTH - CHICKEN_MOVE
    );
  }, [leftChicken.position, rightChicken.position]);

  /**
   * Attaches/updates listener on keydown
   */
  useEffect(() => {
    document.addEventListener("keydown", keyboardListener);

    return () => {
      document.removeEventListener("keydown", keyboardListener);
    };
  }, [keyboardListener]);

  /**
   * Watches chicken lives for game over
   * @todo game over logic, cleanup
   */
  useEffect(() => {
    if (!(leftChicken.lives && rightChicken.lives)) {
      console.log("GAME OVER!");
      console.log("left", leftChicken.lives);
      console.log("right", rightChicken.lives);
    }
  }, [leftChicken.lives, rightChicken.lives]);

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
            src={referee}
            alt="referee"
            style={{
              position: "absolute",
              height: `${CHICKEN_SIDE}px`,
              width: `${CHICKEN_SIDE + 15}px`,
              top: "25%",
              left: `${CANVAS_WIDTH / 2 - 40}px`,
            }}
          />
          <img
            src={ACTIONS_TO_IMAGES["left"][leftChicken.action]}
            alt="left-chicken"
            style={{
              position: "absolute",
              height: `${CHICKEN_SIDE}px`,
              width: `${CHICKEN_SIDE}px`,
              bottom: "110px",
              left: `${leftChicken.position}px`,
            }}
          />
          {Array(3)
            .fill(<></>)
            .map((_, index) => (
              <img
                key={index}
                src={index < leftChicken.lives ? heart : emptyHeart}
                alt="left-lives"
                style={{
                  position: "absolute",
                  height: "30px",
                  width: "30px",
                  bottom: "35px",
                  left: `${40 + index * 25}px`,
                }}
              />
            ))}
          <img
            src={ACTIONS_TO_IMAGES["right"][rightChicken.action]}
            alt="right-chicken"
            style={{
              position: "absolute",
              height: `${CHICKEN_SIDE}px`,
              width: `${CHICKEN_SIDE}px`,
              right: `${rightChicken.position}px`,
              bottom: "110px",
            }}
          />
          {Array(3)
            .fill(<></>)
            .map((_, index) => (
              <img
                key={index}
                src={index < rightChicken.lives ? heart : emptyHeart}
                alt="left-lives"
                style={{
                  position: "absolute",
                  height: "30px",
                  width: "30px",
                  bottom: "35px",
                  right: `${40 + index * 25}px`,
                }}
              />
            ))}
          <img
            src={audience}
            alt="audience"
            style={{
              position: "absolute",
              width: `${CANVAS_WIDTH}px`,
              bottom: "0px",
            }}
          />
        </div>
      </div>
      <div className="flex px-8 py-4">
        <div className="w-1/2 grid grid-cols-2 gap-4 justify-items-center">
          <DiscButton
            letter={KeyboardButtons.LEFT_PUNCH}
            alt="left-chicken-punch"
            onClick={() => punch("left")}
          />
          <DiscButton
            letter={KeyboardButtons.LEFT_BLOCK}
            alt="left-chicken-block"
            onClick={() => block("left")}
          />
          <div>
            <img
              src={leftArrow}
              alt="left-chicken-left-arrow"
              className="h-8 w-8 cursor-pointer"
              onClick={() => moveChicken("left", false)}
            />
            <span>{KeyboardButtons.LEFT_MOVE_LEFT}</span>
          </div>
          <div>
            <img
              src={rightArrow}
              alt="left-chicken-right-arrow"
              className="h-8 w-8 cursor-pointer"
              onClick={() => moveChicken("left", true)}
            />
            <span>{KeyboardButtons.LEFT_MOVE_RIGHT}</span>
          </div>
        </div>
        <div className="w-1/2 grid grid-cols-2 gap-4 justify-items-center">
          <DiscButton
            letter={KeyboardButtons.RIGHT_PUNCH}
            alt="right-chicken-punch"
            onClick={() => punch("right")}
          />
          <DiscButton
            letter={KeyboardButtons.RIGHT_BLOCK}
            alt="right-chicken-block"
            onClick={() => block("right")}
          />
          <div>
            <img
              src={leftArrow}
              alt="right-chicken-left-arrow"
              className="h-8 w-8 cursor-pointer"
              onClick={() => moveChicken("right", false)}
            />
            <span>{KeyboardButtons.RIGHT_MOVE_LEFT}</span>
          </div>
          <div>
            <img
              src={rightArrow}
              alt="right-chicken-right-arrow"
              className="h-8 w-8 cursor-pointer"
              onClick={() => moveChicken("right", true)}
            />
            <span>{KeyboardButtons.RIGHT_MOVE_RIGHT}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
