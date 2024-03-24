import React, { useContext, useEffect, useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelTableBorderStyle } from "features/game/lib/style";
import tableTop from "assets/ui/table_top.webp";
import plant from "assets/decorations/planter_box.webp";
import { Button } from "components/ui/Button";
import { ResizableBar } from "components/ui/ProgressBar";
import { POTIONS } from "./lib/potions";
import { Box } from "./Box";
import shadow from "assets/npcs/shadow.png";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { PotionHouseMachineInterpreter } from "./lib/potionHouseMachine";
import { calculateScore } from "features/game/events/landExpansion/mixPotion";
import { MixingPotion } from "./MixingPotion";
import { PotionName } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
  potionHouseService: PotionHouseMachineInterpreter;
}

const EMPTY_ATTEMPT = new Array<{ potion: null; status: undefined }>(4).fill({
  potion: null,
  status: undefined,
});

export const Experiment: React.FC<Props> = ({
  onClose,
  potionHouseService,
}) => {
  const { gameService } = useContext(Context);
  const [potionState] = useActor(potionHouseService);
  const { t } = useAppTranslation();

  const {
    context: { guessSpot, currentGuess, isNewGame, feedbackText },
  } = potionState;

  const potionHouse = gameService.state.context.state.potionHouse;
  const previousAttempts = potionHouse?.game.attempts ?? [];
  const lastAttempt = previousAttempts[previousAttempts.length - 1] ?? [];

  const guessRow = isNewGame ? 0 : potionHouse?.game.attempts.length ?? 0;
  const attempts = isNewGame
    ? new Array<{ potion: null; status: undefined }[]>(3).fill(EMPTY_ATTEMPT)
    : previousAttempts.concat(new Array(3).fill(EMPTY_ATTEMPT)).slice(0, 3);

  const isBombed =
    !isNewGame && lastAttempt.some((potion) => potion.status === "bomb");
  const isFinished = !isNewGame && potionHouse?.game.status === "finished";
  const isGuessing = lastAttempt.some((potion) => potion.status === "pending");
  const reward = potionHouse?.game.reward;

  const [score, setScore] = useState(
    isNewGame ? 0 : calculateScore(lastAttempt)
  );

  useEffect(() => {
    if (isGuessing) return;

    if (isNewGame) {
      setScore(0);
      return;
    }

    const score = calculateScore(lastAttempt);

    setScore(score);
  }, [isNewGame, isGuessing]);

  const onGuessSpotClick = (guessSpot: number) => {
    // REMOVE GUESS
    if (currentGuess[guessSpot]) {
      potionHouseService.send("REMOVE_GUESS", { guessSpot });
    }

    potionHouseService.send("SELECT_GUESS_SPOT", { guessSpot });
  };

  const onPotionBottleClick = (potionName: PotionName) => {
    // ADD
    potionHouseService.send("ADD_GUESS", {
      guessSpot,
      potion: potionName,
    });
  };

  const onSubmit = () => {
    gameService.send("potion.mixed", {
      attemptNumber: guessRow + 1,
      potions: currentGuess,
    });
    gameService.send("SAVE");
    potionHouseService.send("MIX_POTION");
  };

  const handleStart = () => {
    gameService.send("potion.started");
    potionHouseService.send("NEW_GAME");
  };

  const showStartButton =
    !potionHouse || potionHouse?.game.status === "finished";

  return (
    <>
      {isFinished && (
        <div className="text-center mb-3">
          {reward
            ? `Congratulations! You won ${[reward]} points!`
            : "Whoops! better luck next time!"}
        </div>
      )}

      <div className="flex w-full gap-1 mb-3">
        {/* Left Side */}
        <div className="flex items-center w-3/5">
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
                      percentage={isBombed ? 100 : score ?? 0}
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
                                onClick={() => onGuessSpotClick(columnIndex)}
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
                    disabled={
                      currentGuess.some((potion) => potion === null) ||
                      isGuessing
                    }
                    onClick={() => onSubmit()}
                  >
                    {isGuessing ? "Mixing..." : "Mix potion"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side */}
        <div className="flex flex-col justify-center items-center w-full sm:w-[70%]">
          <MixingPotion
            feedbackText={feedbackText}
            potionHouseService={potionHouseService}
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col grow space-y-1">
        {/* Potions */}
        {!isFinished && !showStartButton && (
          <div className="flex flex-col justify-end grow">
            <h2 className="mb-1">{t("potions")}</h2>
            <span className="text-xxs italic">
              {t("statements.clickBottle")}
            </span>
            <div className="flex flex-wrap gap-2 mt-3 mb-2">
              {Object.values(POTIONS).map((potion) => (
                <div
                  key={potion.name}
                  className={"relative cursor-pointer"}
                  onClick={() => onPotionBottleClick(potion.name)}
                >
                  <img src={shadow} alt="" className="absolute -bottom-1 w-8" />
                  <img src={potion.image} alt="" className="w-8 relative" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {showStartButton && (
        <div className="flex flex-col-reverse space-y-reverse space-y-1 sm:flex-row sm:space-y-0 sm:space-x-1 ">
          <Button onClick={onClose}>{t("close")}</Button>
          <Button
            onClick={handleStart}
            disabled={gameService.state.context.state.balance.lessThan(1)}
          >{`${t("statements.startgame")} (320 coins)`}</Button>
        </div>
      )}
    </>
  );
};
