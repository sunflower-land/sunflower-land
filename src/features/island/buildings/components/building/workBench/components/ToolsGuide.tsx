import React, { useContext, useRef, useState } from "react";
import { InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
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
import { PIXEL_SCALE } from "features/game/lib/constants";
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
  getRecovery: (opts: { game: GameState }) => {
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
    getRecovery: ({ game }) => getTreeRecoveryTimeForDisplay({ game }),
    recoveryLabelKey: "resource.treeRecoveryTime",
  },
  {
    nodeName: "Stone Rock",
    resourceName: "Stone",
    toolName: "Pickaxe",
    getRecovery: ({ game }) => getStoneRecoveryTimeForDisplay({ game }),
    recoveryLabelKey: "resource.stoneRecoveryTime",
  },
  {
    nodeName: "Iron Rock",
    resourceName: "Iron",
    toolName: "Stone Pickaxe",
    getRecovery: ({ game }) => getIronRecoveryTimeForDisplay({ game }),
    recoveryLabelKey: "resource.ironRecoveryTime",
  },
  {
    nodeName: "Gold Rock",
    resourceName: "Gold",
    toolName: "Iron Pickaxe",
    getRecovery: ({ game }) => getGoldRecoveryTimeForDisplay({ game }),
    recoveryLabelKey: "resource.goldRecoveryTime",
  },
  {
    nodeName: "Crimstone Rock",
    toolName: "Gold Pickaxe",
    resourceName: "Crimstone",
    getRecovery: ({ game }) => getCrimstoneRecoveryTimeForDisplay({ game }),
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
    getRecovery: ({ game }) => getOilRecoveryTimeForDisplay({ game }),
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
        ref={anchorRef}
        className="flex items-center cursor-pointer gap-1.5 relative"
        onClick={(e) => {
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
          show={showBoostsKey === boostsKey}
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
  alternateBg,
  showBoostsKey,
  setShowBoostsKey,
}) => {
  const { baseTimeMs, recoveryTimeMs, boostsUsed } = node.getRecovery({
    game: state,
  });

  const resourceName = node.resourceName
    ? (ITEM_DETAILS[node.resourceName]?.translatedName ?? node.resourceName)
    : node.resourceLabelKey
      ? translate(node.resourceLabelKey)
      : "";
  const resourceImage = node.resourceName
    ? ITEM_DETAILS[node.resourceName].image
    : node.resourceImage;

  const cooldown: CooldownDisplay = {
    nodeLabel: translate(node.recoveryLabelKey),
    baseSeconds: baseTimeMs / 1000,
    recoverySeconds: recoveryTimeMs / 1000,
    boostsUsed,
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
