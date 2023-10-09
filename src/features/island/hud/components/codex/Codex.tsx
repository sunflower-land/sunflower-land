import React, { useState } from "react";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CodexTabIndex, categories } from "./types";
import { Modal } from "react-bootstrap";
import { Tab } from "components/ui/Tab";
import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { SquareIcon } from "components/ui/SquareIcon";

interface Props {
  show: boolean;
  onHide: () => void;
}

export const Codex: React.FC<Props> = ({ show, onHide }) => {
  const [currentTab, setCurrentTab] = useState<CodexTabIndex>(0);

  const handleTabClick = (index: CodexTabIndex) => {
    setCurrentTab(index);
  };

  return (
    <Modal size="lg" show={show} onHide={onHide}>
      <div className="h-[500px]">
        <OuterPanel>
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
            className="relative"
            style={{
              paddingLeft: `${PIXEL_SCALE * 15}px`,
            }}
          >
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
            <InnerPanel>
              <div className="flex mb-2 flex-wrap overflow-y-auto scrollable mx-h-80">
                {new Array(100).fill(0).map((_, index) => (
                  <Box key={index} />
                ))}
              </div>
            </InnerPanel>
          </div>
        </OuterPanel>
      </div>
    </Modal>
  );
};
