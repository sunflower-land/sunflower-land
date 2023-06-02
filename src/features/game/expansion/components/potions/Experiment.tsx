import React, { useEffect, useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelTableBorderStyle } from "features/game/lib/style";
import tableTop from "assets/ui/table_top.webp";
import plant from "assets/decorations/planter_box.webp";
import selectBoxBL from "assets/ui/select/selectbox_bl.png";
import selectBoxBR from "assets/ui/select/selectbox_br.png";
import selectBoxTL from "assets/ui/select/selectbox_tl.png";
import selectBoxTR from "assets/ui/select/selectbox_tr.png";
import { InnerPanel } from "components/ui/Panel";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { Button } from "components/ui/Button";
import { ResizableBar } from "components/ui/ProgressBar";
import {
  Combination,
  GuessFeedback,
  Potion,
  PotionName,
  Turn,
} from "./lib/types";
import { SpeechBubble } from "./SpeechBubble";
import {
  calculateScore,
  generatePotionCombination,
  getFeedbackText,
} from "./lib/helpers";
import { POTIONS } from "./lib/potions";
import { Box } from "./Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";

const INNER_CANVAS_WIDTH = 14;

const SelectBox = () => {
  return (
    <>
      <img
        className="absolute pointer-events-none"
        src={selectBoxBL}
        style={{
          top: `${PIXEL_SCALE * INNER_CANVAS_WIDTH - 8}px`,
          left: 0,
          width: `${PIXEL_SCALE * 6}px`,
        }}
      />
      <img
        className="absolute pointer-events-none"
        src={selectBoxBR}
        style={{
          top: `${PIXEL_SCALE * INNER_CANVAS_WIDTH - 8}px`,
          left: `${PIXEL_SCALE * INNER_CANVAS_WIDTH - 8}px`,
          width: `${PIXEL_SCALE * 6}px`,
        }}
      />
      <img
        className="absolute pointer-events-none"
        src={selectBoxTL}
        style={{
          top: 0,
          left: 0,
          width: `${PIXEL_SCALE * 6}px`,
        }}
      />
      <img
        className="absolute pointer-events-none"
        src={selectBoxTR}
        style={{
          top: 0,
          left: `${PIXEL_SCALE * INNER_CANVAS_WIDTH - 8}px`,
          width: `${PIXEL_SCALE * 6}px`,
        }}
      />
    </>
  );
};

interface Props {
  score: number;
  onScoreChange: (score: number) => void;
  onComplete: () => void;
}

const initialiseGuessGrid = (rows: number) => {
  const guessGrid: Turn[] = [];

  for (let i = 0; i < rows; i++) {
    guessGrid.push({ guess: [null, null, null, null] });
  }

  return guessGrid;
};

