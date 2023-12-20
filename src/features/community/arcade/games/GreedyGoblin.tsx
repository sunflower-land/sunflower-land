/**
 * ---------- GREEDY GOBLIN ----------
 * Credits:
 *  Art - Boden, Vergel
 *  Audio - Jc Eii
 *  Code - Beastrong, Polysemouse
 *
 * Objectives:
 * Collect SFL and avoid skulls. Game over when SFL touches the ground or you caught a skull
 *
 * Made using html canvas and static assets. Had to source newly sized ones for boundary detection
 * as modifying image sizes via js is buggy (or i havent found ways yet)
 */

import React, { useEffect, useRef, useState } from "react";

import { Button } from "components/ui/Button";
import gameBackground from "assets/community/arcade/greedy_goblin/images/greedy_goblin_background.png";
import goblin from "assets/community/arcade/greedy_goblin/images/goblin_catch.png";
import token from "assets/community/arcade/greedy_goblin/images/coin.png";
import skull from "assets/community/arcade/greedy_goblin/images/skull.png";
import gameOver from "assets/community/arcade/images/game_over.png";

import { greedyGoblinAudio } from "src/lib/utils/sfx";
import { randomInt } from "lib/utils/random";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";

type MoveDirection = "left" | "right";
type ActionKeys =
  | "a"
  | "d"
  | "arrowleft"
  | "arrowright"
  | "uiArrowLeft"
  | "uiArrowRight";

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
const INIT_GAME_INTERVAL = 2000; // 2s
const INIT_DROP_INTERVAL = 100; // 100ms
const INIT_SKULL_DROP_INTERVAL = 3; // drop skull every 3 tokens

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

declare global {
  export interface CanvasRenderingContext2D {
    drawGoblinImage(): void;
  }
}

