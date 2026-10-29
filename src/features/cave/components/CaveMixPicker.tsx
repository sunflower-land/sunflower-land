import React, { useContext, useRef, useState } from "react";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type {
  CaveMudCropName,
  CaveRecipeName,
} from "features/game/types/caveRecipes";
import {
  CAVE_BATCH_DURATION_MS,
  CAVE_FIRST_BATCH_RECIPE,
  CAVE_MUD_CROPS,
  CAVE_RECIPES,
  isCavePatchCleared,
} from "features/game/types/caveRecipes";
import {
  canRestartCaveBatch,
  getCavePatchComposition,
  getUndugCaveTiles,
} from "features/game/types/cavePatch";
import type { CaveBatch, GameState } from "features/game/types/game";
import {
  getCaveBatchCost,
  getCaveBatchDuration,
  getCaveBatchSkills,
  isFirstCaveBatch,
} from "features/game/lib/cave";
import { getKeys } from "lib/object";
import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  ITEM_DETAILS,
  getTranslatedItemName,
} from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { formatNumber } from "lib/utils/formatNumber";

import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { BoostsDisplay } from "components/ui/layouts/BoostsDisplay";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import powerup from "assets/icons/level_up.png";
import {
  CaveBeetleOdds,
  CaveBuriedTiles,
  RECIPE_IMAGE,
  TILE_IMAGE,
} from "./CaveBuriedTiles";
import { CaveTutorialHand } from "./CaveTutorial";

const RECIPE_NAMES = getKeys(CAVE_RECIPES);
const MUD_CROPS = getKeys(CAVE_MUD_CROPS);

/** How much of a crop a Mud batch takes (after Cave skills). */
const getMudCropCost = (game: GameState, crop: CaveMudCropName) =>
  getCaveBatchCost({ game, recipe: "Mud", crop })?.ingredients[crop] ??
  new Decimal(CAVE_MUD_CROPS[crop]);

/** Whether the player can feed a Mud batch this crop (after Cave skills). */
const canAffordMudCrop = (game: GameState, crop: CaveMudCropName) =>
  (game.inventory[crop] ?? new Decimal(0)).gte(getMudCropCost(game, crop));

/** Every Mud crop in table order, the ones the player can afford first. */
const sortMudCrops = (game: GameState) => [
  ...MUD_CROPS.filter((crop) => canAffordMudCrop(game, crop)),
  ...MUD_CROPS.filter((crop) => !canAffordMudCrop(game, crop)),
];

const _game = (state: MachineState) => state.context.state;

interface Props {
  machineId: string;
  batch?: CaveBatch;
  onStarted: () => void;
  /** Point the Cave tutorial hand at Start while the selected mix is affordable. */
  showTutorialHand?: boolean;
}

/**
 * Picks the bin's next mix, laid out like an Aging Shed rack: a box per mix,
 * what the selected one buries, the Mud crop picker, requirements and Start.
 */
