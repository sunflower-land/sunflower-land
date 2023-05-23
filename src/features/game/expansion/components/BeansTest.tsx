import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  pixelDarkBorderStyle,
  pixelRoomBorderStyle,
  pixelTableBorderStyle,
  pixelSpeechBubbleBorderStyle,
} from "features/game/lib/style";
import orangeBottle from "assets/decorations/orange_bottle.webp";
import blueBottle from "assets/decorations/blue_bottle.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import tableTop from "assets/ui/table_top.webp";
import plant from "assets/decorations/planter_box.webp";
import selectBoxBL from "assets/ui/select/selectbox_bl.png";
import selectBoxBR from "assets/ui/select/selectbox_br.png";
import selectBoxTL from "assets/ui/select/selectbox_tl.png";
import selectBoxTR from "assets/ui/select/selectbox_tr.png";
import { InnerPanel } from "components/ui/Panel";
import { getKeys } from "features/game/types/craftables";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import classNames from "classnames";
import { InventoryItemName } from "features/game/types/game";
import speechBubbleBottom from "assets/ui/speech_bubble_bottom.webp";

type Potion = {
  name: PotionName;
  ingredients: Partial<Record<InventoryItemName, number>>;
  color: string;
  image: string;
};

type PotionName =
  | "Bloom Boost"
  | "Happy Hooch"
  | "Earth Essence"
  | "Flower Power"
  | "Organic Oasis";

const POTIONS: Potion[] = [
  {
    name: "Bloom Boost",
    ingredients: {
      Pumpkin: 10,
      Cabbage: 10,
      Iron: 10,
    },
    color: "red",
    image: orangeBottle,
  },
  {
    name: "Happy Hooch",
    ingredients: {
      Parsnip: 10,
      Radish: 10,
      Wood: 10,
    },
    color: "blue",
    image: blueBottle,
  },
  {
    name: "Earth Essence",
    ingredients: {
      Potato: 10,
      Stone: 10,
      Iron: 10,
    },
    color: "green",
    image: orangeBottle,
  },
  {
    name: "Flower Power",
    ingredients: {
      Sunflower: 10,
      Iron: 10,
    },
    color: "yellow",
    image: blueBottle,
  },
  {
    name: "Organic Oasis",
    ingredients: {
      Egg: 10,
      Kale: 10,
      Stone: 10,
    },
    color: "purple",
    image: blueBottle,
  },
];

const INNER_CANVAS_WIDTH = 14;

type GuessFeedback = "correct" | "almost" | "incorrect" | "bombed";

const FeedbackIcons: Record<GuessFeedback, string> = {
  correct: SUNNYSIDE.icons.happy,
  almost: SUNNYSIDE.icons.neutral,
  incorrect: SUNNYSIDE.icons.sad,
  bombed: SUNNYSIDE.icons.angry,
};

const Box: React.FC<{ guess?: PotionName; feedback?: GuessFeedback }> = ({
  guess,
  feedback,
}) => {
  return (
    <div className="relative">
      {feedback && (
        <img
          src={FeedbackIcons[feedback]}
          alt={feedback}
          style={{
            position: "absolute",
            width: `${PIXEL_SCALE * 7}px`,
            top: "-2px",
            right: "-2px",
          }}
        />
      )}
      <div
        className="bg-brown-600 cursor-pointer m-1"
        style={{
          width: `${PIXEL_SCALE * INNER_CANVAS_WIDTH}px`,
          height: `${PIXEL_SCALE * INNER_CANVAS_WIDTH}px`,
          ...pixelDarkBorderStyle,
        }}
      >
        {guess && (
          <img
            src={POTIONS.find((potion) => potion.name === guess)?.image}
            className="object-contain w-full h-full"
          />
        )}
      </div>
    </div>
  );
};

