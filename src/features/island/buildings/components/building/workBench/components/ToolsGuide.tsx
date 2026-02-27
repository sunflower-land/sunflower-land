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
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { GameState, LoveAnimalItem, BoostName } from "features/game/types/game";
import {
  CrustaceanName,
  CRUSTACEANS_LOOKUP,
  WATER_TRAP,
} from "features/game/types/crustaceans";
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
import classNames from "classnames";
import { CommodityName, ResourceName } from "features/game/types/resources";

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
  image?: string;
};

function getToolInfo(toolName: WorkbenchToolName | LoveAnimalItem):
  | {
      resource: CommodityName | CrustaceanName;
      nodeName?: ResourceName[];
    }[]
  | { description?: string } {
  switch (toolName) {
    case "Axe":
      return [
        { resource: "Wood", nodeName: ["Tree", "Ancient Tree", "Sacred Tree"] },
      ];
    case "Pickaxe":
      return [
        {
          resource: "Stone",
          nodeName: ["Stone Rock", "Fused Stone Rock", "Reinforced Stone Rock"],
        },
      ];
    case "Stone Pickaxe":
      return [
        {
          resource: "Iron",
          nodeName: ["Iron Rock", "Refined Iron Rock", "Tempered Iron Rock"],
        },
      ];
    case "Iron Pickaxe":
      return [
        {
          resource: "Gold",
          nodeName: ["Gold Rock", "Pure Gold Rock", "Prime Gold Rock"],
        },
      ];
    case "Gold Pickaxe":
      return [
        { resource: "Crimstone", nodeName: ["Crimstone Rock"] },
        { resource: "Sunstone", nodeName: ["Sunstone Rock"] },
      ];
    case "Oil Drill":
      return [{ resource: "Oil", nodeName: ["Oil Reserve"] }];
    case "Crab Pot":
      return [
        ...Array.from(
          new Set(Object.values(CRUSTACEANS_LOOKUP["Crab Pot"])),
        ).map((resource) => ({ resource })),
      ];
    case "Mariner Pot":
      return [
        ...Array.from(
          new Set(Object.values(CRUSTACEANS_LOOKUP["Mariner Pot"])),
        ).map((resource) => ({ resource })),
      ];

    default:
      return { description: ITEM_DETAILS[toolName].description };
  }
}

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
    image?: string,
  ): CooldownDisplay => ({
    nodeLabel,
    baseSeconds: baseTimeMs / 1000,
    recoverySeconds: recoveryTimeMs / 1000,
    boostsUsed,
    image,
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
          ITEM_DETAILS.Wood.image,
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
          ITEM_DETAILS.Stone.image,
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
          ITEM_DETAILS.Iron.image,
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
          ITEM_DETAILS.Gold.image,
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
          ITEM_DETAILS.Crimstone.image,
        ),
        toDisplay(
          translate("resource.sunstoneRecoveryTime"),
          sunstone.baseTimeMs,
          sunstone.recoveryTimeMs,
          sunstone.boostsUsed,
          ITEM_DETAILS.Sunstone.image,
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
          ITEM_DETAILS.Oil.image,
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

export const ToolsGuide: React.FC = () => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const { t } = useAppTranslation();
  const [showBoostsKey, setShowBoostsKey] = useState<string | null>(null);

  return (
    <InnerPanel className="scrollable max-h-[450px] overflow-y-scroll w-full min-w-full">
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
      <div className="w-full min-w-full">
        <div className="w-full py-1">
          <Label type="default" className="mb-1">
            {t("landTools")}
          </Label>
        </div>
        {LAND_TOOLS.map(([toolName, tool], index) => (
          <ToolRow
            key={toolName}
            toolName={toolName}
            tool={tool}
            state={state}
            alternateBg={index % 2 === 0}
            showBoostsKey={showBoostsKey}
            setShowBoostsKey={setShowBoostsKey}
          />
        ))}
        <div className="w-full py-1">
          <Label type="default" className="my-1">
            {t("waterTools")}
          </Label>
        </div>
        {WATER_TOOLS.map(([toolName, tool], index) => (
          <ToolRow
            key={toolName}
            toolName={toolName}
            tool={tool}
            state={state}
            alternateBg={index % 2 === 0}
            showBoostsKey={showBoostsKey}
            setShowBoostsKey={setShowBoostsKey}
          />
        ))}
        <div className="w-full py-1">
          <Label type="default" className="my-1">
            {t("animalTools")}
          </Label>
        </div>
        {ANIMAL_TOOLS.map(([toolName, tool], index) => (
          <ToolRow
            key={toolName}
            toolName={toolName}
            tool={tool}
            state={state}
            alternateBg={index % 2 === 0}
            showBoostsKey={showBoostsKey}
            setShowBoostsKey={setShowBoostsKey}
          />
        ))}
      </div>
    </InnerPanel>
  );
};

const CELL_CLASS = "py-0.5 pr-2 align-top";

interface ToolRowProps {
  toolName: WorkbenchToolName | LoveAnimalItem;
  tool: Tool;
  state: GameState;
  alternateBg?: boolean;
  showBoostsKey: string | null;
  setShowBoostsKey: (key: string | null) => void;
}

const ToolRow: React.FC<ToolRowProps> = ({
  toolName,
  tool,
  state,
  alternateBg,
  showBoostsKey,
  setShowBoostsKey,
}) => {
  const { t } = useAppTranslation();

  const cooldowns = getToolNodeCooldownDisplays(toolName, state);
  const toolInfo = getToolInfo(toolName);

  const cells: React.ReactNode[] = [];

  cells.push(
    <div key="name" className="flex items-center min-w-0 justify-between">
      <div className="flex items-center">
        <img
          src={ITEM_DETAILS[toolName as keyof typeof ITEM_DETAILS]?.image ?? ""}
          className="w-6 h-auto mr-2 flex-shrink-0"
          alt={tool.name}
        />
        <p className="text-xs truncate">{tool.name}</p>
      </div>
    </div>,
  );

  if (Array.isArray(toolInfo)) {
    if (toolInfo.length > 0) {
      if (toolInfo.filter((info) => info.nodeName).length > 0) {
        cells.push(
          <div key="nodes">
            {toolInfo.map((info) => {
              if (!info.nodeName) return null;
              return (
                <div key={info.resource} className="flex flex-col gap-1">
                  {info.nodeName.map((nodeName) => (
                    <div key={nodeName} className="flex items-center">
                      <img
                        src={ITEM_DETAILS[nodeName].image}
                        className="w-3 h-3 mr-1 flex-shrink-0"
                        alt={nodeName}
                      />
                      <span className="text-xxs">{nodeName}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>,
        );
      }
      cells.push(
        <div key="resources">
          {toolInfo.map((info) => (
            <div key={info.resource} className="flex items-center">
              <img
                src={ITEM_DETAILS[info.resource].image}
                className="w-3 h-3 mr-1 flex-shrink-0"
                alt={info.resource}
              />
              <span className="text-xxs">{info.resource}</span>
            </div>
          ))}
        </div>,
      );
    }
  } else if ("description" in toolInfo) {
    cells.push(
      <span key="description" className="text-xxs">
        {toolInfo.description}
      </span>,
    );
  }

  if (cooldowns.length > 0) {
    cells.push(
      <div key="cooldowns" className="flex flex-col flex-wrap gap-y-1">
        {cooldowns.map((cooldown) => {
          const boostsKey = `${toolName}-${cooldown.nodeLabel}`;
          const hasBoosts = cooldown.boostsUsed.length > 0;

          const recoveryTimeStr = secondsToString(cooldown.recoverySeconds, {
            length: hasBoosts ? "medium" : "short",
          });
          const baseTimeStr = secondsToString(cooldown.baseSeconds, {
            length: hasBoosts ? "medium" : "short",
          });

          if (hasBoosts) {
            return (
              <div
                key={cooldown.nodeLabel}
                className="flex items-start cursor-pointer gap-1 relative"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBoostsKey(
                    showBoostsKey === boostsKey ? null : boostsKey,
                  );
                }}
              >
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
            <div key={cooldown.nodeLabel} className="flex items-start gap-1">
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
      </div>,
    );
  }

  return (
    <div
      className={classNames("flex w-full min-w-full", {
        "bg-brown-100": alternateBg,
      })}
    >
      <div className={classNames(CELL_CLASS, "w-[30%] flex-shrink-0 min-w-0")}>
        {cells[0]}
      </div>
      {cells.slice(1).map((cell, index) => (
        <div key={index} className={classNames(CELL_CLASS, "flex-1 min-w-0")}>
          {cell}
        </div>
      ))}
    </div>
  );
};
