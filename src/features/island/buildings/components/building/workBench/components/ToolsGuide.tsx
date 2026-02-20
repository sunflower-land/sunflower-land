import React, { useContext, useState } from "react";
import { InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { Label } from "components/ui/Label";
import {
  WORKBENCH_TOOLS,
  LOVE_ANIMAL_TOOLS,
  Tool,
  WorkbenchToolName,
} from "features/game/types/tools";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getToolPrice } from "features/game/events/landExpansion/craftTool";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { getBumpkinLevel } from "features/game/lib/level";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import {
  GameState,
  IslandType,
  LoveAnimalItem,
  BoostName,
} from "features/game/types/game";
import { capitalize } from "lib/utils/capitalize";
import { WATER_TRAP } from "features/game/types/crustaceans";
import { secondsToString } from "lib/utils/time";
import { translate } from "lib/i18n/translate";
import { getOilRecoveryTimeForDisplay } from "features/game/events/landExpansion/drillOilReserve";
import { BoostsDisplay } from "components/ui/layouts/BoostsDisplay";
import { getTreeRecoveryTimeForDisplay } from "features/game/events/landExpansion/chop";
import { getStoneRecoveryTimeForDisplay } from "features/game/events/landExpansion/stoneMine";
import { getIronRecoveryTimeForDisplay } from "features/game/events/landExpansion/ironMine";
import { getGoldRecoveryTimeForDisplay } from "features/game/events/landExpansion/mineGold";
import { getCrimstoneRecoveryTimeForDisplay } from "features/game/events/landExpansion/mineCrimstone";
import { getSunstoneRecoveryTimeForDisplay } from "features/game/events/landExpansion/mineSunstone";
import { useSelector } from "@xstate/react";

const LAND_TOOLS = getObjectEntries(WORKBENCH_TOOLS).filter(
  ([, tool]) => !tool.disabled && tool.type === "land",
);

const WATER_TOOLS = getObjectEntries(WORKBENCH_TOOLS).filter(
  ([, tool]) => !tool.disabled && tool.type === "water",
);

const ANIMAL_TOOLS = getObjectEntries(LOVE_ANIMAL_TOOLS);

type CooldownDisplay = {
  nodeLabel: string;
  baseSeconds: number;
  recoverySeconds: number;
  boostsUsed: { name: BoostName; value: string }[];
};

