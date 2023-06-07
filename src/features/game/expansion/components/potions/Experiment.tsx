import React, { useContext } from "react";
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
import { getKeys } from "features/game/types/craftables";
import shadow from "assets/npcs/shadow.png";
import classNames from "classnames";
import { Game, MachineInterpreter } from "./lib/potionHouseMachine";
import { useActor, useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineState as GameMachineState } from "features/game/lib/gameMachine";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";

interface Props {
  machine: MachineInterpreter;
}

const _inventory = (state: GameMachineState) => state.context.state.inventory;

export const Experiment: React.FC<Props> = ({ machine }) => {
  const { gameService } = useContext(Context);
  const [state, send] = useActor(machine);

  const inventory = useSelector(gameService, _inventory);

  const {
    selectedPotion,
    guesses,
    currentGuess,
    guessRow,
    guessSpot,
    feedbackText,
  } = state.context.game as Game;

  const onPotionButtonClick = () => {
    if (currentGuess[guessSpot]) {
      send("REMOVE_POTION", { index: guessSpot });
      return;
    }

    send("ADD_POTION");
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
                      percentage={80}
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
                              onClick={() =>
                                send({
                                  type: "SET_GUESS_SPOT",
                                  index: columnIndex,
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
                    onClick={() => send("CONFIRM_GUESS")}
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
                        <RequirementLabel
                          key={index}
                          type="item"
                          item={item}
                          balance={inventory[item] ?? new Decimal(0)}
                          requirement={
                            (selectedPotion.ingredients ?? {})[item] ??
                            new Decimal(0)
                          }
                        />
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <Button className="h-9" onClick={onPotionButtonClick}>
              {currentGuess[guessSpot] ? "Remove from mix" : "Add to mix"}
            </Button>
          </InnerPanel>
          <div className="flex flex-wrap justify-center gap-2 mt-3 mb-2">
            {POTIONS.map((potion) => (
              <div
                key={potion.name}
                className={classNames("relative", {
                  "img-highlight": potion.name === selectedPotion?.name,
                })}
                onClick={() => send({ type: "SELECT_POTION", potion })}
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
