import React, { useContext, useRef, useState } from "react";
import { InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { Label } from "components/ui/Label";
import { WorkbenchToolName } from "features/game/types/tools";
import { SquareIcon } from "components/ui/SquareIcon";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { GameState, BoostName } from "features/game/types/game";
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

type ResourceLabelKey =
  | "resource.treeRecoveryTime"
  | "resource.stoneRecoveryTime"
  | "resource.ironRecoveryTime"
  | "resource.goldRecoveryTime"
  | "resource.crimstoneRecoveryTime"
  | "resource.sunstoneRecoveryTime"
  | "resource.oilRecoveryTime";

type CooldownDisplay = {
  nodeLabel: string;
  baseSeconds: number;
  recoverySeconds: number;
  boostsUsed: { name: BoostName; value: string }[];
  image?: string;
};

type LandNodeWithRecovery = {
  nodeName: ResourceName;
  resourceName: CommodityName;
  toolName: WorkbenchToolName;
  getRecovery: (opts: { game: GameState }) => {
    baseTimeMs: number;
    recoveryTimeMs: number;
    boostsUsed: { name: BoostName; value: string }[];
  };
  resourceLabelKey: ResourceLabelKey;
};
const LAND_NODES_WITH_RECOVERY: LandNodeWithRecovery[] = [
  {
    nodeName: "Tree",
    resourceName: "Wood",
    toolName: "Axe",
    getRecovery: ({ game }) => getTreeRecoveryTimeForDisplay({ game }),
    resourceLabelKey: "resource.treeRecoveryTime",
  },
  {
    nodeName: "Stone Rock",
    resourceName: "Stone",
    toolName: "Pickaxe",
    getRecovery: ({ game }) => getStoneRecoveryTimeForDisplay({ game }),
    resourceLabelKey: "resource.stoneRecoveryTime",
  },
  {
    nodeName: "Iron Rock",
    resourceName: "Iron",
    toolName: "Stone Pickaxe",
    getRecovery: ({ game }) => getIronRecoveryTimeForDisplay({ game }),
    resourceLabelKey: "resource.ironRecoveryTime",
  },
  {
    nodeName: "Gold Rock",
    resourceName: "Gold",
    toolName: "Iron Pickaxe",
    getRecovery: ({ game }) => getGoldRecoveryTimeForDisplay({ game }),
    resourceLabelKey: "resource.goldRecoveryTime",
  },
  {
    nodeName: "Crimstone Rock",
    toolName: "Gold Pickaxe",
    resourceName: "Crimstone",
    getRecovery: ({ game }) => getCrimstoneRecoveryTimeForDisplay({ game }),
    resourceLabelKey: "resource.crimstoneRecoveryTime",
  },
  {
    nodeName: "Sunstone Rock",
    toolName: "Gold Pickaxe",
    resourceName: "Sunstone",
    getRecovery: ({ game }) => getSunstoneRecoveryTimeForDisplay(game),
    resourceLabelKey: "resource.sunstoneRecoveryTime",
  },
  {
    nodeName: "Oil Reserve",
    toolName: "Oil Drill",
    resourceName: "Oil",
    getRecovery: ({ game }) => getOilRecoveryTimeForDisplay({ game }),
    resourceLabelKey: "resource.oilRecoveryTime",
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
            key={node.nodeName}
            node={node}
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

const CELL_CLASS = "py-0 align-middle";

const ICON_SIZE = 13.7;

const NodeToolIcon: React.FC<{
  nodeIcon?: string;
  toolIcon?: string;
}> = ({ nodeIcon, toolIcon }) => {
  if (!nodeIcon && !toolIcon) {
    return null;
  }
  return (
    <div className="relative flex-shrink-0 p-1">
      {nodeIcon && <SquareIcon icon={nodeIcon} width={ICON_SIZE} />}
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
  node: LandNodeWithRecovery;
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

  const cooldown: CooldownDisplay = {
    nodeLabel: translate(node.resourceLabelKey),
    baseSeconds: baseTimeMs / 1000,
    recoverySeconds: recoveryTimeMs / 1000,
    boostsUsed,
  };

  const nodeIcon = ITEM_DETAILS[node.nodeName]?.image;
  const toolIcon = ITEM_DETAILS[node.toolName]?.image;
  const resourceName =
    ITEM_DETAILS[node.resourceName]?.translatedName ?? node.resourceName;

  return (
    <div
      className={classNames("flex w-full min-w-full gap-1.5", {
        "bg-brown-100": alternateBg,
      })}
    >
      <div className={classNames(CELL_CLASS, "flex items-center")}>
        <NodeToolIcon nodeIcon={nodeIcon} toolIcon={toolIcon} />
      </div>
      <div
        className={classNames(CELL_CLASS, "flex-1 min-w-0 flex items-center")}
      >
        <img
          src={ITEM_DETAILS[node.resourceName].image}
          className="w-4 mr-1 flex-shrink-0"
          alt={resourceName}
        />
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
