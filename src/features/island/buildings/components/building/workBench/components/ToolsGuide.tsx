import React, { useContext, useRef, useState } from "react";
import { InnerPanel } from "components/ui/Panel";
import {
  ITEM_DETAILS,
  getTranslatedItemName,
} from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { Label } from "components/ui/Label";
import type { WorkbenchToolName } from "features/game/types/tools";
import { SquareIcon } from "components/ui/SquareIcon";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { GameState, BoostName } from "features/game/types/game";
import { secondsToString } from "lib/utils/time";
import { translate } from "lib/i18n/translate";
import { getOilRecoveryTimeForDisplay } from "features/game/events/landExpansion/drillOilReserve";
import { BoostsDisplay } from "components/ui/layouts/BoostsDisplay";
import { useNow } from "lib/utils/hooks/useNow";
import {
  getPreActionDisplay,
  isPreActionBoosted,
  PRE_ACTION_TICK_MS,
} from "features/game/lib/timerDisplay";
import { getNodeBoostWindows } from "features/game/lib/seedBoostWindows";
import {
  getBoostContributionEntries,
  getNodeBoostContributions,
} from "features/game/lib/boostContributions";
import {
  INITIAL_STOCK,
  PIXEL_SCALE,
  isBuildingReady,
} from "features/game/lib/constants";
import { SKILL_RANKS, getSkillLevel } from "features/game/types/bumpkinSkills";
import stockIcon from "assets/icons/stock.webp";
import { getTreeRecoveryTimeForDisplay } from "features/game/events/landExpansion/chop";
import { getStoneRecoveryTimeForDisplay } from "features/game/events/landExpansion/stoneMine";
import { getIronRecoveryTimeForDisplay } from "features/game/events/landExpansion/ironMine";
import { getGoldRecoveryTimeForDisplay } from "features/game/events/landExpansion/mineGold";
import { getCrimstoneRecoveryTimeForDisplay } from "features/game/events/landExpansion/mineCrimstone";
import { getSunstoneRecoveryTimeForDisplay } from "features/game/events/landExpansion/mineSunstone";
import { getSaltChargeGenerationTimeForDisplay } from "features/game/events/landExpansion/harvestSalt";
import { getWaterTrapMilliseconds } from "features/game/events/landExpansion/placeWaterTrap";
import { useSelector } from "@xstate/react";
import classNames from "classnames";
import type {
  CommodityName,
  ResourceName,
} from "features/game/types/resources";
import saltNodeStage3 from "assets/buildings/salt/salt_node_stage_3.webp";
import {
  WATER_TRAP,
  type WaterTrapName,
} from "features/game/types/crustaceans";
import type { TranslationKeys } from "lib/i18n/dictionaries/types";

const ICON_SIZE = 13.7;
const NODE_TOOL_ICON_CONTAINER_SIZE = PIXEL_SCALE * (ICON_SIZE + 2);

type CooldownDisplay = {
  nodeLabel: string;
  baseSeconds: number;
  recoverySeconds: number;
  boostsUsed: { name: BoostName; value: string }[];
  image?: string;
};