/** Node cooldown(s) with boost data. Tools like Gold Pickaxe have multiple nodes. */
function getToolNodeCooldownDisplays(
  toolName: WorkbenchToolName | LoveAnimalItem,
  state: GameState,
): CooldownDisplay[] {
  const toDisplay = (
    nodeLabel: string,
    baseTimeMs: number,
    recoveryTimeMs: number,
    boostsUsed: { name: BoostName; value: string }[],
  ): CooldownDisplay => ({
    nodeLabel,
    baseSeconds: baseTimeMs / 1000,
    recoverySeconds: recoveryTimeMs / 1000,
    boostsUsed,
  });

  switch (toolName) {
    case "Axe": {
      const { baseTimeMs, recoveryTimeMs, boostsUsed } =
        getTreeRecoveryTimeForDisplay({ game: state });
      return [
        toDisplay(
          translate("resource.treeRecoveryTime"),
          baseTimeMs,
          recoveryTimeMs,
          boostsUsed,
        ),
      ];
    }
    case "Pickaxe": {
      const { baseTimeMs, recoveryTimeMs, boostsUsed } =
        getStoneRecoveryTimeForDisplay({ game: state });
      return [
        toDisplay(
          translate("resource.stoneRecoveryTime"),
          baseTimeMs,
          recoveryTimeMs,
          boostsUsed,
        ),
      ];
    }
    case "Stone Pickaxe": {
      const { baseTimeMs, recoveryTimeMs, boostsUsed } =
        getIronRecoveryTimeForDisplay({ game: state });
      return [
        toDisplay(
          translate("resource.ironRecoveryTime"),
          baseTimeMs,
          recoveryTimeMs,
          boostsUsed,
        ),
      ];
    }

    case "Iron Pickaxe": {
      const gold = getGoldRecoveryTimeForDisplay({ game: state });
      return [
        toDisplay(
          translate("resource.goldRecoveryTime"),
          gold.baseTimeMs,
          gold.recoveryTimeMs,
          gold.boostsUsed,
        ),
      ];
    }
    case "Gold Pickaxe": {
      const crimstone = getCrimstoneRecoveryTimeForDisplay({ game: state });
      const sunstone = getSunstoneRecoveryTimeForDisplay(state);
      return [
        toDisplay(
          translate("resource.crimstoneRecoveryTime"),
          crimstone.baseTimeMs,
          crimstone.recoveryTimeMs,
          crimstone.boostsUsed,
        ),
        toDisplay(
          translate("resource.sunstoneRecoveryTime"),
          sunstone.baseTimeMs,
          sunstone.recoveryTimeMs,
          sunstone.boostsUsed,
        ),
      ];
    }
    case "Oil Drill": {
      const { baseTimeMs, recoveryTimeMs, boostsUsed } =
        getOilRecoveryTimeForDisplay({ game: state });
      return [
        toDisplay(
          translate("resource.oilRecoveryTime"),
          baseTimeMs,
          recoveryTimeMs,
          boostsUsed,
        ),
      ];
    }
    case "Crab Pot":
      return [
        {
          nodeLabel: translate("toolGuide.trapReady"),
          baseSeconds: WATER_TRAP["Crab Pot"].readyTimeHours * 60 * 60,
          recoverySeconds: WATER_TRAP["Crab Pot"].readyTimeHours * 60 * 60,
          boostsUsed: [],
        },
      ];
    case "Mariner Pot":
      return [
        {
          nodeLabel: translate("toolGuide.trapReady"),
          baseSeconds: WATER_TRAP["Mariner Pot"].readyTimeHours * 60 * 60,
          recoverySeconds: WATER_TRAP["Mariner Pot"].readyTimeHours * 60 * 60,
          boostsUsed: [],
        },
      ];
    default:
      return [];
  }
}

function hasRequiredLevel(tool: Tool, state: GameState): boolean {
  if (tool.requiredLevel === undefined) return true;
  const bumpkinLevel = getBumpkinLevel(state.bumpkin?.experience ?? 0);
  return bumpkinLevel >= (tool.requiredLevel ?? 0);
}

