import React, { useContext } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelTableBorderStyle } from "features/game/lib/style";
import tableTop from "assets/ui/table_top.webp";
import plant from "assets/decorations/planter_box.webp";
import { InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { ResizableBar } from "components/ui/ProgressBar";
import { SpeechBubble } from "./SpeechBubble";
import { POTIONS } from "./lib/potions";
import { Box } from "./Box";
import shadow from "assets/npcs/shadow.png";
import classNames from "classnames";
import { Context } from "features/game/GameProvider";
import { PotionName } from "features/game/types/game";
import { Potion } from "./lib/types";
import { MixingPotion } from "./MixingPotion";
import { useActor, useInterpret } from "@xstate/react";
import { potionHouseMachine } from "./lib/potionHouseMachine";

interface Props {
  onClose: () => void;
}

const EMPTY_ATTEMPT = new Array<{ potion: null; status: undefined }>(4).fill({
  potion: null,
  status: undefined,
});

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
  | { type: "NEW_GAME" }
  | { type: "UPDATE_POTION"; potion: PotionName };

const resetGame = (isNewGame: boolean): PotionState => ({
  guessSpot: 0,
  selectedPotion: Object.values(POTIONS)[0],
  currentGuess: [null, null, null, null],
  isNewGame,
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
  const potionService = useInterpret(potionHouseMachine, {
    context: {
      gameService,
    },
  });
  const [potionState] = useActor(potionService);

  const { currentGuess, guessSpot, selectedPotion } = potionState.context;

  const isEndScreen = potionState.matches("endScreen");
  const isMixing =
    potionState.matches("playing.startMixing") ||
    potionState.matches("playing.loopMixing");

  // const [desiredAnimation, setDesiredAnimation] =
  //   useState<DesiredAnimation>("static");
  // const [feedbackText, setFeedbackText] = useState<string>(
  //   "Select your potions and unveil the secrets of the plants!"
  // );

  // const potionHouse = gameService.state.context.state.potionHouse;
  // const previousAttempts = potionHouse?.game.attempts ?? [];
  // const lastAttempt = previousAttempts[previousAttempts.length - 1] ?? [];
  // const isFinished = potionHouse?.game.status === "finished";

  // const [potionState, dispatch] = useReducer(
  //   gameHandler,
  //   resetGame(isFinished)
  // );
  // const { isNewGame, currentGuess, guessSpot, selectedPotion } = potionState;

  // const isEndScreen = isFinished && !isNewGame;
  // const isGuessing = lastAttempt.some((potion) => potion.status === "pending");
  // const isBombed = lastAttempt.some((potion) => potion.status === "bomb");

  // const attempts = isNewGame
  //   ? new Array<{ potion: null; status: undefined }[]>(3).fill(EMPTY_ATTEMPT)
  //   : previousAttempts.concat(new Array(3).fill(EMPTY_ATTEMPT)).slice(0, 3);
  // const guessRow = isNewGame ? 0 : potionHouse?.game.attempts.length ?? 0;
  // const score = isNewGame ? 0 : calculateScore(lastAttempt);

  // useEffect(() => {
  //   if (isGuessing) {
  //     setDesiredAnimation("mixing");
  //     return;
  //   }

  //   if (desiredAnimation === "mixing") {
  //     setFeedbackText(getFeedbackText(score));
  //     score > 0 ? setDesiredAnimation("success") : setDesiredAnimation("boom");
  //   }
  // }, [isGuessing]);

  // const onPotionButtonClick = () => {
  //   // REMOVE
  //   if (currentGuess[guessSpot]) {
  //     dispatch({ type: "REMOVE_GUESS", guessSpot: guessSpot });
  //     return;
  //   }

  //   dispatch({
  //     type: "ADD_GUESS",
  //     guessSpot: guessSpot,
  //     potion: selectedPotion.name,
  //   });
  // };

  // const onSubmit = () => {
  //   console.log("SUBMIT");
  //   dispatch({ type: "RESET_GAME" });

  //   gameService.send("potion.mixed", {
  //     attemptNumber: guessRow + 1,
  //     potions: currentGuess,
  //   });
  //   gameService.send("SAVE");
  // };

  return (
    <>
      {isEndScreen && (
        <div>
          {potionHouse?.game.reward
            ? `Congratulations! You won ${[potionHouse?.game.reward]} points!`
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
                        percentage={isBombed ? 100 : score}
                        type={isBombed ? "error" : "health"}
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
              <div className="flex flex-col items-center sm:max-w-[70%]">
                <div className="min-h-[80px]">
                  {!isGuessing && (
                    <SpeechBubble text={feedbackText} className="w-4/5" />
                  )}
                </div>
                <MixingPotion desiredAnimation={desiredAnimation} />
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