type GuideNodeWithRecovery = {
  nodeName?: ResourceName;
  nodeImage?: string;
  nodeIconWidth?: number;
  showToolIcon?: boolean;
  resourceName?: CommodityName;
  resourceImage?: string;
  resourceLabelKey?: TranslationKeys;
  toolName: WorkbenchToolName;
  getRecovery: (opts: { game: GameState; now: number }) => {
    baseTimeMs: number;
    recoveryTimeMs: number;
    boostsUsed: { name: BoostName; value: string }[];
  };
  recoveryLabelKey: TranslationKeys;
};
const LAND_NODES_WITH_RECOVERY: GuideNodeWithRecovery[] = [
  {
    nodeName: "Tree",
    resourceName: "Wood",
    toolName: "Axe",
    getRecovery: ({ game, now }) =>
      getTreeRecoveryTimeForDisplay({ game, now }),
    recoveryLabelKey: "resource.treeRecoveryTime",
  },
  {
    nodeName: "Stone Rock",
    resourceName: "Stone",
    toolName: "Pickaxe",
    getRecovery: ({ game, now }) =>
      getStoneRecoveryTimeForDisplay({ game, now }),
    recoveryLabelKey: "resource.stoneRecoveryTime",
  },
  {
    nodeName: "Iron Rock",
    resourceName: "Iron",
    toolName: "Stone Pickaxe",
    getRecovery: ({ game, now }) =>
      getIronRecoveryTimeForDisplay({ game, now }),
    recoveryLabelKey: "resource.ironRecoveryTime",
  },
  {
    nodeName: "Gold Rock",
    resourceName: "Gold",
    toolName: "Iron Pickaxe",
    getRecovery: ({ game, now }) =>
      getGoldRecoveryTimeForDisplay({ game, now }),
    recoveryLabelKey: "resource.goldRecoveryTime",
  },
  {
    nodeName: "Crimstone Rock",
    toolName: "Gold Pickaxe",
    resourceName: "Crimstone",
    getRecovery: ({ game, now }) =>
      getCrimstoneRecoveryTimeForDisplay({ game, now }),
    recoveryLabelKey: "resource.crimstoneRecoveryTime",
  },
  {
    nodeName: "Sunstone Rock",
    toolName: "Gold Pickaxe",
    resourceName: "Sunstone",
    getRecovery: ({ game }) => getSunstoneRecoveryTimeForDisplay(game),
    recoveryLabelKey: "resource.sunstoneRecoveryTime",
  },
  {
    nodeName: "Oil Reserve",
    toolName: "Oil Drill",
    resourceName: "Oil",
    getRecovery: ({ game, now }) => getOilRecoveryTimeForDisplay({ game, now }),
    recoveryLabelKey: "resource.oilRecoveryTime",
  },
];

const getWaterTrapRecoveryTimeForDisplay = ({
  game,
  waterTrap,
}: {
  game: GameState;
  waterTrap: WaterTrapName;
}) => {
  const { milliseconds, boostsUsed } = getWaterTrapMilliseconds(
    game,
    waterTrap,
  );

  return {
    baseTimeMs: WATER_TRAP[waterTrap].readyTimeHours * 60 * 60 * 1000,
    recoveryTimeMs: milliseconds,
    boostsUsed,
  };
};

const WATER_NODES_WITH_RECOVERY: GuideNodeWithRecovery[] = [
  {
    nodeImage: ITEM_DETAILS["Crab Pot"].image,
    showToolIcon: false,
    toolName: "Crab Pot",
    resourceImage: ITEM_DETAILS["Blue Crab"].image,
    resourceLabelKey: "crustaceans",
    getRecovery: ({ game }) =>
      getWaterTrapRecoveryTimeForDisplay({ game, waterTrap: "Crab Pot" }),
    recoveryLabelKey: "crustaceans.crabPot",
  },
  {
    nodeImage: ITEM_DETAILS["Mariner Pot"].image,
    showToolIcon: false,
    toolName: "Mariner Pot",
    resourceImage: ITEM_DETAILS["Blue Crab"].image,
    resourceLabelKey: "crustaceans",
    getRecovery: ({ game }) =>
      getWaterTrapRecoveryTimeForDisplay({ game, waterTrap: "Mariner Pot" }),
    recoveryLabelKey: "crustaceans.marinerPot",
  },
  {
    nodeImage: saltNodeStage3,
    nodeIconWidth: ICON_SIZE - 2,
    toolName: "Salt Rake",
    resourceName: "Salt",
    getRecovery: ({ game }) => getSaltChargeGenerationTimeForDisplay({ game }),
    recoveryLabelKey: "resource.saltChargeGenerationTime",
  },
];

