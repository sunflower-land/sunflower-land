/**
 * ---------- CHICKEN FIGHT ----------
 * Credits:
 *  Art - Jc Eii, Vergel, Deeefault
 *  Audio - Jc Eii
 *  Code - Beastrong, Polysemouse
 *
 * Objectives:
 * Well, defeat enemy :)
 *
 * Movement controls are only via tap for now :|
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
import p1wins from "assets/community/arcade/chicken_fight/images/p1_wins.png";
import p2wins from "assets/community/arcade/chicken_fight/images/p2_wins.png";

import { chickenFightAudio, loadAudio } from "src/lib/utils/sfx";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { randomBoolean } from "lib/utils/random";
import { SUNNYSIDE } from "assets/sunnyside";
import { translate } from "lib/i18n/translate";

const BORDER_WIDTH = PIXEL_SCALE * 2;
const CANVAS_WIDTH = PIXEL_SCALE * 128;
const CANVAS_HEIGHT = CANVAS_WIDTH;
const CHICKEN_IDLE_WIDTH = PIXEL_SCALE * 16;
const CHICKEN_PUNCH_WIDTH = PIXEL_SCALE * 18;
const CHICKEN_MOVE = PIXEL_SCALE * 2;

type Id = "p1" | "p2";
type MoveDirection = "left" | "right";
type Action = "idle" | "punch" | "block" | "hit";
enum KeyboardButtons {
  P1_MOVE_LEFT = "A",
  P1_MOVE_RIGHT = "D",
  P1_PUNCH = "Q",
  P1_BLOCK = "E",
  P2_MOVE_LEFT = "J",
  P2_MOVE_RIGHT = "L",
  P2_PUNCH = "U",
  P2_BLOCK = "O",
}
const ACTIONS_TO_IMAGES: Record<string, Record<string, any>> = {
  p1: {
    idle: leftChickenIdle,
    punch: leftChickenPunch,
    block: leftChickenBlock,
    hit: leftChickenHit,
  },
  p2: {
    idle: rightChickenIdle,
    punch: rightChickenPunch,
    block: rightChickenBlock,
    hit: rightChickenHit,
  },
};

type Chicken = {
  action: Action;
  position: number;
  lives: number;
};

type ChickenPositions = {
  p1: number;
  p2: number;
};
const INITIAL_CHICKEN: Chicken = {
  action: "idle",
  position: PIXEL_SCALE * 24,
  lives: 3,
};

interface ButtonProps {
  letter: string;
  direction?: MoveDirection;
  alt: string;
  onTouchStart: () => void;
  onTouchEnd?: () => void;
}

const DiscButton: React.FC<ButtonProps> = ({
  alt,
  letter,
  onTouchStart,
  onTouchEnd,
}) => {
  return (
    <div
      className="relative cursor-pointer"
      onMouseDown={onTouchStart}
      onTouchStart={onTouchStart}
      onMouseUp={onTouchEnd}
      onMouseLeave={onTouchEnd}
      onTouchEnd={onTouchEnd}
      style={{
        width: `${PIXEL_SCALE * 18}px`,
        height: `${PIXEL_SCALE * 19}px`,
      }}
    >
      <img
        src={SUNNYSIDE.icons.disc}
        alt={alt}
        className="absolute w-full h-full pointer-events-none"
      />
      <div className="absolute flex w-full h-full items-center justify-center pb-2 pointer-events-none">
        <span className="">{letter}</span>
      </div>
    </div>
  );
};

const ArrowButton: React.FC<ButtonProps> = ({
  alt,
  direction,
  letter,
  onTouchStart,
  onTouchEnd,
}) => {
  return (
    <div
      className="flex flex-col text-center items-center cursor-pointer"
      onMouseDown={onTouchStart}
      onTouchStart={onTouchStart}
      onMouseUp={onTouchEnd}
      onMouseLeave={onTouchEnd}
      onTouchEnd={onTouchEnd}
      style={{
        width: `${PIXEL_SCALE * 18}px`,
      }}
    >
      <img
        src={
          direction === "left"
            ? SUNNYSIDE.icons.arrow_left
            : SUNNYSIDE.icons.arrow_right
        }
        alt={alt}
        className="pointer-events-none my-2"
        style={{
          width: `${PIXEL_SCALE * 11}px`,
        }}
      />
      <span className="pointer-events-none">{letter}</span>
    </div>
  );
};

export const ChickenFight: React.FC = () => {
  const [p1ChickenAction, setP1ChickenAction] = useState<Action>(
    INITIAL_CHICKEN.action
  );
  const [p2ChickenAction, setP2ChickenAction] = useState<Action>(
    INITIAL_CHICKEN.action
  );
  const [chickenPositions, setChickenPositions] = useState<ChickenPositions>({
    p1: INITIAL_CHICKEN.position,
    p2: INITIAL_CHICKEN.position,
  });
  const [p1ChickenLives, setP1ChickenLives] = useState<number>(
    INITIAL_CHICKEN.lives
  );
  const [p2ChickenLives, setP2ChickenLives] = useState<number>(
    INITIAL_CHICKEN.lives
  );
  const [winner, setWinner] = useState<Id | undefined>();
  const [activeKeys, setActiveKeys] = useState<KeyboardButtons[]>([]);
  const chickenMoveTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    loadAudio(Object.values(chickenFightAudio));
  }, []);

  /**
   * Start moving the chickens forever until it is stopped
   * @param p1Direction direction from player 1's POV.  Undefined if player 1 is not moving
   * @param p2Direction direction from player 2's POV.  Undefined if player 2 is not moving
   */
  const startMovingChickens = (
    p1Direction?: MoveDirection,
    p2Direction?: MoveDirection
  ) => {
    const loopMovingChickens = (
      p1Direction?: MoveDirection,
      p2Direction?: MoveDirection
    ) => {
      moveChickens(p1Direction, p2Direction);
      chickenMoveTimeout.current = setTimeout(() => {
        loopMovingChickens(p1Direction, p2Direction);
      }, 50);
    };

    // stop moving chickens if both chickens are not moving
    if (!p1Direction && !p2Direction) {
      stopMovingChickens();
    }
    // start moving chickens if previously stopped and some chickens are moving
    else if (!chickenMoveTimeout.current) {
      loopMovingChickens(p1Direction, p2Direction);
    }
    // else change chicken directions
    else {
      stopMovingChickens();
      chickenMoveTimeout.current = setTimeout(() => {
        loopMovingChickens(p1Direction, p2Direction);
      }, 50);
    }
  };

  /**
   * Stop moving the chickens
   */
  const stopMovingChickens = () => {
    if (chickenMoveTimeout.current) {
      clearTimeout(chickenMoveTimeout.current);
      chickenMoveTimeout.current = undefined;
    }
  };

  /**
   * Move chickens to desired position without overlapping
   * Movestep is based on xnor logic (since right chicken movement is inverted)
   * @param p1Direction direction from player 1's POV.  Undefined if player 1 is not moving
   * @param p2Direction direction from player 2's POV.  Undefined if player 2 is not moving
   */
  const moveChickens = (
    p1Direction?: MoveDirection,
    p2Direction?: MoveDirection
  ) => {
    const p1Delta = !p1Direction
      ? 0
      : CHICKEN_MOVE * (p1Direction === "right" ? 1 : -1);
    const p2Delta = !p2Direction
      ? 0
      : CHICKEN_MOVE * (p2Direction === "right" ? -1 : 1);

    // set new chicken positions
    setChickenPositions((prev) => {
      const p1NewPosition = prev.p1 + p1Delta;
      const p2NewPosition = prev.p2 + p2Delta;

      // move forward either player randomly if the next frame results in an overlap if they move towards each other
      const willOverlap =
        p1Direction === "right" &&
        p2Direction === "left" &&
        willCollideWithEnemy(p1NewPosition, p2NewPosition) &&
        !willCollideWithEnemy(prev.p1, p2NewPosition);
      if (willOverlap) {
        const p1MoveForward = randomBoolean();
        return {
          p1: p1MoveForward ? p1NewPosition : prev.p1,
          p2: !p1MoveForward ? p2NewPosition : prev.p2,
        };
      }

      return {
        p1:
          p1NewPosition <= 0 || willCollideWithEnemy(p1NewPosition, prev.p2)
            ? prev.p1
            : p1NewPosition,
        p2:
          p2NewPosition <= 0 || willCollideWithEnemy(prev.p1, p2NewPosition)
            ? prev.p2
            : p2NewPosition,
      };
    });
  };

  /**
   * Checks for collision so chickens don't overlap, switch sides, or go beyond boundaries
   * Compare p1NewPosition and p2NewPosition to 0 for boundaries since they are with respect to absolute position side (left or right)
   * Enemy boundaries are computed with respect to left side for both chickens
   * @param p1NewPosition new position of player 1
   * @param p2NewPosition new position of player 2
   */
  const willCollideWithEnemy = (
    p1NewPosition: number,
    p2NewPosition: number
  ): boolean => {
    const collideWithEnemy =
      p1NewPosition + CHICKEN_IDLE_WIDTH >
      CANVAS_WIDTH - p2NewPosition - CHICKEN_IDLE_WIDTH;
    return collideWithEnemy;
  };

  /**
   * Apply punch gif and decrease life of enemy on hit
   * @param id p1 or p2
   */
  const punch = (id: Id) => {
    const isPlayer1 = id === "p1";

    // ignore button mash
    if (
      (isPlayer1 && p1ChickenAction !== "idle") ||
      (!isPlayer1 && p2ChickenAction !== "idle")
    ) {
      return;
    }

    const actionSetters = [setP1ChickenAction, setP2ChickenAction];
    const [actorActionSetter, enemyActionSetter] = isPlayer1
      ? actionSetters
      : actionSetters.reverse();
    const livesSetters = [setP1ChickenLives, setP2ChickenLives];
    const [_, enemyLivesSetter] = isPlayer1
      ? livesSetters
      : livesSetters.reverse();
    const isEnemyBlocking =
      (isPlayer1 ? p2ChickenAction : p1ChickenAction) === "block";

    actorActionSetter("punch");

    if (!winner && isAdjacent && !isEnemyBlocking) {
      // hit, decrease enemy life
      enemyActionSetter("hit");
      enemyLivesSetter((prev) => prev - 1);
      chickenFightAudio.chickenFightHitAudio.play();
      setTimeout(() => {
        enemyActionSetter("idle");
        chickenFightAudio.chickenFightHitAudio.stop();
      }, 300);
    } else {
      chickenFightAudio.chickenFightPunchAudio.play();
    }

    setTimeout(() => {
      actorActionSetter("idle");
      chickenFightAudio.chickenFightPunchAudio.stop();
    }, 500);
  };

  /**
   * Check if chickens are adjacent to each other
   * Use move step as buffer when chickens are adjacent near boundary
   */
  const isAdjacent = useMemo((): boolean => {
    return (
      chickenPositions.p1 + chickenPositions.p2 + 2 * CHICKEN_IDLE_WIDTH >
      CANVAS_WIDTH - CHICKEN_MOVE
    );
  }, [chickenPositions]);

  /**
   * Block then idle after 600ms
   * @param id p1 or p2
   */
  const block = (id: Id) => {
    const isPlayer1 = id === "p1";
    const actorActionSetter =
      id === "p1" ? setP1ChickenAction : setP2ChickenAction;

    // ignore button mash
    if (
      (isPlayer1 && p1ChickenAction !== "idle") ||
      (!isPlayer1 && p2ChickenAction !== "idle")
    ) {
      return;
    }

    actorActionSetter("block");
    setTimeout(() => {
      actorActionSetter("idle");
    }, 600);
  };

  /**
   * Check the list of active keys to determine chicken movement direction
   * @param keys keyboard/button events
   */
  const checkActiveKeys = (keys: KeyboardButtons[]) => {
    const p1holdKeysLeft = keys.filter(
      (k) => k === KeyboardButtons.P1_MOVE_LEFT
    ).length;
    const p1holdKeysRight = keys.filter(
      (k) => k === KeyboardButtons.P1_MOVE_RIGHT
    ).length;
    const p2holdKeysLeft = keys.filter(
      (k) => k === KeyboardButtons.P2_MOVE_LEFT
    ).length;
    const p2holdKeysRight = keys.filter(
      (k) => k === KeyboardButtons.P2_MOVE_RIGHT
    ).length;

    const p1Direction =
      p1holdKeysLeft === p1holdKeysRight
        ? undefined
        : p1holdKeysLeft > p1holdKeysRight
        ? "left"
        : "right";
    const p2Direction =
      p2holdKeysLeft === p2holdKeysRight
        ? undefined
        : p2holdKeysLeft > p2holdKeysRight
        ? "left"
        : "right";
    startMovingChickens(p1Direction, p2Direction);
  };

  /**
   * check the active keys after modifying it
   */
  useEffect(() => {
    checkActiveKeys(activeKeys);
  }, [activeKeys.sort().toString()]);

  /**
   * Add to list of active keys
   * @param key action key
   */
  const addActiveKeys = (key: KeyboardButtons) => {
    setActiveKeys((prev) => [...prev.filter((k) => k !== key), key]);
  };

  /**
   * Remove from list of active keys
   * @param key action key
   */
  const removeActiveKeys = (key: KeyboardButtons) => {
    setActiveKeys((prev) => prev.filter((k) => k !== key));
  };

  /**
   * Listener for keyboard keydown event
   * Need to check state dependencies and re attach via useEffect
   * @param event keyboard event
   */
  const keydownKeyboardListener = useCallback(
    (event: KeyboardEvent) => {
      event.stopPropagation();
      const key = event.key.toUpperCase();

      switch (key) {
        // p1/p2 chicken movements
        case KeyboardButtons.P1_MOVE_LEFT:
        case KeyboardButtons.P1_MOVE_RIGHT:
        case KeyboardButtons.P2_MOVE_LEFT:
        case KeyboardButtons.P2_MOVE_RIGHT:
          addActiveKeys(key);
          break;

        // p1 chicken actions
        case KeyboardButtons.P1_PUNCH:
          punch("p1");
          break;
        case KeyboardButtons.P1_BLOCK:
          block("p1");
          break;

        // right chicken actions
        case KeyboardButtons.P2_PUNCH:
          punch("p2");
          break;
        case KeyboardButtons.P2_BLOCK:
          block("p2");
          break;
      }
    },
    [
      p1ChickenAction,
      p2ChickenAction,
      p1ChickenLives,
      p2ChickenLives,
      chickenPositions,
    ]
  );

  /**
   * Listener for keyboard keyup event
   * Need to check state dependencies and re attach via useEffect
   * @param event keyboard event
   */
  const keyupKeyboardListener = useCallback(
    (event: KeyboardEvent) => {
      event.stopPropagation();
      const key = event.key.toUpperCase();

      switch (key) {
        // p1/p2 chicken movements
        case KeyboardButtons.P1_MOVE_LEFT:
        case KeyboardButtons.P1_MOVE_RIGHT:
        case KeyboardButtons.P2_MOVE_LEFT:
        case KeyboardButtons.P2_MOVE_RIGHT:
          removeActiveKeys(key);
          break;
      }
    },
    [
      p1ChickenAction,
      p2ChickenAction,
      p1ChickenLives,
      p2ChickenLives,
      chickenPositions,
    ]
  );

  /**
   * Reset the game
   */
  const reset = () => {
    setWinner(undefined);
    setP1ChickenAction(INITIAL_CHICKEN.action);
    setP2ChickenAction(INITIAL_CHICKEN.action);
    setP1ChickenLives(INITIAL_CHICKEN.lives);
    setP2ChickenLives(INITIAL_CHICKEN.lives);
    setChickenPositions({
      p1: INITIAL_CHICKEN.position,
      p2: INITIAL_CHICKEN.position,
    });

    chickenFightAudio.chickenFightPlayingAudio.play();
  };

  /**
   * Attaches/updates listener on keydown
   */
  useEffect(() => {
    document.addEventListener("keydown", keydownKeyboardListener);
    return () => {
      document.removeEventListener("keydown", keydownKeyboardListener);
    };
  }, [keydownKeyboardListener]);

  /**
   * Attaches/updates listener on keyup
   */
  useEffect(() => {
    document.addEventListener("keyup", keyupKeyboardListener);
    return () => {
      document.addEventListener("keyup", keyupKeyboardListener);
    };
  }, [keyupKeyboardListener]);

  /**
   *
   * Plays audio when entering page and stops when leaving page
   */
  useEffect(() => {
    chickenFightAudio.chickenFightPlayingAudio.play();

    return () => {
      Object.values(chickenFightAudio).forEach((audio) => audio.stop());
    };
  }, []);

  /**
   * Watches chicken lives for player winning
   */
  useEffect(() => {
    if (!(p1ChickenLives && p2ChickenLives)) {
      setWinner(p1ChickenLives > 0 ? "p1" : "p2");

      chickenFightAudio.chickenFightPlayingAudio.stop();
      chickenFightAudio.chickenFightGameOverAudio.play();
    }
  }, [p1ChickenLives, p2ChickenLives]);

  return (
    <div>
      {/* Canvas */}
      <div className="flex items-center justify-center">
        <div
          style={{
            position: "relative",
            borderStyle: "solid",
            borderWidth: `${BORDER_WIDTH}px`,
            borderRadius: `${PIXEL_SCALE * 6}px`,
            width: `${CANVAS_WIDTH + BORDER_WIDTH * 2}px`,
            height: `${CANVAS_HEIGHT + BORDER_WIDTH * 2}px`,
            backgroundImage: `url(${gameBackground})`,
            backgroundSize: "contain",
          }}
        >
          <img
            src={referee}
            alt="referee"
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 18}px`,
              top: `${CANVAS_HEIGHT / 2 - PIXEL_SCALE * 30}px`,
              left: `${CANVAS_WIDTH / 2 - PIXEL_SCALE * 9}px`,
            }}
          />
          <img
            src={ACTIONS_TO_IMAGES["p1"][p1ChickenAction]}
            alt="p1"
            className="absolute pointer-events-none"
            style={{
              zIndex: p1ChickenAction === "punch" ? 20 : 10,
              width: `${
                p1ChickenAction === "punch"
                  ? CHICKEN_PUNCH_WIDTH
                  : CHICKEN_IDLE_WIDTH
              }px`,
              bottom: `${CANVAS_HEIGHT / 2 - PIXEL_SCALE * 15}px`,
              left: `${chickenPositions.p1}px`,
            }}
          />
          <img
            src={ACTIONS_TO_IMAGES["p2"][p2ChickenAction]}
            alt="p2"
            className="absolute pointer-events-none"
            style={{
              zIndex: p2ChickenAction === "punch" ? 20 : 10,
              width: `${
                p2ChickenAction === "punch"
                  ? CHICKEN_PUNCH_WIDTH
                  : CHICKEN_IDLE_WIDTH
              }px`,
              right: `${chickenPositions.p2}px`,
              bottom: `${CANVAS_HEIGHT / 2 - PIXEL_SCALE * 15}px`,
            }}
          />
          {Array(INITIAL_CHICKEN.lives)
            .fill(<></>)
            .map((_, index) => (
              <img
                key={index}
                src={index < p1ChickenLives ? heart : emptyHeart}
                alt={`p1-life-${index}`}
                className="absolute pointer-events-none"
                style={{
                  width: `${PIXEL_SCALE * 13}px`,
                  bottom: `${PIXEL_SCALE * 16}px`,
                  left: `${PIXEL_SCALE * (14 + index * 12)}px`,
                }}
              />
            ))}
          {Array(INITIAL_CHICKEN.lives)
            .fill(<></>)
            .map((_, index) => (
              <img
                key={index}
                src={index < p2ChickenLives ? heart : emptyHeart}
                alt={`p2-life-${index}`}
                className="absolute pointer-events-none"
                style={{
                  width: `${PIXEL_SCALE * 13}px`,
                  bottom: `${PIXEL_SCALE * 16}px`,
                  right: `${PIXEL_SCALE * (14 + index * 12)}px`,
                }}
              />
            ))}
          <img
            src={audience}
            alt="audience"
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 124}px`,
              bottom: "0px",
              left: `${PIXEL_SCALE * 2}px`,
            }}
          />
          {winner && (
            <div className="text-center" onClick={reset}>
              <img
                src={winner === "p1" ? p1wins : p2wins}
                alt="game-over"
                className="absolute pointer-events-none"
                style={{
                  width: `${PIXEL_SCALE * 104}px`,
                  top: `${PIXEL_SCALE * 34}px`,
                  left: `${CANVAS_WIDTH / 2 - PIXEL_SCALE * 52}px`,
                }}
              />
              <span className="cursor-pointer text-sm">
                {translate("chicken.winner.playagain")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex px-4 py-4 justify-between">
        <div className="w-full grid grid-cols-4 gap-4 justify-items-center">
          <DiscButton
            letter={KeyboardButtons.P1_PUNCH}
            alt="p1-punch"
            onTouchStart={() => punch("p1")}
          />
          <DiscButton
            letter={KeyboardButtons.P1_BLOCK}
            alt="p1-block"
            onTouchStart={() => block("p1")}
          />
          <DiscButton
            letter={KeyboardButtons.P2_PUNCH}
            alt="p2-punch"
            onTouchStart={() => punch("p2")}
          />
          <DiscButton
            letter={KeyboardButtons.P2_BLOCK}
            alt="p2-block"
            onTouchStart={() => block("p2")}
          />
          <ArrowButton
            letter={KeyboardButtons.P1_MOVE_LEFT}
            alt="p1-left-arrow"
            direction="left"
            onTouchStart={() => addActiveKeys(KeyboardButtons.P1_MOVE_LEFT)}
            onTouchEnd={() => removeActiveKeys(KeyboardButtons.P1_MOVE_LEFT)}
          />
          <ArrowButton
            letter={KeyboardButtons.P1_MOVE_RIGHT}
            alt="p1-right-arrow"
            direction="right"
            onTouchStart={() => addActiveKeys(KeyboardButtons.P1_MOVE_RIGHT)}
            onTouchEnd={() => removeActiveKeys(KeyboardButtons.P1_MOVE_RIGHT)}
          />
          <ArrowButton
            letter={KeyboardButtons.P2_MOVE_LEFT}
            alt="p2-left-arrow"
            direction="left"
            onTouchStart={() => addActiveKeys(KeyboardButtons.P2_MOVE_LEFT)}
            onTouchEnd={() => removeActiveKeys(KeyboardButtons.P2_MOVE_LEFT)}
          />
          <ArrowButton
            letter={KeyboardButtons.P2_MOVE_RIGHT}
            alt="p2-right-arrow"
            direction="right"
            onTouchStart={() => addActiveKeys(KeyboardButtons.P2_MOVE_RIGHT)}
            onTouchEnd={() => removeActiveKeys(KeyboardButtons.P2_MOVE_RIGHT)}
          />
        </div>
      </div>
    </div>
  );
};