export const GreedyGoblin: React.FC = () => {
  const [renderPoints, setRenderPoints] = useState(0); // display
  const [isPlaying, setIsPlaying] = useState(false);

  const gameLogicTimeout = useRef<NodeJS.Timeout>();
  const intervalIds = useRef<IntervalType[]>([]);
  const gameInterval = useRef(INIT_GAME_INTERVAL);
  const dropInterval = useRef(INIT_DROP_INTERVAL);
  const skullDropInterval = useRef(INIT_SKULL_DROP_INTERVAL);
  const isGameOver = useRef(false);
  const points = useRef(0);
  const goblinPosX = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const goblinMoveTimeout = useRef<NodeJS.Timeout>();
  const activeKeys = useRef<ActionKeys[]>([]);

  /**
   * Start moving the goblin forever until it is stopped
   */
  const startMovingGoblin = (direction: MoveDirection) => {
    const loopMovingGoblin = (direction: MoveDirection) => {
      moveGoblin(direction);
      goblinMoveTimeout.current = setTimeout(loopMovingGoblin, 50, direction);
    };

    if (!goblinMoveTimeout.current) {
      loopMovingGoblin(direction);
    }
  };

  /**
   * Stop moving the goblin
   */
  const stopMovingGoblin = () => {
    if (goblinMoveTimeout.current) {
      clearTimeout(goblinMoveTimeout.current);
      goblinMoveTimeout.current = undefined;
    }
  };

  /**
   * Check the list of active keys to determine goblin movement direction
   * Add to list of active keys when key is down
   * @param keys keyboard event
   */
  const checkActiveKeys = (keys: ActionKeys[]) => {
    const holdKeysLeft = keys.filter(
      (k) => k === "arrowleft" || k === "a" || k === "uiArrowLeft"
    ).length;
    const holdKeysRight = keys.filter(
      (k) => k === "arrowright" || k === "d" || k === "uiArrowRight"
    ).length;
    if (holdKeysLeft === holdKeysRight) {
      stopMovingGoblin();
    } else if (holdKeysLeft < holdKeysRight) {
      startMovingGoblin("right");
    } else if (holdKeysLeft > holdKeysRight) {
      startMovingGoblin("left");
    }
  };

  /**
   * Add to list of active keys and check active keys
   * @param key action key
   */
  const addAndCheckActiveKeys = (key: ActionKeys) => {
    activeKeys.current = [...activeKeys.current.filter((k) => k !== key), key];
    checkActiveKeys(activeKeys.current);
  };

  /**
   * Remove from list of active keys and check active keys
   * @param key action key
   */
  const removeAndCheckActiveKeys = (key: ActionKeys) => {
    activeKeys.current = activeKeys.current.filter((k) => k !== key);
    checkActiveKeys(activeKeys.current);
  };

  /**
   * Listener for keyboard keydown event
   * Add to list of active keys when key is down
   * @param event keyboard event
   */
  const keydownKeyboardListener = (event: KeyboardEvent) => {
    event.stopPropagation();
    const key = event.key.toLowerCase();

    if (
      key === "arrowleft" ||
      key === "a" ||
      key === "arrowright" ||
      key === "d"
    ) {
      addAndCheckActiveKeys(key);
    }
  };

  /**
   * Listener for keyboard keyup event
   * Remove from list of active keys when key is up
   * @param event keyboard event
   */
  const keyupKeyboardListener = (event: KeyboardEvent) => {
    event.stopPropagation();
    const key = event.key.toLowerCase();

    // remove from list of active keys
    if (
      key === "arrowleft" ||
      key === "a" ||
      key === "arrowright" ||
      key === "d"
    ) {
      removeAndCheckActiveKeys(key);
    }
  };

  /**
   * Draw goblin image in canvas
   * @param this canvas rendering context
   */
  CanvasRenderingContext2D.prototype.drawGoblinImage = function (
    this: CanvasRenderingContext2D
  ) {
    this.drawImage(
      goblinImage,
      goblinPosX.current,
      CANVAS_HEIGHT - goblinImage.height
    );
  };

  /**
   * Spawn goblin near center
   * Cleanup on dismount
   */
  useEffect(() => {
    goblinPosX.current = CANVAS_WIDTH / 2;

    canvasRef.current?.getContext("2d")?.drawGoblinImage();

    document.addEventListener("keydown", keydownKeyboardListener);
    document.addEventListener("keyup", keyupKeyboardListener);

    greedyGoblinAudio.greedyGoblinIntroAudio.play();

    return () => {
      intervalIds.current.forEach((id) => clearInterval(id));
      stopGameLogic();
      document.removeEventListener("keydown", keydownKeyboardListener);
      document.removeEventListener("keyup", keyupKeyboardListener);

      Object.values(greedyGoblinAudio).forEach((audio) => audio.stop());
    };
  }, []);

  /**
   * Reset values
   * Redraw goblin in current position
   * Start game logic
   */
  const startGame = () => {
    isGameOver.current = false;
    points.current = 0;
    setRenderPoints(0);
    setIsPlaying(true);

    greedyGoblinAudio.greedyGoblinIntroAudio.stop();
    greedyGoblinAudio.greedyGoblinPlayingAudio.play();

    const context = canvasRef.current?.getContext("2d");

    context?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context?.drawGoblinImage();

    startGameLogic();
  };

  /**
   * Clear current goblin
   * Get new bounded X position
   * Redraw goblin
   * @param direction movement direction
   */
  const moveGoblin = (direction: MoveDirection) => {
    const context = canvasRef.current?.getContext("2d");
    context?.clearRect(
      goblinPosX.current,
      CANVAS_HEIGHT - goblinImage.height,
      goblinImage.width,
      goblinImage.height
    );

    goblinPosX.current =
      direction === "right"
        ? Math.min(CANVAS_WIDTH - goblinImage.width, goblinPosX.current + 10)
        : Math.max(0, goblinPosX.current - 10);

    context?.drawGoblinImage();
  };

  /**
   * Decrease game and drop interval (increase difficulty) as player gain more points
   */
  const setDifficulty = () => {
    if (points.current > 2000) {
      skullDropInterval.current = 1;
    } else if (points.current > 1000) {
      skullDropInterval.current = 2;
    } else {
      skullDropInterval.current = INIT_SKULL_DROP_INTERVAL;
    }

    if (points.current > 4000) {
      gameInterval.current = 800;
      dropInterval.current = 40;
    } else if (points.current > 3500) {
      gameInterval.current = 900;
      dropInterval.current = 45;
    } else if (points.current > 3000) {
      gameInterval.current = 1000;
      dropInterval.current = 50;
    } else if (points.current > 2500) {
      gameInterval.current = 1100;
      dropInterval.current = 55;
    } else if (points.current > 2000) {
      gameInterval.current = 1200;
      dropInterval.current = 60;
    } else if (points.current > 1500) {
      gameInterval.current = 1300;
      dropInterval.current = 65;
    } else if (points.current > 1000) {
      gameInterval.current = 1400;
      dropInterval.current = 70;
    } else if (points.current > 800) {
      gameInterval.current = 1500;
      dropInterval.current = 75;
    } else if (points.current > 500) {
      gameInterval.current = 1600;
      dropInterval.current = 80;
    } else if (points.current > 250) {
      gameInterval.current = 1700;
      dropInterval.current = 85;
    } else if (points.current > 100) {
      gameInterval.current = 1800;
      dropInterval.current = 90;
    } else if (points.current > 50) {
      gameInterval.current = 1900;
      dropInterval.current = 95;
    } else if (points.current > 20) {
      gameInterval.current = 1950;
      dropInterval.current = 97.5;
    } else {
      gameInterval.current = INIT_GAME_INTERVAL;
      dropInterval.current = INIT_DROP_INTERVAL;
    }
  };

  /**
   * Start game logic
   */
  const startGameLogic = () => {
    if (!gameLogicTimeout.current) {
      loopGameLogic();
    }
  };

  /**
   * Loop game logic
   */
  const loopGameLogic = () => {
    setDifficulty();
    gameLogic();

    // refresh game interval for game logic
    if (isPlaying) {
      stopGameLogic();
      gameLogicTimeout.current = setTimeout(
        loopGameLogic,
        gameInterval.current
      );
    }

    // loop initial game logic
    gameLogicTimeout.current = setTimeout(loopGameLogic, gameInterval.current);
  };

  /**
   * Stop game logic
   */
  const stopGameLogic = () => {
    if (gameLogicTimeout.current) {
      clearTimeout(gameLogicTimeout.current);
      gameLogicTimeout.current = undefined;
    }
  };

  /**
   * Perform item drop
   */
  const gameLogic = () => {
    if (
      points.current % skullDropInterval.current === 0 &&
      points.current > 0
    ) {
      const items = [Skull, Token].sort(() => 0.5 - Math.random());
      const item1 = items[0];
      const item2 = items[1];
      const randXItem1 = randomInt(5, CANVAS_WIDTH - item1.image.width - 40);
      const randXItem2 = randomInt(
        randXItem1 + item1.image.width + 20,
        CANVAS_WIDTH - item2.image.width - 5
      );
      dropItem(item1, randXItem1);
      dropItem(item2, randXItem2);
    } else {
      dropItem(Token);
    }
  };

  /**
   * At dropInterval, increase y then check for collision
   * @param _.catchable should collide with goblin
   * @param _.image image element
   * @param x x position of the drop
   */
  const dropItem = ({ catchable, image }: DropItem, x?: number) => {
    const context = canvasRef.current?.getContext("2d");
    if (!x) {
      x = randomInt(5, CANVAS_WIDTH - image.width - 5);
    }
    let y = 0;
    const interval = setInterval(() => {
      context?.clearRect(x!, y, image.width, image.height);
      y += 5; // small y for smoother transition
      context?.drawImage(image, x!, y);
      checkCollision({
        x: x!,
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
    const collideGround = y + imgHeight / 2 >= CANVAS_HEIGHT;
    const imgCenterX = x + imgWidth / 2;
    const collideGoblin =
      imgCenterX >= goblinPosX.current &&
      imgCenterX < goblinPosX.current + goblinImage.width &&
      // slightly larger hit-box
      y + 8 >= CANVAS_HEIGHT - goblinImage.height;

    // game over check
    if ((catchable && collideGround) || (!catchable && collideGoblin)) {
      isGameOver.current = true;

      greedyGoblinAudio.greedyGoblinGameOverAudio.play();
      greedyGoblinAudio.greedyGoblinPlayingAudio.stop();

      // clear whole space and draw game over image
      context?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      context?.drawImage(
        gameOverImage,
        CANVAS_HEIGHT / 2 - 69,
        CANVAS_HEIGHT / 2 - 40
      );
      context?.drawGoblinImage();

      intervalIds.current.forEach((id) => clearInterval(id));
      intervalIds.current = [];
      stopGameLogic();
      setIsPlaying(false);
    }

    // point check
    else if (catchable && collideGoblin) {
      setRenderPoints((prev) => prev + 1);
      points.current += 1;

      greedyGoblinAudio.greedyGoblinPickAudio.play();

      context?.clearRect(x, y, imgWidth, imgHeight);
      clearInterval(interval);
      intervalIds.current = [
        ...intervalIds.current.filter((i) => i !== interval),
      ];

      // redraw goblin after collision
      context?.drawGoblinImage();
    }

    // allow touch ground
    else if (!catchable && collideGround) {
      context?.clearRect(x, y, imgWidth, imgHeight);
      clearInterval(interval);
      intervalIds.current = [
        ...intervalIds.current.filter((i) => i !== interval),
      ];
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
            borderRadius: "15px",
            maxWidth: CANVAS_WIDTH,
            maxHeight: CANVAS_HEIGHT,
            backgroundImage: `url(${gameBackground})`,
            backgroundSize: "contain",
          }}
        ></canvas>
        <span className="flex items-center">
          <img
            src={token}
            style={{
              width: `${PIXEL_SCALE * 10}px`,
              margin: `${PIXEL_SCALE * 3}px`,
            }}
          />
          {renderPoints}
        </span>
      </div>
      <div
        className="flex mb-2 flex justify-around"
        style={{
          height: `${PIXEL_SCALE * 32}px`,
        }}
      >
        <div
          className="cursor-pointer"
          onMouseDown={() => addAndCheckActiveKeys("uiArrowLeft")}
          onTouchStart={() => addAndCheckActiveKeys("uiArrowLeft")}
          onMouseUp={() => removeAndCheckActiveKeys("uiArrowLeft")}
          onMouseLeave={() => removeAndCheckActiveKeys("uiArrowLeft")}
          onTouchEnd={() => removeAndCheckActiveKeys("uiArrowLeft")}
          style={{
            padding: `${PIXEL_SCALE * 10}px`,
          }}
        >
          <img
            className="pointer-events-none"
            src={SUNNYSIDE.icons.arrow_left}
            alt="left-arrow"
            style={{
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </div>
        <div
          className="cursor-pointer"
          onMouseDown={() => addAndCheckActiveKeys("uiArrowRight")}
          onTouchStart={() => addAndCheckActiveKeys("uiArrowRight")}
          onMouseUp={() => removeAndCheckActiveKeys("uiArrowRight")}
          onMouseLeave={() => removeAndCheckActiveKeys("uiArrowRight")}
          onTouchEnd={() => removeAndCheckActiveKeys("uiArrowRight")}
          style={{
            padding: `${PIXEL_SCALE * 10}px`,
          }}
        >
          <img
            className="pointer-events-none"
            src={SUNNYSIDE.icons.arrow_right}
            alt="right-arrow"
            style={{
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </div>
      </div>
      <Button className="text-sm" disabled={isPlaying} onClick={startGame}>
        Start
      </Button>
    </div>
  );
};