export const ToolsGuide: React.FC = () => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const { t } = useAppTranslation();
  const [showBoostsKey, setShowBoostsKey] = useState<string | null>(null);
  // Ticks slowly so a guide left open follows a booster burning down.
  const now = useNow({ live: true, intervalMs: PRE_ACTION_TICK_MS });

  return (
    <InnerPanel className="scrollable max-h-[450px] overflow-y-auto w-full min-w-full">
      <div className="p-1">
        <NoticeboardItems
          items={[
            {
              text: t("toolGuide.landToolsTip"),
              icon: ITEM_DETAILS.Axe.image,
            },
            {
              text: t("toolGuide.levelUpTip"),
              icon: SUNNYSIDE.icons.player,
            },
          ]}
        />
      </div>
      <div className="w-full min-w-full">
        <div className="w-full py-0.5">
          <Label type="default" className="mb-0.5">
            {t("landTools")}
          </Label>
        </div>
        {LAND_NODES_WITH_RECOVERY.map((node, index) => (
          <NodeRow
            key={`${node.toolName}-${node.resourceName}`}
            node={node}
            state={state}
            now={now}
            alternateBg={index % 2 === 0}
            showBoostsKey={showBoostsKey}
            setShowBoostsKey={setShowBoostsKey}
          />
        ))}
        <div className="w-full pt-2 pb-0">
          <Label type="default">{t("waterTools")}</Label>
        </div>
        {WATER_NODES_WITH_RECOVERY.map((node, index) => (
          <NodeRow
            key={`${node.toolName}-${node.resourceName ?? node.resourceLabelKey}`}
            node={node}
            state={state}
            now={now}
            alternateBg={(index + LAND_NODES_WITH_RECOVERY.length) % 2 === 0}
            showBoostsKey={showBoostsKey}
            setShowBoostsKey={setShowBoostsKey}
          />
        ))}
      </div>
    </InnerPanel>
  );
};

const CELL_CLASS = "py-0 align-middle";

/**
 * What raises a tool's daily stock, mirroring INITIAL_STOCK: a ready Toolshed
 * (+50% on every tool) and the More Axes / More Picks skills (flat, by rank).
 */
const getToolStockBoosts = (state: GameState, tool: WorkbenchToolName) => {
  const boosts: { name: BoostName; value: string }[] = [];

  if (isBuildingReady(state.buildings.Toolshed ?? [])) {
    boosts.push({ name: "Toolshed", value: "+50%" });
  }

  const moreAxesLevel = getSkillLevel(state.bumpkin.skills, "More Axes");
  if (tool === "Axe" && moreAxesLevel) {
    const bonus = SKILL_RANKS["More Axes"].ranks.Axe[moreAxesLevel - 1];
    if (bonus) boosts.push({ name: "More Axes", value: `+${bonus}` });
  }

  const morePicksLevel = getSkillLevel(state.bumpkin.skills, "More Picks");
  const morePicksRanks = SKILL_RANKS["More Picks"].ranks as Partial<
    Record<WorkbenchToolName, readonly number[]>
  >;
  const morePicksBonus = morePicksLevel
    ? morePicksRanks[tool]?.[morePicksLevel - 1]
    : undefined;
  if (morePicksBonus) {
    boosts.push({ name: "More Picks", value: `+${morePicksBonus}` });
  }

  return boosts;
};

const StockAmount: React.FC<{ amount: string }> = ({ amount }) => (
  <div className="flex items-center">
    <img
      src={stockIcon}
      className="w-3 mr-1 flex-shrink-0"
      alt={translate("restock")}
    />
    <span className="text-xs">{amount}</span>
  </div>
);

/** The tool's daily stock; when boosted, the base is struck through. */
const StockCell: React.FC<{
  toolName: WorkbenchToolName;
  boostsKey: string;
  showBoostsKey: string | null;
  setShowBoostsKey: (key: string | null) => void;
  state: GameState;
}> = ({ toolName, boostsKey, showBoostsKey, setShowBoostsKey, state }) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const stock = INITIAL_STOCK(state)[toolName];
  const baseStock = INITIAL_STOCK()[toolName];
  const boosts = getToolStockBoosts(state, toolName);
  // Only a raised stock counts: the tutorial cap can lower it below the base.
  const isBoosted = stock.greaterThan(baseStock) && boosts.length > 0;

  if (!isBoosted) return <StockAmount amount={stock.toString()} />;

  return (
    <button
      ref={anchorRef}
      type="button"
      className="flex items-center cursor-pointer relative"
      aria-expanded={showBoostsKey === boostsKey}
      aria-label={`${getTranslatedItemName(toolName)}: ${translate("restock")} ${stock.toString()}. ${translate("boosts")}`}
      onClick={(e) => {
        e.stopPropagation();
        setShowBoostsKey(showBoostsKey === boostsKey ? null : boostsKey);
      }}
    >
      <StockAmount amount={stock.toString()} />
      <img
        src={SUNNYSIDE.icons.lightning}
        className="w-3 mx-1 flex-shrink-0"
        alt=""
      />
      <span className="text-xxs line-through">{baseStock.toString()}</span>
      <BoostsDisplay
        boosts={boosts}
        show={showBoostsKey === boostsKey}
        state={state}
        onClick={() =>
          setShowBoostsKey(showBoostsKey === boostsKey ? null : boostsKey)
        }
        className="-translate-x-1/2"
        portalAlign="center"
        anchorRef={anchorRef}
      />
    </button>
  );
};