export const CaveMixPicker: React.FC<Props> = ({
  machineId,
  batch,
  onStarted,
  showTutorialHand,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const game = useSelector(gameService, _game);

  const [recipe, setRecipe] = useState<CaveRecipeName>(
    batch?.recipe ?? "Mushroom",
  );
  const [crop, setCrop] = useState<CaveMudCropName>(() => {
    const [first] = sortMudCrops(game);
    return canAffordMudCrop(game, first) ? first : "Carrot";
  });
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const [showTimeBoosts, setShowTimeBoosts] = useState(false);
  const timeBoostsRef = useRef<HTMLDivElement>(null);

  // A farm's first batch can only be the Mushroom mix; the others stay hidden.
  const recipes = isFirstCaveBatch(game)
    ? [CAVE_FIRST_BATCH_RECIPE]
    : RECIPE_NAMES;

  const isCleared = !!batch && isCavePatchCleared(batch);
  const canReplace = !!batch && !isCleared && canRestartCaveBatch(batch);

  // What a new batch would bury and cost, with the player's Cave skills.
  const buriedCounts = getCavePatchComposition(
    recipe,
    getCaveBatchSkills(game).skills,
  );

  const { mudYieldMultiplier } = CAVE_RECIPES[recipe];

  // Only a Mud batch takes a crop; the others have fixed inputs.
  const batchCrop = recipe === "Mud" ? crop : undefined;
  const ingredients =
    getCaveBatchCost({ game, recipe, crop: batchCrop })?.ingredients ?? {};
  const canAfford = getKeys(ingredients).every((item) =>
    (game.inventory[item] ?? new Decimal(0)).gte(
      ingredients[item] ?? new Decimal(0),
    ),
  );
  const { duration, boostsUsed: timeBoostsUsed } = getCaveBatchDuration(game);
  const durationSeconds = duration / 1000;
  const isTimeBoosted = timeBoostsUsed.length > 0;

  // Mushrooms left in a replaced patch are lost; ask first. Leftover Mud alone
  // is not worth a warning.
  const undug = canReplace && batch ? getUndugCaveTiles(batch) : undefined;
  const hasLeftovers = !!undug && undug.Mushroom > 0;

  const startBatch = () => {
    gameService.send({
      type: "cave.batchStarted",
      machineId,
      recipe,
      crop: batchCrop,
    });
    // The server rolls the patch's board; fetch it straight away.
    gameService.send("SAVE");
    onStarted();
  };

  return (
    <>
      <InnerPanel className="mb-1">
        {canReplace && (
          <>
            <Label
              type="success"
              icon={ITEM_DETAILS["Green Beetle"].image}
              className="ml-1 mb-1"
            >
              {t("cave.dig.allBeetlesFound")}
            </Label>
            <p className="text-xs ml-1 mb-2">{t("cave.batch.replaceHint")}</p>
          </>
        )}
        <Label type="default" className="ml-1 mb-2">
          {t("cave.batch.chooseRecipe")}
        </Label>
        <div className="flex flex-wrap gap-1 px-1 mb-2">
          {recipes.map((name) => (
            <Box
              key={name}
              image={ITEM_DETAILS[RECIPE_IMAGE[name]].image}
              hideCount
              isSelected={recipe === name}
              onClick={() => setRecipe(name)}
            />
          ))}
        </div>
        <Label
          type="default"
          icon={ITEM_DETAILS[RECIPE_IMAGE[recipe]].image}
          className="ml-1 mb-1"
        >
          {t(`cave.recipe.${recipe}` as const)}
        </Label>
        {recipe !== "Mud" && (
          <p className="text-xs ml-1 mb-2">
            {t(`cave.recipe.${recipe}.description` as const)}
          </p>
        )}
        {mudYieldMultiplier > 1 && (
          <Label
            type="success"
            icon={powerup}
            secondaryIcon={ITEM_DETAILS.Mud.image}
            className="ml-1 mb-2"
          >
            {t("cave.recipe.mudYield", { multiplier: mudYieldMultiplier })}
          </Label>
        )}
        <CaveBuriedTiles counts={buriedCounts} />
        <CaveBeetleOdds odds={getCaveBatchSkills(game).skills?.beetleRarity} />
      </InnerPanel>

      {recipe === "Mud" && (
        <InnerPanel className="mb-1">
          <div className="flex flex-wrap items-center justify-between gap-1 ml-1 mb-1">
            <Label type="default">{t("cave.batch.chooseCrop")}</Label>
            <Label type="default" icon={ITEM_DETAILS[crop].image}>
              {`${getTranslatedItemName(crop)} x${formatNumber(getMudCropCost(game, crop))}`}
            </Label>
          </div>
          <div className="flex flex-wrap gap-1 px-1 pt-2 pb-1 overflow-y-auto max-h-56 scrollable">
            {sortMudCrops(game).map((name) => (
              <div key={name} className="flex flex-col items-center">
                <Box
                  image={ITEM_DETAILS[name].image}
                  count={game.inventory[name]}
                  isSelected={crop === name}
                  secondaryImage={
                    canAffordMudCrop(game, name)
                      ? undefined
                      : SUNNYSIDE.icons.cancel
                  }
                  onClick={() => setCrop(name)}
                />
                <span className="text-xxs leading-tight">
                  {`x${formatNumber(getMudCropCost(game, name))}`}
                </span>
              </div>
            ))}
          </div>
        </InnerPanel>
      )}

      <InnerPanel className="mb-1">
        <Label type="default" className="ml-1 mb-1">
          {t("requirements")}
        </Label>
        <div className="flex flex-wrap gap-2 p-1">
          {getKeys(ingredients).map((item) => (
            <RequirementLabel
              key={item}
              type="item"
              item={item}
              balance={game.inventory[item] ?? new Decimal(0)}
              requirement={ingredients[item] ?? new Decimal(0)}
            />
          ))}
          {isTimeBoosted ? (
            <div
              ref={timeBoostsRef}
              className="flex flex-row items-center gap-2 cursor-pointer"
              onClick={() => setShowTimeBoosts(!showTimeBoosts)}
            >
              <RequirementLabel
                type="time"
                waitSeconds={durationSeconds}
                boosted
              />
              <RequirementLabel
                type="time"
                waitSeconds={CAVE_BATCH_DURATION_MS / 1000}
                strikethrough
              />
              {showTimeBoosts && (
                <BoostsDisplay
                  boosts={timeBoostsUsed}
                  show={showTimeBoosts}
                  state={game}
                  onClick={() => setShowTimeBoosts((prev) => !prev)}
                  anchorRef={timeBoostsRef}
                  portalAlign="center"
                  portalPlacement="auto"
                />
              )}
            </div>
          ) : (
            <RequirementLabel type="time" waitSeconds={durationSeconds} />
          )}
        </div>
      </InnerPanel>

      {hasLeftovers && undug && (
        <Label
          type="danger"
          icon={TILE_IMAGE.Mushroom}
          className="text-xs mx-auto mb-1"
        >
          {t("cave.batch.leftoverMushrooms", { count: undug.Mushroom })}
        </Label>
      )}

      <div className="relative">
        <Button
          disabled={!canAfford}
          onClick={() =>
            hasLeftovers ? setShowReplaceConfirm(true) : startBatch()
          }
        >
          {t("cave.batch.start")}
        </Button>
        {/* The panel scrolls, so a slightly smaller hand sits inside the
            button's corner rather than hanging off the bottom. */}
        {showTutorialHand && canAfford && (
          <CaveTutorialHand
            style={{
              width: `${PIXEL_SCALE * 14}px`,
              left: "auto",
              top: "auto",
              right: `${PIXEL_SCALE * 2}px`,
              bottom: `${PIXEL_SCALE * 2}px`,
            }}
          />
        )}
      </div>

      <ConfirmationModal
        show={showReplaceConfirm}
        onHide={() => setShowReplaceConfirm(false)}
        onCancel={() => setShowReplaceConfirm(false)}
        onConfirm={() => {
          setShowReplaceConfirm(false);
          startBatch();
        }}
        messages={[t("cave.batch.confirmReplace")]}
        confirmButtonLabel={t("cave.batch.start")}
        bodyContent={
          <div className="flex flex-wrap justify-center gap-1">
            {!!undug?.Mushroom && (
              <Label type="danger" icon={TILE_IMAGE.Mushroom}>
                {undug.Mushroom}
              </Label>
            )}
          </div>
        }
      />
    </>
  );
};
