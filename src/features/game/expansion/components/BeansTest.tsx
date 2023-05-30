import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  pixelRoomBorderStyle,
  pixelTableBorderStyle,
} from "features/game/lib/style";
import orangeBottle from "assets/decorations/orange_bottle.webp";
import { SUNNYSIDE } from "assets/sunnyside";
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
} from "./potions/lib/types";
import { SpeechBubble } from "./potions/SpeechBubble";
import {
  calculateScore,
  generatePotionCombination,
  getFeedbackText,
} from "./potions/lib/helpers";
import { BASIC_POTIONS, SPECIAL_POTIONS } from "./potions/lib/potions";
import { IntroPage } from "./potions/Intro";
import { Box } from "./potions/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";

const INNER_CANVAS_WIDTH = 14;

export const Beans = () => {
  const expandButtonRef = useRef<HTMLDivElement>(null);
  const expandedDivRef = useRef<HTMLDivElement>(null);
  const [selectedPotion, setSelectedPotion] = useState<Potion>(
    BASIC_POTIONS[0]
  );
  const [game, setGame] = useState<{ turns: Turn[] }>({ turns: [] });
  const [currentGuess, setCurrentGuess] = useState<(PotionName | undefined)[]>(
    []
  );
  const [guessSpot, setGuessSpot] = useState<number>(0);
  const [page, setPage] = useState<"intro" | "game" | "complete">("game");
  const [combination, setCombination] = useState<Combination>(() =>
    generatePotionCombination()
  );
  const [showSpecialPotionModal, setShowSpecialPotionModal] = useState(false);
  const [selectedSpecialPotion, setSelectedSpecialPotion] =
    useState<Potion | null>(null);

  const [score, setScore] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>(
    "Welcome, apprentice! Select your potions and unveil the secrets of the plants!"
  );

  useEffect(() => {
    // Have the bottle image spin once on load and then call handleExpand
    setTimeout(() => {
      handleExpand();
    }, 1000);
  }, []);

  useEffect(() => {
    if (game.turns.length === 0) return;

    const score = calculateScore(game.turns[game.turns.length - 1].feedback);

    console.log({ score });

    setScore(score);
    setFeedbackText(getFeedbackText(score));
  }, [game.turns]);

  const handleExpand = () => {
    if (!expandButtonRef.current || !expandedDivRef.current) return;

    const expandButton = expandButtonRef.current;
    const expandedDiv = expandedDivRef.current;
    expandedDiv.style.display = "block";

    const { top, left, width, height } = expandButton.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    expandedDiv.style.transformOrigin = `${x}px ${y}px`;
    expandedDiv.style.transform = "translate(-50%, -50%) scale(1)";
  };

  const handleCollapse = () => {
    if (!expandedDivRef.current) return;

    const expandedDiv = expandedDivRef.current;
    expandedDiv.style.transform = "translate(-50%, -50%) scale(0)";
    setTimeout(() => {
      expandedDiv.style.display = "none";
    }, 500);
  };

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

  const handleSpecialPotionModalClose = () => {
    setShowSpecialPotionModal(false);
    setSelectedSpecialPotion(null);
  };

  const handleSpecialPotionModalOpen = (potion: Potion) => {
    setSelectedSpecialPotion(potion);
    setShowSpecialPotionModal(true);
  };

  return (
    <>
      {createPortal(
        <>
          <div id="expand">
            <div
              id="expanding-base"
              ref={expandButtonRef}
              onClick={handleExpand}
            >
              <img
                src={orangeBottle}
                alt="bottle"
                style={{ width: `${PIXEL_SCALE * 10}px` }}
              />
            </div>
            <div
              id="expanding-container"
              className="bg-brown-600 text-white"
              ref={expandedDivRef}
              style={{
                ...pixelRoomBorderStyle,
                padding: `${PIXEL_SCALE * 1}px`,
              }}
            >
              <div id="cover" />
              {/* Potion Room */}
              <div className="p-1 flex flex-col relative h-full overflow-auto scrollable">
                {/* Header */}
                <div className="flex mb-3 w-full justify-center">
                  <div
                    style={{
                      width: `${PIXEL_SCALE * 11}px`,
                      height: `${PIXEL_SCALE * 11}px`,
                    }}
                  />
                  <h1 className="grow text-center text-lg">Potion Room</h1>
                  <img
                    src={SUNNYSIDE.icons.close}
                    className="cursor-pointer"
                    onClick={handleCollapse}
                    style={{
                      width: `${PIXEL_SCALE * 11}px`,
                    }}
                  />
                </div>
                <div className="flex flex-col grow">
                  {page === "intro" && (
                    <IntroPage onComplete={() => setPage("game")} />
                  )}
                  {page === "game" && (
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
                                    <div
                                      className="flex items-center"
                                      key={rowIndex}
                                    >
                                      {Array.from(Array(4)).map(
                                        (_, columnIndex) => {
                                          const guess =
                                            game?.turns?.[rowIndex]?.guess[
                                              columnIndex
                                            ];
                                          const feedback =
                                            game?.turns?.[rowIndex]?.feedback[
                                              columnIndex
                                            ];

                                          return (
                                            <Box
                                              key={`${rowIndex}-${columnIndex}`}
                                              guess={guess}
                                              feedback={feedback}
                                            />
                                          );
                                        }
                                      )}
                                    </div>
                                  ))}
                                  <div className="flex flex-col items-center border-t-2 border-coolGray-500">
                                    <div className="flex my-2">
                                      {new Array(4)
                                        .fill(null)
                                        .map((_, index) => (
                                          <div
                                            className="relative"
                                            key={`select-${index}`}
                                            onClick={() => setGuessSpot(index)}
                                          >
                                            <Box guess={currentGuess[index]} />
                                            {index === guessSpot && (
                                              <SelectBox />
                                            )}
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
                      <div className="flex flex-col grow">
                        {/* Potions */}
                        <div className="flex flex-col justify-end grow">
                          <h2 className="mb-1">Potions</h2>
                          <InnerPanel>
                            <div className="p-1 flex flex-col space-y-1">
                              <div className="flex space-x-1 mb-1">
                                {[...BASIC_POTIONS, ...SPECIAL_POTIONS].map(
                                  (potion) => {
                                    return (
                                      <img
                                        onClick={() =>
                                          setSelectedPotion(potion)
                                        }
                                        key={potion.name}
                                        src={potion.image}
                                        style={{
                                          width: `${PIXEL_SCALE * 10}px`,
                                        }}
                                        className={classNames(
                                          "cursor-pointer",
                                          {
                                            "img-highlight":
                                              potion.name ===
                                              selectedPotion?.name,
                                          }
                                        )}
                                        alt={`${potion.name} Potion`}
                                      />
                                    );
                                  }
                                )}
                              </div>
                              {selectedPotion && (
                                <>
                                  <span className="text-[18px]">
                                    {selectedPotion.name}
                                  </span>

                                  <span className="text-xxs sm:mt-1 whitespace-pre-line sm:text-center">
                                    {selectedPotion.description}
                                  </span>

                                  <div className="border-t border-white w-full my-2 pt-2 flex justify-between gap-x-3 gap-y-2 flex-wrap sm:flex-col sm:items-center sm:flex-nowrap">
                                    {getKeys(selectedPotion.ingredients).map(
                                      (item, index) => {
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
                                      }
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                            <Button
                              className="h-9"
                              onClick={() =>
                                handleGuessChange(
                                  guessSpot,
                                  selectedPotion.name
                                )
                              }
                            >
                              Add to mix
                            </Button>
                          </InnerPanel>
                        </div>
                      </div>
                    </>
                  )}
                  {page === "complete" && (
                    <div>
                      <Button onClick={() => setPage("intro")} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
};

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
