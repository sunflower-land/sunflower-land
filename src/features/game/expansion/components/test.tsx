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
  | "Harmony Hooch"
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
    name: "Harmony Hooch",
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

const Box: React.FC<{ guess?: PotionName }> = ({ guess }) => {
  return (
    <div className="relative">
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
  feedback: string[];
}

export const Beans = () => {
  const expandButtonRef = useRef<HTMLDivElement>(null);
  const expandedDivRef = useRef<HTMLDivElement>(null);
  const [selectedPotion, setSelectedPotion] = useState<Potion | null>(null);
  const [game, setGame] = useState<{ turns: Turn[] }>({ turns: [] });
  const [currentGuess, setCurrentGuess] = useState<(PotionName | undefined)[]>(
    []
  );

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
  };

  const handleConfirmGuess = () => {
    // Add the current guess to the game state
    const newTurn: Turn = { guess: currentGuess as PotionName[], feedback: [] };
    setGame((prevGame) => ({ turns: [newTurn, ...prevGame.turns] }));

    // Clear the current guess
    setCurrentGuess([]);
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
            <div className="p-1 flex flex-col relative justify-between h-full">
              <div>
                {/* Header */}
                <div className="flex mb-2 w-full justify-center">
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
                <div className="flex">
                  {/* Left Side */}
                  <div className="flex">
                    <div className="flex flex-col items-center">
                      {/* Table */}
                      <div className="w-full relative">
                        <div
                          className="w-full"
                          style={{
                            ...pixelTableBorderStyle,
                          }}
                        >
                          <div
                            className="h-full w-full p-1"
                            style={{
                              backgroundImage: `url(${tableTop})`,
                              backgroundRepeat: "repeat",
                              backgroundSize: `${PIXEL_SCALE * 16}px`,
                            }}
                          >
                            {Array.from(Array(10)).map((_, rowIndex) => (
                              <div className="row flex" key={rowIndex}>
                                {Array.from(Array(4)).map((_, columnIndex) => (
                                  <div key={columnIndex}>
                                    <Box key={`${rowIndex}-${columnIndex}`} />
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* Turn */}
                      <div className="flex my-2">
                        {new Array(4).fill(null).map((_, index) => (
                          <div className="relative" key={`select-${index}`}>
                            <Box guess={currentGuess[index]} />
                            {index === 0 && (
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
                      <Button onClick={handleConfirmGuess}>Mix</Button>
                    </div>
                  </div>
                  {/* Right Side */}
                  <div className="flex flex-col items-center w-full h-full">
                    <div className="flex flex-col justify-between">
                      <div className="mb-1 flex justify-center">
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
                    {selectedPotion && (
                      <div className="w-full h-full ml-1 mt-2 p-2">
                        <p className="text-xs mb-2">{selectedPotion.name}</p>
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
                            handleGuessChange(1, selectedPotion.name)
                          }
                        >
                          Buy
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Bottom Section */}
              <div>
                <h2 className="mb-1">Available Potions</h2>
                <InnerPanel className="flex p-2 space-x-2">
                  {POTIONS.map((potion, index) => {
                    return (
                      <img
                        onClick={() => setSelectedPotion(potion)}
                        key={potion.name}
                        src={index % 2 === 0 ? blueBottle : orangeBottle}
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
                </InnerPanel>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