export const Experiment: React.FC<Props> = ({
  score,
  onScoreChange,
  onComplete,
}) => {
  const [selectedPotion, setSelectedPotion] = useState<Potion>(POTIONS[0]);
  const [guesses, setGuesses] = useState<Turn[]>(initialiseGuessGrid(3));
  const [currentGuess, setCurrentGuess] = useState<(PotionName | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [guessRow, setGuessRow] = useState<number>(guesses.length - 1);
  const [guessSpot, setGuessSpot] = useState<number>(0);
  const [combination, setCombination] = useState<Combination>(
    generatePotionCombination()
  );
  const [feedbackText, setFeedbackText] = useState<string>(
    "Select your potions and unveil the secrets of the plants!"
  );
  const [showConfirmButton, setConfirmButton] = useState<boolean>(false);

  useEffect(() => {
    if (score === 100 || guessRow < 0) {
      console.log("Game Over: ", score);
      onComplete();
    }
  }, [guessRow, score]);

  useEffect(() => {
    if (selectedPotion.name === "Miracle Mix") {
      setConfirmButton(true);
      setFeedbackText("Are you sure you want to risk it all?");
      return;
    }

    if (selectedPotion.name === "Golden Syrup") {
      setConfirmButton(true);
      setFeedbackText(
        "This will end the experiment. You plant will thrive! Are you sure?"
      );
      return;
    }

    setConfirmButton(false);
    setFeedbackText(
      "Select your potions and unveil the secrets of the plants!"
    );
  }, [selectedPotion]);

  const handleGuessChange = (index: number, value: PotionName) => {
    setCurrentGuess((prevGuess) => {
      const newGuess = [...prevGuess];
      newGuess[index] = value;

      return newGuess;
    });

    if (guessSpot < 3) {
      setGuessSpot((prevGuessSpot) => prevGuessSpot + 1);
    }
  };

  const handleConfirmGuess = () => {
    // Add the current guess to the game state
    const feedback = getTurnFeedback();

    console.log("Your Guess: ", currentGuess);
    console.log("Your Score: ", calculateScore(feedback));

    const newTurn: Turn = {
      guess: currentGuess as PotionName[],
      feedback,
    };

    const score = calculateScore(feedback);

    onScoreChange(score);
    setFeedbackText(getFeedbackText(score));

    setGuesses((prevGuesses) => {
      const copy = [...prevGuesses];
      copy[guessRow] = newTurn;

      return copy;
    });

    setGuessRow((prevGuessRow) => prevGuessRow - 1);

    // Clear the current guess
    setCurrentGuess([]);
    setGuessSpot(0);
  };

  const getTurnFeedback = () => {
    const { code, bomb } = combination;

    return currentGuess.map((guess, index) => {
      if (guess === bomb) return "bombed";

      if (guess === code[index]) {
        return "correct";
      }

      if (code.includes(guess as PotionName)) {
        return "almost";
      }

      return "incorrect";
    }) as GuessFeedback[];
  };

  const getAddButtonText = () => {
    if (showConfirmButton) return "Yes, let's do it!";

    if (selectedPotion.name === "Miracle Mix") {
      return "Risk it all!";
    }

    if (selectedPotion.name === "Golden Syrup") {
      return "Let's see that plant thrive!";
    }

    return "Add to mix";
  };

  const handleSelectPotion = (potion: Potion) => {
    setSelectedPotion(potion);
    handleGuessChange(guessSpot, potion.name);
  };

  const handleConfirm = () => {
    if (selectedPotion.name === "Miracle Mix") {
      // 50/50 chance of success
      const success = Math.random() > 0.5;
      // if success, set score to 100
      // else set score to 0
      onScoreChange(success ? 100 : 0);
      setConfirmButton(false);
      console.log("Game Over: ", success ? 100 : 0);
      onComplete();
    }
  };

  return (
    <>
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
                  {guesses.map(({ guess, feedback }, rowIndex) => (
                    <div className="flex items-center mb-2" key={rowIndex}>
                      {guess.map((potionName, columnIndex) => {
                        if (rowIndex === guessRow) {
                          return (
                            <div
                              className="relative"
                              key={`select-${columnIndex}`}
                              onClick={() => setGuessSpot(columnIndex)}
                            >
                              <Box potionName={currentGuess[columnIndex]} />
                              {columnIndex === guessSpot && <SelectBox />}
                            </div>
                          );
                        }

                        return (
                          <Box
                            key={`${rowIndex}-${columnIndex}`}
                            potionName={potionName}
                            feedback={feedback?.[columnIndex]}
                          />
                        );
                      })}
                    </div>
                  ))}
                  <Button
                    className="mt-2"
                    disabled={currentGuess.some((potion) => potion === null)}
                    onClick={handleConfirmGuess}
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
      {/* Bottom Section */}
      <div className="flex flex-col grow space-y-1">
        {/* Potions */}
        <div className="flex flex-col justify-end grow">
          <h2 className="mb-1">Potions</h2>
          <InnerPanel>
            <div className="p-1 flex flex-col space-y-1">
              {selectedPotion && (
                <>
                  <span className="text-[18px]">{selectedPotion.name}</span>

                  <span className="text-xxs sm:mt-1 whitespace-pre-line">
                    {selectedPotion.description}
                  </span>

                  <div className="border-t border-white w-full my-2 pt-2 flex justify-between gap-x-3 gap-y-2 flex-wrap">
                    {getKeys(selectedPotion.ingredients).map((item, index) => {
                      return (
                        <div
                          key={`${item}-${index}`}
                          className="flex space-x-1"
                        >
                          <img
                            src={ITEM_DETAILS[item].image}
                            className="w-3 "
                          />
                          <span className="ml-1 text-xxs">{`${selectedPotion.ingredients[item]}/100`}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            {/* <Button
              className="h-9"
              onClick={showConfirmButton ? handleConfirm : handleAddToMix}
            >
              {getAddButtonText()}
            </Button> */}
          </InnerPanel>
          <div className="flex flex-wrap mt-2">
            {POTIONS.map((potion) => (
              <Box
                key={potion.name}
                potionName={potion.name}
                // isSelected={selectedPotion.name === potion.name}
                onClick={() => handleSelectPotion(potion)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

{
  /* <div className="flex space-x-1">
                {[...BASIC_POTIONS, ...SPECIAL_POTIONS].map((potion) => {
                  return (
                    <img
                      onClick={() => setSelectedPotion(potion)}
                      key={potion.name}
                      src={potion.image}
                      style={{
                        width: `${PIXEL_SCALE * 10}px`,
                      }}
                      className={classNames("cursor-pointer", {
                        "img-highlight": potion.name === selectedPotion?.name,
                      })}
                      alt={`${potion.name} Potion`}
                    />
                  );
                })}
              </div> */
}
