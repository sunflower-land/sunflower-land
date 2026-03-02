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
import { CommodityName } from "features/game/types/resources";

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

type ToolDisplayItem = {
  resource: CommodityName | CrustaceanName;
  cooldown: CooldownDisplay | null;
};

type ToolDisplayData =
  | { type: "description"; description: string }
  | {
      type: "items";
      items: ToolDisplayItem[];
      sharedCooldown?: CooldownDisplay;
    };

function getToolDisplayData(
  toolName: WorkbenchToolName | LoveAnimalItem,
  state: GameState,
): ToolDisplayData {
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
      return {
        type: "items",
        items: [
          {
            resource: "Wood",
            cooldown: toDisplay(
              translate("resource.treeRecoveryTime"),
              baseTimeMs,
              recoveryTimeMs,
              boostsUsed,
              ITEM_DETAILS.Wood.image,
            ),
          },
        ],
      };
    }
    case "Pickaxe": {
      const { baseTimeMs, recoveryTimeMs, boostsUsed } =
        getStoneRecoveryTimeForDisplay({ game: state });
      return {
        type: "items",
        items: [
          {
            resource: "Stone",
            cooldown: toDisplay(
              translate("resource.stoneRecoveryTime"),
              baseTimeMs,
              recoveryTimeMs,
              boostsUsed,
              ITEM_DETAILS.Stone.image,
            ),
          },
        ],
      };
    }
    case "Stone Pickaxe": {
      const { baseTimeMs, recoveryTimeMs, boostsUsed } =
        getIronRecoveryTimeForDisplay({ game: state });
      return {
        type: "items",
        items: [
          {
            resource: "Iron",
            cooldown: toDisplay(
              translate("resource.ironRecoveryTime"),
              baseTimeMs,
              recoveryTimeMs,
              boostsUsed,
              ITEM_DETAILS.Iron.image,
            ),
          },
        ],
      };
    }
    case "Iron Pickaxe": {
      const gold = getGoldRecoveryTimeForDisplay({ game: state });
      return {
        type: "items",
        items: [
          {
            resource: "Gold",
            cooldown: toDisplay(
              translate("resource.goldRecoveryTime"),
              gold.baseTimeMs,
              gold.recoveryTimeMs,
              gold.boostsUsed,
              ITEM_DETAILS.Gold.image,
            ),
          },
        ],
      };
    }
    case "Gold Pickaxe": {
      const crimstone = getCrimstoneRecoveryTimeForDisplay({ game: state });
      const sunstone = getSunstoneRecoveryTimeForDisplay(state);
      return {
        type: "items",
        items: [
          {
            resource: "Crimstone",
            cooldown: toDisplay(
              translate("resource.crimstoneRecoveryTime"),
              crimstone.baseTimeMs,
              crimstone.recoveryTimeMs,
              crimstone.boostsUsed,
              ITEM_DETAILS.Crimstone.image,
            ),
          },
          {
            resource: "Sunstone",
            cooldown: toDisplay(
              translate("resource.sunstoneRecoveryTime"),
              sunstone.baseTimeMs,
              sunstone.recoveryTimeMs,
              sunstone.boostsUsed,
              ITEM_DETAILS.Sunstone.image,
            ),
          },
        ],
      };
    }
    case "Oil Drill": {
      const { baseTimeMs, recoveryTimeMs, boostsUsed } =
        getOilRecoveryTimeForDisplay({ game: state });
      return {
        type: "items",
        items: [
          {
            resource: "Oil",
            cooldown: toDisplay(
              translate("resource.oilRecoveryTime"),
              baseTimeMs,
              recoveryTimeMs,
              boostsUsed,
              ITEM_DETAILS.Oil.image,
            ),
          },
        ],
      };
    }
    case "Crab Pot": {
      const sharedCooldown: CooldownDisplay = {
        nodeLabel: translate("toolGuide.trapReady"),
        baseSeconds: WATER_TRAP["Crab Pot"].readyTimeHours * 60 * 60,
        recoverySeconds: WATER_TRAP["Crab Pot"].readyTimeHours * 60 * 60,
        boostsUsed: [],
      };
      return {
        type: "items",
        items: Array.from(
          new Set(Object.values(CRUSTACEANS_LOOKUP["Crab Pot"])),
        ).map((resource) => ({ resource, cooldown: null })),
        sharedCooldown,
      };
    }
    case "Mariner Pot": {
      const sharedCooldown: CooldownDisplay = {
        nodeLabel: translate("toolGuide.trapReady"),
        baseSeconds: WATER_TRAP["Mariner Pot"].readyTimeHours * 60 * 60,
        recoverySeconds: WATER_TRAP["Mariner Pot"].readyTimeHours * 60 * 60,
        boostsUsed: [],
      };
      return {
        type: "items",
        items: Array.from(
          new Set(Object.values(CRUSTACEANS_LOOKUP["Mariner Pot"])),
        ).map((resource) => ({ resource, cooldown: null })),
        sharedCooldown,
      };
    }
    default:
      return {
        type: "description",
        description: ITEM_DETAILS[toolName].description ?? "",
      };
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

