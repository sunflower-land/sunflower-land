import React, { useEffect, useRef, useState } from "react";

import { Button } from "components/ui/Button";
import forestBackground from "assets/bumpkins/shop/background/forest_background.png";
import goblin from "assets/npcs/goblin_head.png";
import token from "assets/icons/token_2.png";
import human from "assets/icons/player.png";
import leftArrow from "assets/icons/arrow_left.png";
import rightArrow from "assets/icons/arrow_right.png";

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;

const goblinImage = new Image();
goblinImage.src = goblin;

const tokenImage = new Image();
tokenImage.src = token;

const humanImage = new Image();
humanImage.src = human;

type IntervalType = ReturnType<typeof setInterval>;

type CollisionArgs = {
  x: number;
  y: number;
  imgWidth: number;
  imgHeight: number;
  eatable: boolean;
  interval: IntervalType;
};

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

    return () => {
      intervalIds.current.forEach((id) => clearInterval(id));
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

    canvasRef.current
      ?.getContext("2d")
      ?.drawImage(
        goblinImage,
        goblinPosX.current,
        CANVAS_HEIGHT - goblinImage.height
      );
    dropItem(true);

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
      dropItem(false);
    }

    dropItem(true);
  };

  /**
   * Get random X value
   * At dropInterval, increase y then check for collision
   * @param eatable should collide with goblin or not
   */
  const dropItem = (eatable: boolean) => {
    const img = eatable ? tokenImage : humanImage;
    const randX = Math.floor(Math.random() * (CANVAS_WIDTH - img.width));
    const context = canvasRef.current?.getContext("2d");
    let y = 0;
    const interval = setInterval(() => {
      context?.clearRect(randX, y, img.width, img.height);
      y += 5; // small y for smoother transition
      context?.drawImage(img, randX, y);
      checkCollision({
        x: randX,
        y,
        imgWidth: img.width,
        imgHeight: img.height,
        eatable,
        interval,
      });
    }, dropInterval.current);

    intervalIds.current.push(interval);
  };

  /**
   * Check if drop items collide with goblin image or touches the ground
   * Perform actions based on eatable and collide flags
   * @note goblinPosX used might be the old value
   * @param _.x item's x coordinate
   * @param _.y item's y coordinate
   * @param _.imgWidth image width
   * @param _.imgHeight image Height
   * @param _.eatable should collide with goblin or not
   * @param _.interval timer to clear if necessary
   */
  const checkCollision = ({
    x,
    y,
    imgWidth,
    imgHeight,
    eatable,
    interval,
  }: CollisionArgs) => {
    const context = canvasRef.current?.getContext("2d");
    const collideGround = y >= CANVAS_HEIGHT;
    const imgCenterX = x + imgWidth / 2;
    const collideGob =
      imgCenterX >= goblinPosX.current &&
      imgCenterX < goblinPosX.current + goblinImage.width &&
      y >= CANVAS_HEIGHT - goblinImage.height;

    // game over check
    if ((eatable && collideGround) || (!eatable && collideGob)) {
      isGameOver.current = true;

      // clear whole space
      context?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      intervalIds.current.forEach((id) => clearInterval(id));
      intervalIds.current = [];
      setIsPlaying(false);
    } else if (eatable && collideGob) {
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
    } else if (!eatable && collideGround) {
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
            backgroundImage: `url(${forestBackground})`,
          }}
        ></canvas>
        <span>SFL Tokens: {renderPoints}</span>
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
            onClick={() => moveGob(false)}
          />
          <img
            src={rightArrow}
            alt="right-arrow"
            className="h-8 w-8 cursor-pointer"
            onClick={() => moveGob(true)}
          />
        </div>
      </div>
    </div>
  );
};