const NodeToolIcon: React.FC<{
  nodeIcon?: string;
  toolIcon?: string;
  nodeIconWidth?: number;
}> = ({ nodeIcon, toolIcon, nodeIconWidth = ICON_SIZE }) => {
  if (!nodeIcon && !toolIcon) {
    return null;
  }
  return (
    <div
      className="relative flex flex-shrink-0 items-center justify-center"
      style={{
        width: NODE_TOOL_ICON_CONTAINER_SIZE,
        height: NODE_TOOL_ICON_CONTAINER_SIZE,
      }}
    >
      {nodeIcon && <SquareIcon icon={nodeIcon} width={nodeIconWidth} />}
      {toolIcon && (
        <img
          src={toolIcon}
          className="absolute right-0 bottom-0 w-4 object-contain"
          alt=""
        />
      )}
    </div>
  );
};

interface NodeRowProps {
  node: GuideNodeWithRecovery;
  state: GameState;
  /** Snapshot taken when the guide opened; the projection is relative to it. */
  now: number;
  alternateBg?: boolean;
  showBoostsKey: string | null;
  setShowBoostsKey: (key: string | null) => void;
}

const CooldownCell: React.FC<{
  cooldown: CooldownDisplay;
  toolName: WorkbenchToolName;
  showBoostsKey: string | null;
  setShowBoostsKey: (key: string | null) => void;
  state: GameState;
}> = ({ cooldown, toolName, showBoostsKey, setShowBoostsKey, state }) => {
  const { t } = useAppTranslation();
  const anchorRef = useRef<HTMLDivElement>(null);
  const boostsKey = `${toolName}-${cooldown.nodeLabel}`;
  // Named boosts are the ones the popover can itemise; a live speed window has
  // no name attached to it, so it shortens the time without making the cell
  // clickable.
  const hasNamedBoosts = cooldown.boostsUsed.length > 0;
  const hasBoosts = isPreActionBoosted({
    displaySeconds: cooldown.recoverySeconds,
    baseSeconds: cooldown.baseSeconds,
    hasNamedBoosts,
  });

  const recoveryTimeStr = secondsToString(cooldown.recoverySeconds, {
    length: hasBoosts ? "medium" : "short",
  });
  const baseTimeStr = secondsToString(cooldown.baseSeconds, {
    length: hasBoosts ? "medium" : "short",
  });

  if (hasBoosts) {
    return (
      <div
        ref={anchorRef}
        className={classNames("flex items-center gap-1.5 relative", {
          "cursor-pointer": hasNamedBoosts,
        })}
        onClick={(e) => {
          if (!hasNamedBoosts) return;
          e.stopPropagation();
          setShowBoostsKey(showBoostsKey === boostsKey ? null : boostsKey);
        }}
      >
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center">
            <img
              src={SUNNYSIDE.icons.lightning}
              className="w-3 mr-1 flex-shrink-0"
              alt=""
            />
            <span className="text-xs">
              {cooldown.recoverySeconds > 0 ? recoveryTimeStr : t("instant")}
            </span>
          </div>
          {cooldown.baseSeconds > 0 && (
            <div className="flex items-center">
              <img
                src={SUNNYSIDE.icons.stopwatch}
                className="w-3 mr-1 flex-shrink-0"
                alt=""
              />
              <span className="text-xxs line-through">{baseTimeStr}</span>
            </div>
          )}
        </div>
        <BoostsDisplay
          boosts={cooldown.boostsUsed}
          show={hasNamedBoosts && showBoostsKey === boostsKey}
          state={state}
          onClick={() =>
            setShowBoostsKey(showBoostsKey === boostsKey ? null : boostsKey)
          }
          className="right-0 left-auto"
          anchorRef={anchorRef}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        <img
          src={SUNNYSIDE.icons.stopwatch}
          className="w-3 mr-1 flex-shrink-0"
          alt=""
        />
        <span className="text-xs">{recoveryTimeStr}</span>
      </div>
    </div>
  );
};

const NodeRow: React.FC<NodeRowProps> = ({
  node,
  state,
  now,
  alternateBg,
  showBoostsKey,
  setShowBoostsKey,
}) => {
  const { baseTimeMs, recoveryTimeMs, boostsUsed } = node.getRecovery({
    game: state,
    now,
  });

  // A live speed window (hourglass / totem / shrine) is NOT folded into
  // recoveryTimeMs — it applies over the recovery instead. Project the real
  // "drill now → ready in X", which credits only the part of the recovery the
  // booster still covers.
  const windows = node.nodeName
    ? getNodeBoostWindows(state, node.nodeName)
    : [];
  // The windowed boosters aren't in `boostsUsed` (they apply over the recovery
  // rather than being baked into it), so name them for the boost panel with the
  // time each one actually saves.
  const windowedBoosts = getBoostContributionEntries({
    contributions: node.nodeName
      ? getNodeBoostContributions(state, node.nodeName, now)
      : [],
    seconds: recoveryTimeMs / 1000,
    at: now,
    formatSeconds: (seconds) => secondsToString(seconds, { length: "medium" }),
  });
  const allBoostsUsed = [...boostsUsed, ...windowedBoosts];
  const { displaySeconds } = getPreActionDisplay({
    seconds: recoveryTimeMs / 1000,
    baseSeconds: baseTimeMs / 1000,
    namedBoostCount: allBoostsUsed.length,
    windows,
    at: now,
  });

  const resourceName = node.resourceName
    ? getTranslatedItemName(node.resourceName)
    : node.resourceLabelKey
      ? translate(node.resourceLabelKey)
      : "";
  const resourceImage = node.resourceName
    ? ITEM_DETAILS[node.resourceName].image
    : node.resourceImage;

  const cooldown: CooldownDisplay = {
    nodeLabel: translate(node.recoveryLabelKey),
    baseSeconds: baseTimeMs / 1000,
    recoverySeconds: displaySeconds,
    boostsUsed: allBoostsUsed,
  };

  const nodeIcon = node.nodeName
    ? ITEM_DETAILS[node.nodeName]?.image
    : node.nodeImage;
  const toolIcon =
    node.showToolIcon === false
      ? undefined
      : ITEM_DETAILS[node.toolName]?.image;

  return (
    <div
      className={classNames("flex w-full min-w-full gap-1.5", {
        "bg-brown-100": alternateBg,
      })}
    >
      <div className={classNames(CELL_CLASS, "flex items-center")}>
        <NodeToolIcon
          nodeIcon={nodeIcon}
          nodeIconWidth={node.nodeIconWidth}
          toolIcon={toolIcon}
        />
      </div>
      <div
        className={classNames(CELL_CLASS, "flex-1 min-w-0 flex items-center")}
      >
        {resourceImage && (
          <img
            src={resourceImage}
            className="w-4 mr-1 flex-shrink-0"
            alt={resourceName}
          />
        )}
        <p className="text-xs">{resourceName}</p>
      </div>
      <div
        className={classNames(
          CELL_CLASS,
          "w-24 flex-shrink-0 flex items-center",
        )}
      >
        <StockCell
          toolName={node.toolName}
          boostsKey={`${node.toolName}-${resourceName}-stock`}
          showBoostsKey={showBoostsKey}
          setShowBoostsKey={setShowBoostsKey}
          state={state}
        />
      </div>
      <div
        className={classNames(
          CELL_CLASS,
          "flex-[1] sm:flex-[2] min-w-0 flex items-center justify-start",
        )}
      >
        <CooldownCell
          cooldown={cooldown}
          toolName={node.toolName}
          showBoostsKey={showBoostsKey}
          setShowBoostsKey={setShowBoostsKey}
          state={state}
        />
      </div>
    </div>
  );
};