const CooldownCell: React.FC<{
  cooldown: CooldownDisplay;
  toolName: WorkbenchToolName | LoveAnimalItem;
  showBoostsKey: string | null;
  setShowBoostsKey: (key: string | null) => void;
  state: GameState;
}> = ({ cooldown, toolName, showBoostsKey, setShowBoostsKey, state }) => {
  const { t } = useAppTranslation();
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
        className="flex items-start cursor-pointer gap-1 relative"
        onClick={(e) => {
          e.stopPropagation();
          setShowBoostsKey(showBoostsKey === boostsKey ? null : boostsKey);
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
              {cooldown.recoverySeconds > 0 ? recoveryTimeStr : t("instant")}
            </span>
          </div>
          {cooldown.baseSeconds > 0 && (
            <div className="flex items-center">
              <img
                src={SUNNYSIDE.icons.stopwatch}
                className="w-3 h-3 mr-1 flex-shrink-0"
                alt=""
              />
              <span className="text-xxs line-through">{baseTimeStr}</span>
            </div>
          )}
        </div>
        <BoostsDisplay
          boosts={cooldown.boostsUsed}
          show={showBoostsKey === boostsKey}
          state={state}
          onClick={() =>
            setShowBoostsKey(showBoostsKey === boostsKey ? null : boostsKey)
          }
          className="right-0 left-auto"
        />
      </div>
    );
  }

  return (
    <div className="flex items-start gap-1">
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
};

const toolNameCell = (
  toolName: WorkbenchToolName | LoveAnimalItem,
  tool: Tool,
) => (
  <div className="flex items-center min-w-0 justify-between">
    <div className="flex items-center">
      <img
        src={ITEM_DETAILS[toolName as keyof typeof ITEM_DETAILS]?.image ?? ""}
        className="w-6 h-auto mr-2 flex-shrink-0"
        alt={tool.name}
      />
      <p className="text-xs truncate">{tool.name}</p>
    </div>
  </div>
);

const LineItem: React.FC<{
  icon: string;
  text: string;
}> = ({ icon, text }) => (
  <div className="flex items-center gap-1">
    <img src={icon} className="w-3 h-3 flex-shrink-0" alt="" />
    <span className="text-xxs">{text}</span>
  </div>
);

const InlineItems: React.FC<{
  items: { icon: string; text: string }[];
}> = ({ items }) => (
  <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
    {items.map(({ icon, text }) => (
      <LineItem key={text} icon={icon} text={text} />
    ))}
  </div>
);

const ToolRowMobile: React.FC<ToolRowProps> = ({
  toolName,
  tool,
  state,
  alternateBg,
  showBoostsKey,
  setShowBoostsKey,
}) => {
  const data = getToolDisplayData(toolName, state);

  return (
    <div
      className={classNames("flex flex-col gap-1 py-1 pl-1", {
        "bg-brown-100": alternateBg,
      })}
    >
      {toolNameCell(toolName, tool)}

      {data.type === "description" ? (
        <span className="text-xxs">{data.description}</span>
      ) : data.type === "items" &&
        data.items.length > 0 &&
        data.sharedCooldown ? (
        <div className="flex w-full gap-2">
          <div className="flex flex-1 min-w-0 flex-col gap-0.5">
            <InlineItems
              items={data.items.map((item) => ({
                icon: ITEM_DETAILS[item.resource].image,
                text: item.resource,
              }))}
            />
          </div>
          <div className="flex flex-1 min-w-0 items-start">
            <CooldownCell
              cooldown={data.sharedCooldown}
              toolName={toolName}
              showBoostsKey={showBoostsKey}
              setShowBoostsKey={setShowBoostsKey}
              state={state}
            />
          </div>
        </div>
      ) : data.type === "items" && data.items.length > 0 ? (
        <div className="flex flex-col gap-1">
          {data.items.map((item) => (
            <div key={item.resource} className="flex w-full gap-2">
              <div className="flex flex-1 min-w-0 flex-col gap-0.5 items-start">
                <LineItem
                  icon={ITEM_DETAILS[item.resource].image}
                  text={item.resource}
                />
              </div>
              <div className="flex flex-1 min-w-0 items-start">
                {item.cooldown && (
                  <CooldownCell
                    cooldown={item.cooldown}
                    toolName={toolName}
                    showBoostsKey={showBoostsKey}
                    setShowBoostsKey={setShowBoostsKey}
                    state={state}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const ToolRowDesktop: React.FC<ToolRowProps> = ({
  toolName,
  tool,
  state,
  alternateBg,
  showBoostsKey,
  setShowBoostsKey,
}) => {
  const data = getToolDisplayData(toolName, state);

  if (data.type === "description") {
    return (
      <div
        className={classNames("flex w-full min-w-full", {
          "bg-brown-100": alternateBg,
        })}
      >
        <div
          className={classNames(CELL_CLASS, "w-[30%] flex-shrink-0 min-w-0")}
        >
          {toolNameCell(toolName, tool)}
        </div>
        <div className={classNames(CELL_CLASS, "flex-1 min-w-0")}>
          <span className="text-xxs">{data.description}</span>
        </div>
      </div>
    );
  }

  if (
    data.type === "items" &&
    data.items.length > 1 &&
    data.sharedCooldown != null
  ) {
    return (
      <div
        className={classNames("flex w-full min-w-full", {
          "bg-brown-100": alternateBg,
        })}
      >
        <div
          className={classNames(CELL_CLASS, "w-[30%] flex-shrink-0 min-w-0")}
        >
          {toolNameCell(toolName, tool)}
        </div>
        <div className={classNames(CELL_CLASS, "flex-1 min-w-0")}>
          <div className="flex flex-col gap-1">
            {data.items.map((item) => (
              <div key={item.resource} className="flex items-center">
                <img
                  src={ITEM_DETAILS[item.resource].image}
                  className="w-3 h-3 mr-1 flex-shrink-0"
                  alt={item.resource}
                />
                <span className="text-xxs">{item.resource}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={classNames(CELL_CLASS, "flex-1 min-w-0")}>
          <CooldownCell
            cooldown={data.sharedCooldown}
            toolName={toolName}
            showBoostsKey={showBoostsKey}
            setShowBoostsKey={setShowBoostsKey}
            state={state}
          />
        </div>
      </div>
    );
  }

  if (data.type === "items" && data.items.length > 0) {
    const itemsWithCooldown = data.items.filter(
      (item) => item.cooldown != null,
    );
    if (itemsWithCooldown.length === 0) return null;

    return (
      <div
        className={classNames("flex flex-col w-full min-w-full gap-1", {
          "bg-brown-100": alternateBg,
        })}
      >
        {itemsWithCooldown.map((item, i) => (
          <div key={item.resource} className="flex w-full gap-2">
            <div
              className={classNames(
                CELL_CLASS,
                "w-[30%] flex-shrink-0 min-w-0",
              )}
            >
              {i === 0 ? toolNameCell(toolName, tool) : null}
            </div>
            <div className={classNames(CELL_CLASS, "flex-1 min-w-0")}>
              <div className="flex items-center">
                <img
                  src={ITEM_DETAILS[item.resource].image}
                  className="w-3 h-3 mr-1 flex-shrink-0"
                  alt={item.resource}
                />
                <span className="text-xxs">{item.resource}</span>
              </div>
            </div>
            <div className={classNames(CELL_CLASS, "flex-1 min-w-0")}>
              <CooldownCell
                cooldown={item.cooldown!}
                toolName={toolName}
                showBoostsKey={showBoostsKey}
                setShowBoostsKey={setShowBoostsKey}
                state={state}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const ToolRow: React.FC<ToolRowProps> = ({
  toolName,
  tool,
  state,
  alternateBg,
  showBoostsKey,
  setShowBoostsKey,
}) => (
  <>
    <div className="block sm:hidden">
      <ToolRowMobile
        toolName={toolName}
        tool={tool}
        state={state}
        alternateBg={alternateBg}
        showBoostsKey={showBoostsKey}
        setShowBoostsKey={setShowBoostsKey}
      />
    </div>
    <div className="hidden sm:block">
      <ToolRowDesktop
        toolName={toolName}
        tool={tool}
        state={state}
        alternateBg={alternateBg}
        showBoostsKey={showBoostsKey}
        setShowBoostsKey={setShowBoostsKey}
      />
    </div>
  </>
);
