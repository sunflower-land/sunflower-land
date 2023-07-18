import React, { useContext, useReducer } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelTableBorderStyle } from "features/game/lib/style";
import tableTop from "assets/ui/table_top.webp";
import plant from "assets/decorations/planter_box.webp";
import { InnerPanel } from "components/ui/Panel";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { Button } from "components/ui/Button";
import { ResizableBar } from "components/ui/ProgressBar";
import { SpeechBubble } from "./SpeechBubble";
import { POTIONS } from "./lib/potions";
import { Box } from "./Box";
import shadow from "assets/npcs/shadow.png";
import classNames from "classnames";
import { Context } from "features/game/GameProvider";
import { MachineState as GameMachineState } from "features/game/lib/gameMachine";
import { PotionName } from "features/game/types/game";
import { calculateScore } from "features/game/events/landExpansion/mixPotion";
import { Potion } from "./lib/types";

interface Props {
  onClose: () => void;
}

const _inventory = (state: GameMachineState) => state.context.state.inventory;
const _isPlaying = (state: GameMachineState) =>
  state.matches("playing") || state.matches("rules");
const _isGameOver = (state: GameMachineState) =>
  !state.matches("playing") && !state.matches("rules");

type Potions = [
  PotionName | null,
  PotionName | null,
  PotionName | null,
  PotionName | null
];

type PotionState = {
  guessSpot: number;
  selectedPotion: Potion;
  currentGuess: Potions;
  feedbackText: string;
  isPrizeRevealed: boolean;
  isNewGame: boolean;
};

type PotionAction =
  | {
      type: "UPDATE_GUESS_SPOT";
      guessSpot: number;
    }
  | { type: "RESET_GAME" }
  | { type: "REMOVE_GUESS"; guessSpot: number }
  | { type: "ADD_GUESS"; guessSpot: number; potion: PotionName }
  | { type: "REVEAL_PRIZE" }
  | { type: "NEW_GAME" }
  | { type: "UPDATE_POTION"; potion: PotionName };

const resetGame = (isGameFinished: boolean): PotionState => ({
  guessSpot: 0,
  selectedPotion: Object.values(POTIONS)[0],
  currentGuess: [null, null, null, null],
  feedbackText: "Select your potions and unveil the secrets of the plants!",
  isPrizeRevealed: isGameFinished,
  isNewGame: false,
});

const gameHandler = (state: PotionState, action: PotionAction): PotionState => {
  switch (action.type) {
    case "UPDATE_GUESS_SPOT":
      return {
        ...state,
        guessSpot: action.guessSpot,
      };
    case "REMOVE_GUESS": {
      const newGuess: Potions = [...state.currentGuess];
      newGuess[action.guessSpot] = null;
      return {
        ...state,
        currentGuess: newGuess,
      };
    }
    case "ADD_GUESS": {
      const newGuess: Potions = [...state.currentGuess];
      newGuess[action.guessSpot] = action.potion;
      return {
        ...state,
        currentGuess: newGuess,
        guessSpot: newGuess.indexOf(null),
      };
    }
    case "REVEAL_PRIZE":
      return {
        ...state,
        isPrizeRevealed: true,
      };
    case "NEW_GAME": {
      return {
        ...state,
        isNewGame: true,
      };
    }
    case "UPDATE_POTION":
      return {
        ...state,
        selectedPotion: POTIONS[action.potion],
      };
    case "RESET_GAME":
      return resetGame(false);
  }
};