const SpeedBubble: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div
      className="relative flex items-center justify-start max-w-[100px]"
      style={{ ...pixelSpeechBubbleBorderStyle }}
    >
      <span className="text-xxs font-speech text-shadow-none text-black">
        {text}
      </span>
      <img
        src={speechBubbleBottom}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 4}px`,
          bottom: `-${PIXEL_SCALE * 4.5}px`,
          left: `${PIXEL_SCALE * 8}px`,
        }}
      />
    </div>
  );
};

// - You can see how many attempts you have
// - You can see previous attempts and the success
// - You can see the happiness of the plant
// - You can see what each potion does + add it
// - You can confirm your select of potions before mixing
// - The Potion Master guides a player

interface Turn {
  guess: PotionName[];
  feedback: GuessFeedback[];
}

export const Beans = () => {
  const expandButtonRef = useRef<HTMLDivElement>(null);
  const expandedDivRef = useRef<HTMLDivElement>(null);
  const [selectedPotion, setSelectedPotion] = useState<Potion | null>(null);
  const [game, setGame] = useState<{ turns: Turn[] }>({ turns: [] });
  const [currentGuess, setCurrentGuess] = useState<(PotionName | undefined)[]>(
    []
  );
  const [guessSpot, setGuessSpot] = useState<number>(0);
  const [page, setPage] = useState<"intro" | "game" | "complete">("intro");

  useEffect(() => {
    // Have the bottle image spin once on load and then call handleExpand
    setTimeout(() => {
      handleExpand();
    }, 1000);
  }, []);

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
    const newTurn: Turn = {
      guess: currentGuess as PotionName[],
      feedback: ["correct", "incorrect", "almost", "bombed"],
    };
    setGame((prevGame) => ({ turns: [newTurn, ...prevGame.turns] }));

    // Clear the current guess
    setCurrentGuess([]);
    setGuessSpot(0);
  };

  return (
    <>
      {createPortal(
        <div id="expand">
          <div id="expanding-base" ref={expandButtonRef} onClick={handleExpand}>
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
            <div className="p-1 flex flex-col relative h-full">
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
                  <div>
                    <div className="h-20"></div>
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
                              </div>
                            </div>
                          </div>
                          {/* Turn */}
                        </div>
                      </div>
                      {/* Right Side */}
                      <div className="flex flex-col items-center w-full h-full">
                        <div className="flex flex-col justify-between">
                          {/* Plant */}
                          <div className="flex justify-center mb-4">
                            <img
                              src={plant}
                              alt="Plant"
                              className="mb-2"
                              style={{ width: `${PIXEL_SCALE * 28}px` }}
                            />
                          </div>
                          <div>
                            <SpeedBubble text="Good choice!" />
                            <div
                              className="relative mt-2"
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

                    {/* Turn Section */}
                    <div className="flex w-full items-end mt-2 min-h-[140px]">
                      <div className="flex flex-col items-center w-3/5">
                        <div className="flex my-2">
                          {new Array(4).fill(null).map((_, index) => (
                            <div
                              className="relative"
                              key={`select-${index}`}
                              onClick={() => setGuessSpot(index)}
                            >
                              <Box guess={currentGuess[index]} />
                              {index === guessSpot && (
                                <>
                                  <img
                                    className="absolute pointer-events-none"
                                    src={selectBoxBL}
                                    style={{
                                      top: `${
                                        PIXEL_SCALE * INNER_CANVAS_WIDTH - 4
                                      }px`,
                                      left: `${PIXEL_SCALE * 0}px`,
                                      width: `${PIXEL_SCALE * 4}px`,
                                    }}
                                  />
                                  <img
                                    className="absolute pointer-events-none"
                                    src={selectBoxBR}
                                    style={{
                                      top: `${
                                        PIXEL_SCALE * INNER_CANVAS_WIDTH - 4
                                      }px`,
                                      left: `${
                                        PIXEL_SCALE * INNER_CANVAS_WIDTH - 4
                                      }px`,
                                      width: `${PIXEL_SCALE * 4}px`,
                                    }}
                                  />
                                  <img
                                    className="absolute pointer-events-none"
                                    src={selectBoxTL}
                                    style={{
                                      top: `${PIXEL_SCALE * 1}px`,
                                      left: `${PIXEL_SCALE * 0}px`,
                                      width: `${PIXEL_SCALE * 4}px`,
                                    }}
                                  />
                                  <img
                                    className="absolute pointer-events-none"
                                    src={selectBoxTR}
                                    style={{
                                      top: `${PIXEL_SCALE * 1}px`,
                                      left: `${
                                        PIXEL_SCALE * INNER_CANVAS_WIDTH - 4
                                      }px`,
                                      width: `${PIXEL_SCALE * 4}px`,
                                    }}
                                  />
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                        <Button
                          disabled={currentGuess.length < 4}
                          onClick={handleConfirmGuess}
                        >
                          Mix
                        </Button>
                      </div>
                      {selectedPotion && (
                        <div className="flex flex-col items-center justify-end grow h-full ml-1 mt-2 p-2 pb-0">
                          <span className="text-xxs text-center mb-2 w-min whitespace-nowrap">
                            {selectedPotion.name}
                          </span>
                          {/* Ingredients */}
                          <div className="space-y-1 mb-2">
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
                          <Button
                            onClick={() =>
                              handleGuessChange(guessSpot, selectedPotion.name)
                            }
                          >
                            Buy
                          </Button>
                        </div>
                      )}
                    </div>
                    {/* Bottom Section */}
                    <div className="flex flex-col justify-end grow">
                      <h2 className="mb-1">Available Potions</h2>
                      <InnerPanel className="flex p-2 space-x-2">
                        {POTIONS.map((potion) => {
                          return (
                            <img
                              onClick={() => setSelectedPotion(potion)}
                              key={potion.name}
                              src={potion.image}
                              style={{
                                width: `${PIXEL_SCALE * 10}px`,
                              }}
                              className={classNames("cursor-pointer", {
                                "img-highlight":
                                  potion.name === selectedPotion?.name,
                              })}
                              alt={`${potion.name} Potion`}
                            />
                          );
                        })}
                      </InnerPanel>
                    </div>
                  </div>
                )}
                {page === "complete" && (
                  <div>
                    <Button onClick={() => setPage("intro")} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

interface IntroProps {
  onComplete: () => void;
}

const IntroPage: React.FC<IntroProps> = ({ onComplete }) => {
  return (
    <>
      <div className="p-2 pt-0 flex flex-col h-full">
        <div className="text-[18px] leading-5 space-y-2 mb-3">
          <div className="relative mt-2 float-left w-1/3">
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
          <p>{`Welcome to the Potion Room, my curious apprentice!`}</p>
          <p>
            {`I am Mad Scientist Bumpkin, here to assist you on this magical quest into the world of botanic sorcery. Get ready to uncover the secrets of Sunflower Land!`}
          </p>
          <p>
            {`Your mission: decipher the right combination of potions within the enchanted grid.`}
          </p>
          <p>
            {`Remember, the more correct potions you select, the happier the plant will be, increasing your chances of rare drops!`}
          </p>
        </div>
        <InnerPanel className="text-xxs space-y-1 p-1 mt-1">
          <p className="mb-2">{`Pay attention to the feedback icons:`}</p>
          <div className="flex items-center space-x-1">
            <img
              src={FeedbackIcons["correct"]}
              style={{
                width: `${PIXEL_SCALE * 7}px`,
                height: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <span>A perfect potion in the perfect position</span>
          </div>
          <div className="flex items-center space-x-1">
            <img
              src={FeedbackIcons["almost"]}
              style={{
                width: `${PIXEL_SCALE * 7}px`,
                height: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <span>Correct potion but wrong position</span>
          </div>
          <div className="flex items-center space-x-1">
            <img
              src={FeedbackIcons["incorrect"]}
              style={{
                width: `${PIXEL_SCALE * 7}px`,
                height: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <span>Oops, wrong potion</span>
          </div>
          <div className="flex items-center space-x-1">
            <img
              src={FeedbackIcons["bombed"]}
              style={{
                width: `${PIXEL_SCALE * 7}px`,
                height: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <span>{`Beware the "chaos" potion, it shakes things up!`}</span>
          </div>
        </InnerPanel>
      </div>
      <Button onClick={onComplete}>Cool</Button>
    </>
  );
};
