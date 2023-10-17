import React, { useContext, useEffect, useRef, useState } from "react";
import { getFishByType } from "../utils";
import { FishName, FishType } from "features/game/types/fishing";
import { SimpleBox } from "../SimpleBox";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { OuterPanel } from "components/ui/Panel";
import classNames from "classnames";
import { ResizableBar } from "components/ui/ProgressBar";
import { GameState } from "features/game/types/game";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import {
  BUMPKIN_ITEM_BUFF_LABELS,
  BumpkinItem,
  ITEM_IDS,
} from "features/game/types/bumpkin";
import { Button } from "components/ui/Button";
import chest from "assets/icons/chest.png";

const LABEL_RIGHT_SHIFT_PX = -5 * PIXEL_SCALE;
const LABEL_TOP_SHIFT_PX = -4 * PIXEL_SCALE;

const FISH_BY_TYPE: Record<FishType, FishName[]> = getFishByType();

const MILESTONES = [
  {
    task: "Catch 5 of each basic fish",
    percentageComplete: (analytics: any) => {
      // total number of basic fish
      const totalFishRequired = FISH_BY_TYPE.basic.length * 5;

      // Get total of each basic fish caught with each one capped at 5
      const totalFishCaught = FISH_BY_TYPE.basic.reduce(
        (total, name) => total + Math.min(analytics[`${name} Caught`] ?? 0, 5),
        0
      );

      return Math.min((totalFishCaught / totalFishRequired) * 100, 100);
    },
    reward: {
      item: "Luna's Hat",
      type: "wearable",
    },
  },
  {
    task: "Catch 5 of each advanced fish",
    percentageComplete: (analytics: any) => 100,
    reward: {
      item: "Chef Apron",
      type: "wearable",
    },
  },
  {
    task: "Catch 1 of each expert fish",
    percentageComplete: (analytics: any) =>
      FISH_BY_TYPE.expert.every(
        (name) => (analytics[`${name} Caught`] ?? 0) >= 5
      ),
    reward: {
      item: "Eggplant Onesie",
      type: "wearable",
    },
  },
  {
    task: "Discover all fish",
    percentageComplete: (analytics: any) =>
      [
        ...FISH_BY_TYPE.basic,
        ...FISH_BY_TYPE.advanced,
        ...FISH_BY_TYPE.expert,
      ].every((name) => (analytics[`${name} Caught`] ?? 0) >= 1),
    reward: {
      item: "Mushroom Hat",
      type: "wearable",
    },
  },
  {
    task: "Catch 10 of every fish",
    percentageComplete: (analytics: any) =>
      [
        ...FISH_BY_TYPE.basic,
        ...FISH_BY_TYPE.advanced,
        ...FISH_BY_TYPE.expert,
      ].every((name) => (analytics[`${name} Caught`] ?? 0) >= 10),
    reward: {
      item: "Green Amulet",
      type: "wearable",
    },
  },
];

export const Collapse: React.FC<{
  isExpanded: boolean;
  className?: string;
}> = ({ isExpanded, children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      console.log("setting content height", ref.current);
      setContentHeight(ref.current.clientHeight);
    }
  }, [children]);

  return (
    <div
      className="overflow-hidden transition-all duration-500"
      style={{
        height: isExpanded ? contentHeight : 0,
      }}
    >
      <div className={className} ref={ref}>
        {children}
      </div>
    </div>
  );
};

const Milestone: React.FC<{
  milestone: any;
  isExpanded: boolean;
  analytics: GameState["analytics"];
  onClick: () => void;
}> = ({ milestone, analytics, isExpanded, onClick }) => {
  const percentageComplete = milestone.percentageComplete(analytics);

  const buffLabel =
    BUMPKIN_ITEM_BUFF_LABELS[milestone.reward.item as BumpkinItem]!;

  return (
    <OuterPanel>
      <div
        className="flex p-0.5 justify-between cursor-pointer"
        onClick={percentageComplete < 100 ? onClick : undefined}
      >
        {percentageComplete < 100 && (
          <>
            <div className="space-y-1">
              <p className="text-xxs">{milestone.task}</p>
              <ResizableBar
                type="progress"
                outerDimensions={{
                  width: 60,
                  height: 7,
                }}
                percentage={percentageComplete}
              />
            </div>
            <div
              className={classNames("flex items-center", {
                "transform rotate-180": isExpanded,
              })}
            >
              <img
                style={{
                  width: `${PIXEL_SCALE * 8}px`,
                }}
                src={SUNNYSIDE.icons.indicator}
                alt="Collapse Controller"
              />
            </div>
          </>
        )}
        {percentageComplete === 100 && (
          <>
            <div className="flex items-center space-y-1 mb-1">
              <p className="text-xxs">{milestone.task}</p>
            </div>
            <img
              className="object-scale-down"
              src={SUNNYSIDE.icons.confirm}
              alt="Complete"
            />
          </>
        )}
      </div>
      <Collapse isExpanded={isExpanded} className="space-y-1">
        <div className="flex pt-1">
          <img
            src={getImageUrl(ITEM_IDS[milestone.reward.item as BumpkinItem])}
            className="w-1/3 rounded-md mr-2"
          />
          <div>
            <p className="text-xs mb-2">{milestone.reward.item}</p>
            <Label
              type={buffLabel.labelType}
              icon={buffLabel.boostTypeIcon}
              secondaryIcon={buffLabel.boostedItemIcon}
            >
              {buffLabel.shortDescription}
            </Label>
          </div>
        </div>
        <Button>
          <div className="flex items-center">
            <img src={chest} className="mr-1" />
            <span>Claim reward</span>
          </div>
        </Button>
      </Collapse>
    </OuterPanel>
  );
};

const _analytics = (state: MachineState) => state.context.state.analytics ?? {};

export const Fish: React.FC = () => {
  const { gameService } = useContext(Context);
  const analytics = useSelector(gameService, _analytics);
  const [expandedMilestone, setExpandedMilestone] =
    useState<keyof typeof MILESTONES>();

  const handleMilstoneExpand = (milestoneIndex: keyof typeof MILESTONES) => {
    if (expandedMilestone === milestoneIndex) {
      setExpandedMilestone(undefined);
    } else {
      setExpandedMilestone(milestoneIndex);
    }
  };

  return (
    <div className="space-y-2 mt-1">
      <div className="flex flex-col">
        <h3 className="capitalize pl-1.5 mb-2 text-sm">Milestones</h3>
        <div className="space-y-1.5 px-1.5">
          {MILESTONES.map((milestone, index) => (
            <Milestone
              key={milestone.task}
              milestone={milestone}
              isExpanded={expandedMilestone === index}
              analytics={analytics}
              onClick={() => handleMilstoneExpand(index)}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        {getKeys(FISH_BY_TYPE).map((type) => (
          <div key={type} className="flex flex-col mb-2">
            <h3 className="capitalize pl-1.5 text-sm">{`${type} Fish`}</h3>
            <div className="flex flex-wrap">
              {FISH_BY_TYPE[type].map((name) => (
                <SimpleBox
                  onClick={console.log}
                  key={name}
                  image={SUNNYSIDE.icons.expression_confused}
                >
                  <div
                    id="blah"
                    className="absolute"
                    style={{
                      right: `${LABEL_RIGHT_SHIFT_PX}px`,
                      top: `${LABEL_TOP_SHIFT_PX}px`,
                      pointerEvents: "none",
                    }}
                  >
                    <Label type="default" className="px-0.5 text-xxs">
                      {5}
                    </Label>
                  </div>
                </SimpleBox>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
