import React, { useContext, useEffect, useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelTableBorderStyle } from "features/game/lib/style";
import { Button } from "components/ui/Button";
import { ResizableBar } from "components/ui/ProgressBar";
import { POTIONS } from "./lib/potions";
import { Box as UiBox } from "components/ui/Box";
import { PotionBox } from "./PotionBox";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { PotionHouseMachineInterpreter } from "./lib/potionHouseMachine";
import { calculateScore } from "features/game/events/landExpansion/mixPotion";
import { MixingPotion } from "./MixingPotion";
import { PotionName } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import shadow from "assets/npcs/shadow.png";
import coins from "assets/icons/coins.webp";
import potionPoint from "assets/icons/potion_point.png";
import { GAME_FEE } from "features/game/events/landExpansion/startPotion";

interface Props {
  potionHouseService: PotionHouseMachineInterpreter;
}

const EMPTY_ATTEMPT = new Array<{ potion: null; status: undefined }>(4).fill({
  potion: null,
  status: undefined,
});

const MULTIPLIERS = [1, 10, 50];
const SINGLE_MULTIPLIER_MAX_REWARD = 50;

export const Experiment: React.FC<Props> = ({ potionHouseService }) => {
  const { gameService } = useContext(Context);

  const [potionState] = useActor(potionHouseService);
  const { t } = useAppTranslation();

  const {
    context: { guessSpot, currentGuess, isNewGame, feedbackText },
  } = potionState;

  const potionHouse = gameService.getSnapshot().context.state.potionHouse;
  const previousAttempts = potionHouse?.game.attempts ?? [];
  const lastAttempt = previousAttempts[previousAttempts.length - 1] ?? [];

  const guessRow = isNewGame ? 0 : (potionHouse?.game.attempts.length ?? 0);
  const attempts = isNewGame
    ? new Array<{ potion: null; status: undefined }[]>(3).fill(EMPTY_ATTEMPT)
    : previousAttempts.concat(new Array(3).fill(EMPTY_ATTEMPT)).slice(0, 3);

  const isBombed =
    !isNewGame && lastAttempt.some((potion) => potion.status === "bomb");
  const isFinished = !isNewGame && potionHouse?.game.status === "finished";
  const isGuessing = lastAttempt.some((potion) => potion.status === "pending");
  const reward = potionHouse?.game.reward;
  const currentGameMultiplier = potionHouse?.game.multiplier ?? 1;

  const [score, setScore] = useState(
    isNewGame ? 0 : calculateScore(lastAttempt),
  );
  const [multiplier, setMultiplier] = useState(currentGameMultiplier);

  useEffect(() => {
    if (isGuessing) return;

    if (isNewGame) {
      setScore(0);
      return;
    }

    const score = calculateScore(lastAttempt);

    setScore(score);
  }, [isNewGame, isGuessing]);

  useEffect(() => {
    setMultiplier(currentGameMultiplier);
  }, [currentGameMultiplier]);

  const onGuessSpotClick = (guessSpot: number) => {
    // REMOVE GUESS
    if (currentGuess[guessSpot]) {
      potionHouseService.send({ type: "REMOVE_GUESS", guessSpot });
    }

    potionHouseService.send({ type: "SELECT_GUESS_SPOT", guessSpot });
  };

  const onPotionBottleClick = (potionName: PotionName) => {
    // ADD
    potionHouseService.send({
      type: "ADD_GUESS",
      guessSpot,
      potion: potionName,
    });
  };

  const onSubmit = () => {
    gameService.send({
      type: "potion.mixed",
      attemptNumber: guessRow + 1,
      potions: currentGuess,
    });
    gameService.send({ type: "SAVE" });
    potionHouseService.send({ type: "MIX_POTION" });
  };

  const handleStart = () => {
    gameService.send({ type: "potion.started", multiplier });
    potionHouseService.send({ type: "NEW_GAME", multiplier });
  };

  const showStartButton =
    !potionHouse || potionHouse?.game.status === "finished";

  const cost = GAME_FEE * multiplier;

  return (
    <>
      {isFinished && (
        <div className="text-center mb-3">
          {reward
            ? t("reward.congratulations", { reward })
            : t("reward.whoops")}
        </div>
      )}

      {!isFinished && !showStartButton && (
        <div className="flex justify-center mb-2">
          <Label type="default" className="flex items-center">
            <span>{t("potion.multiplier")}</span>
            <img src={potionPoint} alt="potion point" className="w-4 mx-1" />
            <span className="font-bold">{`${currentGameMultiplier}x`}</span>
          </Label>
        </div>
      )}

      <div className="flex w-full gap-1 mb-3">
        {/* Left Side */}
        <div className="flex items-center w-3/5">
          <div className="flex flex-col items-center">
            {/* Table */}
            <div className="w-full flex relative">
              <div className="w-full" style={{ ...pixelTableBorderStyle }}>
                {/* Grid */}
                <div
                  className="h-full w-full p-1"
                  style={{
                    backgroundImage: `url(${SUNNYSIDE.ui.tableTop})`,
                    backgroundRepeat: "repeat",
                    backgroundSize: `${PIXEL_SCALE * 16}px`,
                  }}
                >
                  {/* Plant */}
                  <div className="flex items-center mb-2 flex-col">
                    <img
                      src={SUNNYSIDE.decorations.planter_box}
                      alt="Plant"
                      className="mb-1"
                      style={{ width: `${PIXEL_SCALE * 28}px` }}
                    />
                    {/* <Prog */}
                    <ResizableBar
                      percentage={isBombed ? 100 : (score ?? 0)}
                      type={isBombed ? "error" : "health"}
                      outerDimensions={{ width: 28, height: 7 }}
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
                                <PotionBox
                                  potionName={currentGuess[columnIndex]}
                                  selected={guessSpot === columnIndex}
                                />
                              </div>
                            );
                          }

                          return (
                            <PotionBox
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
        <div className="flex space-x-2 items-center">
          <>
            {/* Multiplier */}
            <div className="flex flex-col items-center gap-1">
              <Label type="default">{"Multiplier"}</Label>
              <div className="flex gap-1">
                {MULTIPLIERS.map((val) => (
                  <div key={val} className="flex flex-col items-center">
                    <UiBox
                      hideCount={true}
                      image={
                        multiplier === val ? SUNNYSIDE.icons.confirm : null
                      }
                      onClick={() => setMultiplier(val)}
                    />
                    <Label type="chill">{`${val}x`}</Label>
                  </div>
                ))}
              </div>
            </div>
          </>

          {/* Start Game + Potential Prize */}
          <div className="flex flex-col items-center gap-1 w-full">
            <Button
              onClick={handleStart}
              disabled={
                (gameService.getSnapshot().context.state.coins ?? 0) < cost
              }
              className="h-fit w-fit"
            >
              <div className="flex items-center">
                <span>{`${t("statements.startgame")}`}</span>
                <img src={coins} alt="coin" className="w-4 mx-1" />
                <span>{cost}</span>
              </div>
            </Button>
            <div className="flex items-center">
              <Label type="default" className="h-fit">
                {t("reward.maxReward")}
                <img
                  src={potionPoint}
                  alt="potion point"
                  className="w-4 mx-1"
                />
                {`${SINGLE_MULTIPLIER_MAX_REWARD * multiplier}`}
              </Label>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