export const Experiment: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);

  const potionHouse = gameService.state.context.state.potionHouse;
  const inventory = gameService.state.context.state.inventory;

  const isFinished = potionHouse?.game.status === "finished";

  const [potionState, dispatch] = useReducer(
    gameHandler,
    resetGame(isFinished)
  );

  const {
    isNewGame,
    currentGuess,
    feedbackText,
    guessSpot,
    isPrizeRevealed,
    selectedPotion,
  } = potionState;

  const isEndScreen = isFinished && !isNewGame;

  const previousAttempts = potionHouse?.game.attempts ?? [];
  const lastAttempt = previousAttempts[previousAttempts.length - 1] ?? [];

  const emptyAttempt = new Array<{ potion: null; status: undefined }>(4).fill({
    potion: null,
    status: undefined,
  });

  const attempts = isNewGame
    ? new Array<{ potion: null; status: undefined }[]>(3).fill(emptyAttempt)
    : previousAttempts.concat(new Array(3).fill(emptyAttempt)).slice(0, 3);

  const guessRow = isNewGame ? 0 : potionHouse?.game.attempts.length ?? 0;
  const score = isNewGame ? 0 : calculateScore(lastAttempt);

  const onPotionButtonClick = () => {
    // REMOVE
    if (currentGuess[guessSpot]) {
      dispatch({ type: "REMOVE_GUESS", guessSpot: guessSpot });
      return;
    }

    dispatch({
      type: "ADD_GUESS",
      guessSpot: guessSpot,
      potion: selectedPotion.name,
    });
  };

  const onSubmit = () => {
    dispatch({ type: "RESET_GAME" });

    gameService.send("potion.mixed", {
      attemptNumber: guessRow + 1,
      potions: currentGuess,
    });
    gameService.send("SAVE");
  };

  return (
    <>
      {isEndScreen && !isPrizeRevealed && (
        <Button onClick={() => dispatch({ type: "REVEAL_PRIZE" })}>
          Reveal Prize
        </Button>
      )}
      {isEndScreen && isPrizeRevealed && (
        <div>
          {potionHouse?.game.reward
            ? `Congratulations! You won a ${[potionHouse?.game.reward]}!`
            : "Whoops! better luck next time!"}
        </div>
      )}
      <div
        className={classNames("transition-all ease-in duration-300", {
          "translate-y-28": isEndScreen,
        })}
      >
        <div className="flex w-full">
          {/* Left Side */}
          <div className="flex w-3/5">
            <div className="flex flex-col items-center">
              {/* Table */}
              <div className="w-full flex relative mb-3">
                <div
                  className="w-full"
                  style={{
                    ...pixelTableBorderStyle,
                  }}
                >
                  {/* Grid */}
                  <div
                    className="h-full w-full p-1"
                    style={{
                      backgroundImage: `url(${tableTop})`,
                      backgroundRepeat: "repeat",
                      backgroundSize: `${PIXEL_SCALE * 16}px`,
                    }}
                  >
                    {/* Plant */}
                    <div className="flex items-center mb-2 flex-col">
                      <img
                        src={plant}
                        alt="Plant"
                        className="mb-1"
                        style={{ width: `${PIXEL_SCALE * 28}px` }}
                      />
                      {/* <Prog */}
                      <ResizableBar
                        percentage={score}
                        type="health"
                        outerDimensions={{
                          width: 28,
                          height: 7,
                        }}
                      />
                    </div>
                    {attempts
                      .map((attempt, rowIndex) => (
                        <div className="flex items-center mb-2" key={rowIndex}>
                          {attempt.map(({ potion, status }, columnIndex) => {
                            if (rowIndex === guessRow) {
                              return (
                                <div
                                  className="relative"
                                  key={`select-${columnIndex}`}
                                  onClick={() =>
                                    dispatch({
                                      type: "UPDATE_GUESS_SPOT",
                                      guessSpot: columnIndex,
                                    })
                                  }
                                >
                                  <Box
                                    potionName={currentGuess[columnIndex]}
                                    selected={guessSpot === columnIndex}
                                  />
                                </div>
                              );
                            }

                            return (
                              <Box
                                key={`${rowIndex}-${columnIndex}`}
                                potionName={potion}
                                potionStatus={status}
                              />
                            );
                          })}
                        </div>
                      ))
                      .reverse()}
                    <Button
                      className="mt-2"
                      disabled={currentGuess.some((potion) => potion === null)}
                      onClick={() => onSubmit()}
                    >
                      Mix potion
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right Side */}
          <div className="flex flex-col items-center w-full grow justify-center">
            <div className="flex flex-col items-center justify-between">
              <div className="ml-3 flex flex-col items-center sm:max-w-[70%]">
                <SpeechBubble text={feedbackText} className="w-4/5" />
                <div
                  className="relative w-full mb-2 max-w-[190px]"
                  style={{ transform: "scale(-1, 1)" }}
                >
                  <DynamicNFT
                    bumpkinParts={{
                      body: "Beige Farmer Potion",
                      hair: "Blacksmith Hair",
                      pants: "Farmer Overalls",
                      shirt: "Yellow Farmer Shirt",
                      tool: "Hammer",
                      background: "Farm Background",
                      shoes: "Black Farmer Boots",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Section */}
      <div className="flex flex-col grow space-y-1">
        {/* Potions */}
        <div
          className={classNames(
            "flex flex-col justify-end grow transition-all scale-y-1 origin-bottom ease-in duration-300",
            {
              "scale-y-0": isEndScreen,
            }
          )}
        >
          <h2 className="mb-1">Potions</h2>
          <InnerPanel>
            <div className="p-1 flex flex-col space-y-1 pb-2">
              {selectedPotion && (
                <>
                  <span className="text-[18px]">{selectedPotion.name}</span>

                  <span className="text-xxs sm:mt-1 whitespace-pre-line">
                    {selectedPotion.description}
                  </span>
                </>
              )}
            </div>
            <Button
              className="h-9"
              disabled={guessSpot < 0}
              onClick={onPotionButtonClick}
            >
              {currentGuess[guessSpot] ? "Remove from mix" : "Add to mix"}
            </Button>
          </InnerPanel>
          <div className="flex flex-wrap justify-center gap-2 mt-3 mb-2">
            {Object.values(POTIONS).map((potion) => (
              <div
                key={potion.name}
                className={classNames("relative cursor-pointer", {
                  "img-highlight": potion.name === selectedPotion?.name,
                })}
                onClick={() =>
                  dispatch({ type: "UPDATE_POTION", potion: potion.name })
                }
              >
                <img src={shadow} alt="" className="absolute -bottom-1 w-8" />
                <img src={potion.image} alt="" className="w-8 relative" />
              </div>
            ))}
          </div>
        </div>
        {isEndScreen && (
          <Button onClick={() => dispatch({ type: "NEW_GAME" })}>
            Play again
          </Button>
        )}
      </div>
    </>
  );
};