export const ToolsGuide = () => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const { t } = useAppTranslation();
  const [showBoostsKey, setShowBoostsKey] = useState<string | null>(null);

  return (
    <InnerPanel className="scrollable max-h-[300px] overflow-y-scroll">
      <div className="p-1">
        <NoticeboardItems
          items={[
            {
              text: t("toolGuide.landToolsTip"),
              icon: ITEM_DETAILS.Axe.image,
            },
            {
              text: t("toolGuide.waterToolsTip"),
              icon: ITEM_DETAILS.Rod.image,
            },
            {
              text: t("toolGuide.levelUpTip"),
              icon: SUNNYSIDE.icons.player,
            },
          ]}
        />
      </div>
      <table className="w-full border-collapse table-fixed">
        <colgroup>
          <col style={{ width: "35%" }} />
          <col style={{ width: "40%" }} />
          <col style={{ width: "25%" }} />
        </colgroup>
        <tbody>
          <tr>
            <td colSpan={3} className="py-1">
              <Label type="default" className="mb-1">
                {t("landTools")}
              </Label>
            </td>
          </tr>
          {LAND_TOOLS.map(([toolName, tool], index) => {
            const price = getToolPrice(tool, 1, state);
            const ingredients = tool.ingredients(state.bumpkin?.skills);
            const isLocked =
              !hasRequiredIslandExpansion(
                state.island.type,
                tool.requiredIsland,
              ) || !hasRequiredLevel(tool, state);
            return (
              <ToolRow
                key={toolName}
                toolName={toolName}
                tool={tool}
                price={price}
                ingredients={ingredients}
                isLocked={isLocked}
                state={state}
                alternateBg={index % 2 === 0}
                showBoostsKey={showBoostsKey}
                setShowBoostsKey={setShowBoostsKey}
              />
            );
          })}
          <tr>
            <td colSpan={3} className="py-1">
              <Label type="default" className="my-1">
                {t("waterTools")}
              </Label>
            </td>
          </tr>
          {WATER_TOOLS.map(([toolName, tool], index) => {
            const price = getToolPrice(tool, 1, state);
            const ingredients = tool.ingredients(state.bumpkin?.skills);
            const isLocked =
              !hasRequiredIslandExpansion(
                state.island.type,
                tool.requiredIsland,
              ) || !hasRequiredLevel(tool, state);
            return (
              <ToolRow
                key={toolName}
                toolName={toolName}
                tool={tool}
                price={price}
                ingredients={ingredients}
                isLocked={isLocked}
                state={state}
                alternateBg={index % 2 === 0}
                showBoostsKey={showBoostsKey}
                setShowBoostsKey={setShowBoostsKey}
              />
            );
          })}
          <tr>
            <td colSpan={3} className="py-1">
              <Label type="default" className="my-1">
                {t("animalTools")}
              </Label>
            </td>
          </tr>
          {ANIMAL_TOOLS.map(([toolName, tool], index) => {
            const price = getToolPrice(tool, 1, state);
            const ingredients = tool.ingredients(state.bumpkin?.skills);
            return (
              <ToolRow
                key={toolName}
                toolName={toolName}
                tool={tool}
                price={price}
                ingredients={ingredients}
                isLocked={false}
                state={state}
                alternateBg={index % 2 === 0}
                isAnimalTool
                showBoostsKey={showBoostsKey}
                setShowBoostsKey={setShowBoostsKey}
              />
            );
          })}
        </tbody>
      </table>
    </InnerPanel>
  );
};

interface ToolRowProps {
  toolName: WorkbenchToolName | LoveAnimalItem;
  tool: Tool;
  price: number;
  ingredients: ReturnType<Tool["ingredients"]>;
  isLocked: boolean;
  state: GameState;
  alternateBg?: boolean;
  isAnimalTool?: boolean;
  showBoostsKey: string | null;
  setShowBoostsKey: (key: string | null) => void;
}

