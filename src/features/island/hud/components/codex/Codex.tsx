import React, { useState } from "react";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CodexCategory, CodexCategoryName, CodexTabIndex } from "./types";
import { Modal } from "react-bootstrap";
import { Tab } from "components/ui/Tab";
import { SUNNYSIDE } from "assets/sunnyside";
import { SquareIcon } from "components/ui/SquareIcon";

// Section Icons
import mutantIcon from "assets/icons/mutants.webp";
import { MyFarm } from "./pages/MyFarm";
import { Mutants } from "./pages/Mutants";
import { Guide } from "features/helios/components/hayseedHank/components/Guide";
import { GuidePath } from "features/helios/components/hayseedHank/lib/guide";

interface Props {
  show: boolean;
  onHide: () => void;
}

export const categories: CodexCategory[] = [
  {
    name: "My Farm",
    icon: SUNNYSIDE.icons.player_small,
  },
  {
    name: "Guide",
    icon: SUNNYSIDE.icons.expression_confused,
  },
  {
    name: "Mutants",
    icon: mutantIcon,
  },
  {
    name: "Fish",
    icon: SUNNYSIDE.icons.fish,
  },
];

export function getCodexCategoryIndex(category: CodexCategoryName) {
  return categories.findIndex((c) => c.name === category);
}

export const Codex: React.FC<Props> = ({ show, onHide }) => {
  const [currentTab, setCurrentTab] = useState<CodexTabIndex>(0);
  const [guide, setGuide] = useState<GuidePath>();

  const handleTabClick = (index: CodexTabIndex) => {
    setCurrentTab(index);
  };

  const handleOpenGuide = (guide: GuidePath) => {
    setCurrentTab(1);
    setGuide(guide);
  };

  return (
    <Modal centered show={show} onHide={onHide}>
      <div className="h-[600px]">
        {/* Header */}
        <OuterPanel className="flex flex-col h-full">
          <div className="flex items-center pl-1 mb-2">
            <div className="grow">Sunflower Land Journal</div>
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
            <div className="absolute top-0 left-0">
              <div className="flex flex-col">
                {categories.map((tab, index) => (
                  <Tab
                    key={`${tab}-${index}`}
                    isFirstTab={index === 0}
                    className="flex items-center relative"
                    isActive={currentTab === index}
                    onClick={() => handleTabClick(index)}
                    vertical
                  >
                    <SquareIcon icon={tab.icon} width={7} />
                  </Tab>
                ))}
              </div>
            </div>
            {/* Content */}
            <InnerPanel className="flex flex-col h-full overflow-y-auto scrollable">
              {currentTab === 0 && (
                <MyFarm
                  onTabChange={handleTabClick}
                  onOpenGuide={handleOpenGuide}
                />
              )}
              {currentTab === 1 && (
                <Guide onSelect={setGuide} selected={guide} />
              )}
              {currentTab === 2 && <Mutants />}
            </InnerPanel>
          </div>
        </OuterPanel>
      </div>
    </Modal>
  );
};
