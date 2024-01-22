import React, { useState } from "react";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { PIXEL_SCALE, TEST_FARM } from "features/game/lib/constants";

import { Modal } from "react-bootstrap";
import { Tab } from "components/ui/Tab";
import { SUNNYSIDE } from "assets/sunnyside";
import { SquareIcon } from "components/ui/SquareIcon";

// Section Icons
import { Fish } from "./pages/Fish";
import {
  CodexCategory,
  CodexCategoryName,
  CodexTabIndex,
} from "features/game/types/codex";
import { MilestoneReached } from "./components/MilestoneReached";
import { MilestoneName } from "features/game/types/milestones";
import { Flowers } from "./pages/Flowers";
import { hasFeatureAccess } from "lib/flags";

interface Props {
  show: boolean;
  onHide: () => void;
}

export const categories: CodexCategory[] = [
  {
    name: "Fish",
    icon: SUNNYSIDE.icons.fish,
  },
  {
    name: "Flowers",
    icon: SUNNYSIDE.icons.expression_confused,
  },
  {
    name: "Farming",
    icon: SUNNYSIDE.icons.basket,
    disabled: true,
  },
  {
    name: "Bumpkins",
    icon: SUNNYSIDE.icons.player,
    disabled: true,
  },
  {
    name: "Treasures",
    icon: SUNNYSIDE.decorations.treasure_chest,
    disabled: true,
  },
  {
    name: "Season",
    icon: SUNNYSIDE.icons.stopwatch,
    disabled: true,
  },
];

export function getCodexCategoryIndex(category: CodexCategoryName) {
  return categories.findIndex((c) => c.name === category);
}

export const Codex: React.FC<Props> = ({ show, onHide }) => {
  const [currentTab, setCurrentTab] = useState<CodexTabIndex>(0);
  const [showMilestoneReached, setShowMilestoneReached] = useState(false);
  const [milestoneName, setMilestoneName] = useState<MilestoneName>();

  const handleTabClick = (index: CodexTabIndex) => {
    setCurrentTab(index);
  };

  const handleMilestoneReached = (milestoneName: MilestoneName) => {
    setMilestoneName(milestoneName);
    setShowMilestoneReached(true);
  };

  const handleCloseMilestoneReached = () => {
    setShowMilestoneReached(false);
    setMilestoneName(undefined);
  };

  return (
    <div className="flex justify-center">
      <Modal centered show={show} onHide={onHide}>
        <div
          className="h-[600px] transition-opacity"
          style={
            {
              // opacity: showMilestoneReached ? 0.6 : 1,
            }
          }
        >
          {/* Header */}
          <OuterPanel className="flex flex-col h-full">
            <div className="flex items-center pl-1 mb-2">
              <div className="flex items-center grow">
                <img src={SUNNYSIDE.icons.search} className="h-6 mr-3 ml-1" />
                <p>Sunflower Land Codex</p>
              </div>
              <img
                src={SUNNYSIDE.icons.close}
                className="float-right cursor-pointer z-20 ml-3"
                onClick={onHide}
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                }}
              />
            </div>
            <div
              className="relative h-full overflow-hidden"
              style={{
                paddingLeft: `${PIXEL_SCALE * 15}px`,
              }}
            >
              {/* Tabs */}
              <div className="absolute top-4 left-0">
                <div className="flex flex-col">
                  {categories.map((tab, index) => (
                    <Tab
                      key={`${tab}-${index}`}
                      isFirstTab={index === 0}
                      className="flex items-center relative"
                      isActive={currentTab === index}
                      onClick={() => handleTabClick(index)}
                      vertical
                      disabled={tab.disabled}
                    >
                      <SquareIcon icon={tab.icon} width={7} />
                    </Tab>
                  ))}
                </div>
              </div>
              {/* Content */}
              <InnerPanel className="flex flex-col h-full overflow-y-auto scrollable">
                {currentTab === 0 && (
                  <Fish onMilestoneReached={handleMilestoneReached} />
                )}
                {currentTab === 1 && hasFeatureAccess(TEST_FARM, "FLOWERS") && (
                  <Flowers onMilestoneReached={handleMilestoneReached} />
                )}
              </InnerPanel>
            </div>
          </OuterPanel>
        </div>
        <div
          className="absolute h-full w-full bg-black transition-opacity pointer-events-none"
          style={{
            opacity: showMilestoneReached ? 0.4 : 0,
          }}
        />
        {showMilestoneReached && (
          <div className="absolute w-full sm:w-5/6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <MilestoneReached
              milestoneName={milestoneName as MilestoneName}
              onClose={handleCloseMilestoneReached}
            />
          </div>
        )}
      </Modal>

      {/* <Modal
        show={showMilestoneReached}
        centered
        className="flex justify-center"
      ></Modal> */}
    </div>
  );
};
