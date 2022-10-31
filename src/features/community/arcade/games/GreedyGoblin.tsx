/**
 * ---------- GREEDY GOBLIN ----------
 * Credits to Boden, Vergel for the art
 *
 * Objectives:
 * Collect SFL and avoid skulls. Game over when an SFL touches the ground or you caught a skull
 *
 * Made using html canvas and static assets. Had to source newly sized ones for boundary detection
 * as modifying image sizes via js is buggy (or i havent found ways yet)
 */

import React, { useEffect, useRef, useState } from "react";

import { useLongPress } from "lib/utils/hooks/useLongPress";

import { Button } from "components/ui/Button";
import gameBackground from "assets/community/arcade/greedy_goblin/greedy_goblin_background.png";
import gameOver from "assets/community/arcade/greedy_goblin/game_over.png";
import goblin from "assets/community/arcade/greedy_goblin/goblin_catch.png";
import token from "assets/community/arcade/greedy_goblin/coin.png";
import skull from "assets/community/arcade/greedy_goblin/skull.png";
import leftArrow from "assets/icons/arrow_left.png";
import rightArrow from "assets/icons/arrow_right.png";

type IntervalType = ReturnType<typeof setInterval>;

type DropItem = {
  catchable: boolean;
  image: HTMLImageElement;
};

type CollisionArgs = {
  x: number;
  y: number;
  imgWidth: number;
  imgHeight: number;
  catchable: boolean;
  interval: IntervalType;
};

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;

const goblinImage = new Image();
goblinImage.src = goblin;

const gameOverImage = new Image();
gameOverImage.src = gameOver;

const Token: DropItem = {
  catchable: true,
  image: new Image(),
};

const Skull: DropItem = {
  catchable: false,
  image: new Image(),
};

Token.image.src = token;
Skull.image.src = skull;