const ToolRow: React.FC<ToolRowProps> = ({
  toolName,
  tool,
  price,
  ingredients,
  isLocked,
  state,
  alternateBg,
  isAnimalTool,
  showBoostsKey,
  setShowBoostsKey,
}) => {
  const { t } = useAppTranslation();
  const hasIslandReq =
    !isAnimalTool &&
    tool.requiredIsland &&
    !hasRequiredIslandExpansion(state.island.type, tool.requiredIsland);
  const hasLevelReq =
    !isAnimalTool &&
    tool.requiredLevel !== undefined &&
    getBumpkinLevel(state.bumpkin?.experience ?? 0) < tool.requiredLevel;

  const cooldowns = getToolNodeCooldownDisplays(toolName, state);

  return (
    <tr className={`${alternateBg ? "bg-[#ead4aa]" : ""}`}>
      <td className="py-0.5 pr-2 align-top w-1/4">
        <div className="flex items-center min-w-0">
          <img
            src={
              ITEM_DETAILS[toolName as keyof typeof ITEM_DETAILS]?.image ?? ""
            }
            className="w-6 h-auto mr-2 flex-shrink-0"
            alt={tool.name}
          />
          <p className="text-xs truncate">{tool.name}</p>
        </div>
      </td>
      <td className="py-0.5 pr-2 align-top w-1/2">
        <div className="flex flex-col flex-wrap gap-x-1">
          {cooldowns.length > 0 &&
            cooldowns.map((cooldown) => {
              const boostsKey = `${toolName}-${cooldown.nodeLabel}`;
              const hasBoosts = cooldown.boostsUsed.length > 0;

              const recoveryTimeStr = secondsToString(
                cooldown.recoverySeconds,
                { length: "medium" },
              );
              const baseTimeStr = secondsToString(cooldown.baseSeconds, {
                length: "medium",
              });

              if (hasBoosts) {
                return (
                  <div
                    key={cooldown.nodeLabel}
                    className="flex flex-row items-start cursor-pointer gap-1 relative"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowBoostsKey(
                        showBoostsKey === boostsKey ? null : boostsKey,
                      );
                    }}
                  >
                    <span className="text-xxs">{cooldown.nodeLabel}</span>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center">
                        <img
                          src={SUNNYSIDE.icons.lightning}
                          className="w-3 h-3 mr-1 flex-shrink-0"
                          alt=""
                        />
                        <span className="text-xxs">
                          {cooldown.recoverySeconds > 0
                            ? recoveryTimeStr
                            : t("instant")}
                        </span>
                      </div>
                      {cooldown.baseSeconds > 0 && (
                        <div className="flex items-center">
                          <img
                            src={SUNNYSIDE.icons.stopwatch}
                            className="w-3 h-3 mr-1 flex-shrink-0"
                            alt=""
                          />
                          <span className="text-xxs line-through">
                            {baseTimeStr}
                          </span>
                        </div>
                      )}
                    </div>
                    <BoostsDisplay
                      boosts={cooldown.boostsUsed}
                      show={showBoostsKey === boostsKey}
                      state={state}
                      onClick={() =>
                        setShowBoostsKey(
                          showBoostsKey === boostsKey ? null : boostsKey,
                        )
                      }
                    />
                  </div>
                );
              }

              return (
                <div
                  key={cooldown.nodeLabel}
                  className="flex items-start gap-1"
                >
                  <span className="text-xxs">{cooldown.nodeLabel}</span>
                  <div className="flex items-center">
                    <img
                      src={SUNNYSIDE.icons.stopwatch}
                      className="w-3 h-3 mr-1 flex-shrink-0"
                      alt=""
                    />
                    <span className="text-xxs">{recoveryTimeStr}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </td>
      <td className="py-0.5 pr-2 align-top w-1/4">
        <div className="flex flex-row flex-wrap gap-x-1 items-center">
          {price > 0 && (
            <div className="flex items-center">
              <img src={SUNNYSIDE.ui.coins} className="w-3 mr-1" alt="" />
              <p className="text-xxs">{Math.round(price).toLocaleString()}</p>
            </div>
          )}
          {getObjectEntries(ingredients).map(([ingredient, amount]) => {
            if (!amount || amount.lte(0)) return null;
            return (
              <div className="flex items-center" key={ingredient}>
                <img
                  src={ITEM_DETAILS[ingredient].image}
                  className="w-3 mr-1"
                  alt=""
                />
                <p className="text-xxs">{amount.toNumber()}</p>
              </div>
            );
          })}
        </div>
        {isLocked && (
          <img
            src={SUNNYSIDE.icons.lock}
            className="w-5 h-5"
            alt=""
            title={
              hasIslandReq
                ? t("islandupgrade.requiredIsland", {
                    islandType:
                      tool.requiredIsland === "spring"
                        ? "Petal Paradise"
                        : t("islandupgrade.otherIsland", {
                            island: capitalize(
                              tool.requiredIsland as IslandType,
                            ),
                          }),
                  })
                : hasLevelReq
                  ? t("warning.level.required", {
                      lvl: tool.requiredLevel ?? 0,
                    })
                  : undefined
            }
          />
        )}
      </td>
    </tr>
  );
};
