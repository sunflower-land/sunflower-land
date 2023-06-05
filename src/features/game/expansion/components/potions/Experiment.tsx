import React, { useEffect, useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelTableBorderStyle } from "features/game/lib/style";
import tableTop from "assets/ui/table_top.webp";
import plant from "assets/decorations/planter_box.webp";
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
import shadow from "assets/npcs/shadow.png";

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
  const [selectedPotion, setSelectedPotion] = useState<Potion | null>(null);
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

  useEffect(() => {
    if (score === 100 || guessRow < 0) {
      console.log("Game Over: ", score);
      onComplete();
    }
  }, [guessRow, score]);

  useEffect(() => {
    if (!selectedPotion) return;

    const potion = POTIONS.find(
      (potion) => potion.name === selectedPotion.name
    ) as Potion;

    setFeedbackText(potion.description);
  }, [selectedPotion]);

  const handleGuessChange = (index: number, value: PotionName) => {
    const newGuess = [...currentGuess];
    newGuess[index] = value;

    setCurrentGuess(newGuess);

    if (guessSpot <= 3) {
      const firstEmptySpot = newGuess.indexOf(null);

      console.log({ firstEmptySpot });

      setGuessSpot(firstEmptySpot);
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
    setSelectedPotion(null);
  };

  const getTurnFeedback = () => {
    const { code, bomb } = combination;

    return currentGuess.map((guess, index) => {
      if (guess === "Golden Syrup") return "correct";

      if (guess === bomb) return "bombed";

      if (guess === code[index]) return "correct";

      if (code.includes(guess as PotionName)) return "almost";

      return "incorrect";
    }) as GuessFeedback[];
  };

  const handleSelectPotion = (potion: Potion) => {
    setSelectedPotion(potion);
    handleGuessChange(guessSpot, potion.name);
  };

  const handleRemovePotion = (index: number) => {
    setCurrentGuess((prevGuess) => {
      const newGuess = [...prevGuess];
      newGuess[index] = null;

      return newGuess;
    });

    setGuessSpot(index);
    setSelectedPotion(null);
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
                              onClick={
                                currentGuess[columnIndex]
                                  ? () => handleRemovePotion(columnIndex)
                                  : () => setGuessSpot(columnIndex)
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
          <div className="flex flex-wrap gap-2 mt-2">
            {POTIONS.map((potion) => (
              // <Box
              //   key={potion.name}
              //   potionName={potion.name}
              //   // isSelected={selectedPotion.name === potion.name}
              //   onClick={() => handleSelectPotion(potion)}
              // />
              <div
                key={potion.name}
                className="relative"
                onClick={() => handleSelectPotion(potion)}
              >
                <img src={shadow} alt="" className="absolute -bottom-1 w-8" />
                <img src={potion.image} alt="" className="w-8 relative" />
              </div>
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
