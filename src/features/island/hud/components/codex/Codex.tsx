import React, { useState } from "react";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CodexCategory, CodexTabIndex } from "./types";
import { Modal } from "react-bootstrap";
import { Tab } from "components/ui/Tab";
import { SUNNYSIDE } from "assets/sunnyside";
import { SquareIcon } from "components/ui/SquareIcon";

// Section Icons
import mutantIcon from "assets/icons/mutants.webp";
import { MyFarm } from "./pages/MyFarm";
import { Mutants } from "./pages/Mutants";

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
    name: "Fish",
    icon: SUNNYSIDE.icons.heart,
  },
  {
    name: "Mutants",
    icon: mutantIcon,
  },
  // {
  //   name: "Guide",
  //   icon: SUNNYSIDE.icons.expression_confused,
  // },
];

export const Codex: React.FC<Props> = ({ show, onHide }) => {
  const [currentTab, setCurrentTab] = useState<CodexTabIndex>(0);

  const handleTabClick = (index: CodexTabIndex) => {
    setCurrentTab(index);
  };

  const { component: SelectedComponent } = categories[currentTab as number];

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
            className="relative h-full"
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
            <InnerPanel className="h-full">
              {currentTab === 0 && <MyFarm />}
              {currentTab === 1 && <div></div>}
              {currentTab === 1 && <Mutants />}
            </InnerPanel>
          </div>
        </OuterPanel>
      </div>
    </Modal>
  );
};
