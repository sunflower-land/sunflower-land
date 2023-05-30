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
import classNames from "classnames";
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
import { BASIC_POTIONS, SPECIAL_POTIONS } from "./lib/potions";
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

export const Experiment: React.FC<Props> = ({
  score,
  onScoreChange,
  onComplete,
}) => {
  const [selectedPotion, setSelectedPotion] = useState<Potion>(
    BASIC_POTIONS[0]
  );
  const [game, setGame] = useState<{ turns: Turn[] }>({ turns: [] });
  const [currentGuess, setCurrentGuess] = useState<(PotionName | undefined)[]>(
    []
  );
  const [guessSpot, setGuessSpot] = useState<number>(0);
  const [combination, setCombination] = useState<Combination>(() =>
    generatePotionCombination()
  );
  const [feedbackText, setFeedbackText] = useState<string>(
    "Welcome, apprentice! Select your potions and unveil the secrets of the plants!"
  );
  const [showConfirmButton, setConfirmButton] = useState<boolean>(false);

  useEffect(() => {
    if (game.turns.length === 0) return;

    const score = calculateScore(game.turns[game.turns.length - 1].feedback);

    onScoreChange(score);
    setFeedbackText(getFeedbackText(score));
    if (game.turns.length === 5 || score === 100) {
      onComplete();
    }
  }, [game.turns.length]);

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
    console.log({ combination });

    console.log("guess", currentGuess);

    console.log("score", calculateScore(feedback));

    const newTurn: Turn = {
      guess: currentGuess as PotionName[],
      feedback,
    };
    setGame((prevGame) => ({ turns: [...prevGame.turns, newTurn] }));

    if (feedback.includes("bombed")) {
      console.log("bombed");
      setCombination(generatePotionCombination());
    }

    console.log("feedback", feedback);

    // Clear the current guess
    setCurrentGuess([]);
    setGuessSpot(0);
  };

  const getTurnFeedback = () => {
    const { code, bomb } = combination;

    console.log("turn feedback");
    console.log("code", code);
    console.log("bomb", bomb);

    if (currentGuess.includes(bomb)) {
      return ["bombed", "bombed", "bombed", "bombed"] as GuessFeedback[];
    }

    return currentGuess.map((guess, index) => {
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
    if (selectedPotion.name === "Miracle Mix") return "Risk it all!";

    if (selectedPotion.name === "Golden Syrup")
      return "Let's see that plant thrive!";

    return "Add to mix";
  };

  const handleAddToMix = () => {
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

    handleGuessChange(guessSpot, selectedPotion.name);
  };

  const handleConfirm = () => {
    if (selectedPotion.name === "Miracle Mix") {
      // 50/50 chance of success
      const success = Math.random() > 0.5;
      // if success, set score to 100
      // else set score to 0
      onScoreChange(success ? 100 : 0);
      setConfirmButton(false);
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
            <div className="w-full flex relative">
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
                  {Array.from(Array(5)).map((_, rowIndex) => (
                    <div className="flex items-center" key={rowIndex}>
                      {Array.from(Array(4)).map((_, columnIndex) => {
                        const guess =
                          game?.turns?.[rowIndex]?.guess[columnIndex];
                        const feedback =
                          game?.turns?.[rowIndex]?.feedback[columnIndex];

                        return (
                          <Box
                            key={`${rowIndex}-${columnIndex}`}
                            guess={guess}
                            feedback={feedback}
                          />
                        );
                      })}
                    </div>
                  ))}
                  <div className="flex flex-col items-center">
                    <div className="flex my-2">
                      {new Array(4).fill(null).map((_, index) => (
                        <div
                          className="relative"
                          key={`select-${index}`}
                          onClick={() => setGuessSpot(index)}
                        >
                          <Box guess={currentGuess[index]} />
                          {index === guessSpot && <SelectBox />}
                        </div>
                      ))}
                    </div>
                    <Button
                      disabled={currentGuess.length < 4}
                      onClick={handleConfirmGuess}
                    >
                      Mix potion
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side */}
        <div className="flex flex-col items-center w-full h-full">
          <div className="flex flex-col justify-between">
            {/* Plant */}
            <div className="flex items-center mb-2 flex-col">
              <img
                src={plant}
                alt="Plant"
                className="mb-2"
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
            <div className="ml-1">
              <SpeechBubble text={feedbackText} />
              <div
                className="relative mt-2 max-w-[190px]"
                style={{ transform: "scale(-1, 1)" }}
              >
                <DynamicNFT
                  bumpkinParts={{
                    body: "Beige Farmer Potion",
                    hair: "Rancher Hair",
                    pants: "Farmer Overalls",
                    shirt: "Red Farmer Shirt",
                    tool: "Farmer Pitchfork",
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
      <div className="flex flex-col grow mb-1">
        {/* Potions */}
        <div className="flex flex-col justify-end grow">
          <h2 className="mb-1">Potions</h2>
          <InnerPanel>
            <div className="p-1 flex flex-col space-y-1">
              <div className="flex space-x-1 mb-1">
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
              </div>
              {selectedPotion && (
                <>
                  <span className="text-[18px]">{selectedPotion.name}</span>

                  <span className="text-xxs sm:mt-1 whitespace-pre-line sm:text-center">
                    {selectedPotion.description}
                  </span>

                  <div className="border-t border-white w-full my-2 pt-2 flex justify-between gap-x-3 gap-y-2 flex-wrap sm:flex-col sm:items-center sm:flex-nowrap">
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
            <Button
              className="h-9"
              onClick={showConfirmButton ? handleConfirm : handleAddToMix}
            >
              {getAddButtonText()}
            </Button>
          </InnerPanel>
        </div>
      </div>
    </>
  );
};