export const GreedyGoblin: React.FC = () => {
  const [renderPoints, setRenderPoints] = useState(0); // display
  const [isPlaying, setIsPlaying] = useState(false);

  const intervalIds = useRef<IntervalType[]>([]);
  const gameInterval = useRef(2000);
  const dropInterval = useRef(100);
  const isGameOver = useRef(false);
  const points = useRef(0);
  const goblinPosX = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Spawn goblin near center
   * Cleanup intervals on dismount
   */
  useEffect(() => {
    goblinPosX.current = CANVAS_WIDTH / 2;

    canvasRef.current
      ?.getContext("2d")
      ?.drawImage(
        goblinImage,
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT - goblinImage.height
      );

    const keyboardListener = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (key === "arrowleft" || key === "a") {
        moveGob(false);
      } else if (key === "arrowright" || key === "d") {
        moveGob(true);
      }
    };

    window.addEventListener("keydown", keyboardListener);

    return () => {
      intervalIds.current.forEach((id) => clearInterval(id));
      window.removeEventListener("keydown", keyboardListener);
    };
  }, []);

  /**
   * Reset values
   * Redraw goblin in current position
   * Start game logic
   */
  const start = () => {
    isGameOver.current = false;
    points.current = 0;
    setRenderPoints(0);
    setIsPlaying(true);

    const context = canvasRef.current?.getContext("2d");

    context?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context?.drawImage(
      goblinImage,
      goblinPosX.current,
      CANVAS_HEIGHT - goblinImage.height
    );
    dropItem(Token);

    const interval = setInterval(gameLogic, gameInterval.current);
    intervalIds.current.push(interval);
  };

  /**
   * Clear current goblin
   * Get new bounded X position
   * Redraw goblin
   * @param toRight movement direction
   */
  const moveGob = (toRight: boolean) => {
    const context = canvasRef.current?.getContext("2d");
    context?.clearRect(
      goblinPosX.current,
      CANVAS_HEIGHT - goblinImage.height,
      goblinImage.width,
      goblinImage.height
    );

    goblinPosX.current = toRight
      ? Math.min(CANVAS_WIDTH - goblinImage.width, goblinPosX.current + 10)
      : Math.max(0, goblinPosX.current - 10);

    context?.drawImage(
      goblinImage,
      goblinPosX.current,
      CANVAS_HEIGHT - goblinImage.height
    );
  };

  const leftLongPress = useLongPress((_) => moveGob(false), true, undefined, {
    delay: 200,
    interval: 50,
  });

  const rightLongPress = useLongPress((_) => moveGob(true), true, undefined, {
    delay: 200,
    interval: 50,
  });

  /**
   * Perform item drop
   * Update interval rate
   * @todo: finalize logic
   */
  const gameLogic = () => {
    if (points.current > 4 && dropInterval.current === 100) {
      dropInterval.current = 75;
    }

    if (points.current % 3 === 0 && points.current > 0) {
      dropItem(Skull);
    }

    dropItem(Token);
  };

  /**
   * Get random X value
   * At dropInterval, increase y then check for collision
   * @param _.catchable should collide with gob
   * @param _.image image element
   */
  const dropItem = ({ catchable, image }: DropItem) => {
    const randX = Math.floor(Math.random() * (CANVAS_WIDTH - image.width));
    const context = canvasRef.current?.getContext("2d");
    let y = 0;
    const interval = setInterval(() => {
      context?.clearRect(randX, y, image.width, image.height);
      y += 5; // small y for smoother transition
      context?.drawImage(image, randX, y);
      checkCollision({
        x: randX,
        y,
        imgWidth: image.width,
        imgHeight: image.height,
        catchable,
        interval,
      });
    }, dropInterval.current);

    intervalIds.current.push(interval);
  };

  /**
   * Check if drop items collide with goblin image or touches the ground
   * Perform actions based on catchable and collide flags
   * @note goblinPosX used might be the old value
   * @param _.x item's x coordinate
   * @param _.y item's y coordinate
   * @param _.imgWidth image width
   * @param _.imgHeight image Height
   * @param _.catchable should collide with goblin or not
   * @param _.interval timer to clear if necessary
   */
  const checkCollision = ({
    x,
    y,
    imgWidth,
    imgHeight,
    catchable,
    interval,
  }: CollisionArgs) => {
    const context = canvasRef.current?.getContext("2d");
    const collideGround = y >= CANVAS_HEIGHT;
    const imgCenterX = x + imgWidth / 2;
    const collideGob =
      imgCenterX >= goblinPosX.current &&
      imgCenterX < goblinPosX.current + goblinImage.width &&
      // slighty larger hitbox
      y - 5 >= CANVAS_HEIGHT - goblinImage.height;

    // game over check
    if ((catchable && collideGround) || (!catchable && collideGob)) {
      isGameOver.current = true;

      // clear whole space and draw game over image
      context?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      context?.drawImage(gameOverImage, 30, CANVAS_HEIGHT / 4);

      intervalIds.current.forEach((id) => clearInterval(id));
      intervalIds.current = [];
      setIsPlaying(false);

      // point check
    } else if (catchable && collideGob) {
      setRenderPoints((prev) => prev + 1);
      points.current += 1;

      context?.clearRect(x, y, imgWidth, imgHeight);
      clearInterval(interval);
      // redraw goblin
      context?.drawImage(
        goblinImage,
        goblinPosX.current,
        CANVAS_HEIGHT - goblinImage.height
      );

      // allow touch ground
    } else if (!catchable && collideGround) {
      context?.clearRect(x, y, imgWidth, imgHeight);
      clearInterval(interval);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{
            borderStyle: "solid",
            borderWidth: "5px",
            borderRadius: "20px",
            maxWidth: CANVAS_WIDTH,
            maxHeight: CANVAS_HEIGHT,
            backgroundImage: `url(${gameBackground})`,
            backgroundSize: "contain",
          }}
        ></canvas>
        <span className="flex items-center">
          <img src={token} className="w-6" />: {renderPoints}
        </span>
      </div>
      <div className="flex pt-1">
        <Button className="text-sm w-1/2" disabled={isPlaying} onClick={start}>
          Start
        </Button>
        <div className="w-1/2 flex justify-around">
          <img
            src={leftArrow}
            alt="left-arrow"
            className="h-8 w-8 cursor-pointer"
            {...leftLongPress}
          />
          <img
            src={rightArrow}
            alt="right-arrow"
            className="h-8 w-8 cursor-pointer"
            {...rightLongPress}
          />
        </div>
      </div>
    </div>
  );
};
