import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Panel } from "../../../components/ui/Panel";
import { Equipped } from "features/game/types/bumpkin";
import { Tab } from "components/ui/Tab";
import { SquareIcon } from "components/ui/SquareIcon";
import { SUNNYSIDE } from "assets/sunnyside";

export interface PanelTabs {
  icon: string;
  name: string;
}

interface Props {
  tabs?: PanelTabs[];
  currentTab?: number;
  setCurrentTab?: React.Dispatch<React.SetStateAction<number>>;
  title?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
  bumpkinParts?: Partial<Equipped>;
}

/**
 * A custom panel built for the game.
 * @tabs The tabs of the panel.
 * @currentTab The current selected tab index of the panel. Default is 0.
 * @setCurrentTab Dispatch method to set the current selected tab index.
 * @title The panel title.
 * @showCloseButton Whether to show the close button for the panel or not. Default is true.
 * @onClose The close panel method.
 * @showCloseButton Whether to show the back button for the panel or not. Default is true.
 * @onClose The back button method.
 * @bumpkinParts The list of bumpkin parts for the modal.
 * @children The panel children content.
 */
export const CloseButtonPanel: React.FC<Props> = ({
  tabs,
  currentTab = 0,
  setCurrentTab,
  title,
  showCloseButton = true,
  onClose,
  showBackButton = false,
  onBack,
  bumpkinParts,
  children,
}) => {
  const handleTabClick = (index: number) => {
    setCurrentTab && setCurrentTab(index);
  };

  return (
    <Panel className="relative" bumpkinParts={bumpkinParts} hasTabs={!!tabs}>
      {/* Tabs */}
      {tabs && (
        <div
          className="absolute flex"
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            left: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={`tab-${index}`}
              isFirstTab={index === 0}
              className="flex items-center"
              isActive={currentTab === index}
              onClick={() => handleTabClick(index)}
            >
              <SquareIcon icon={tab.icon} width={7} />
              <span className="text-xs sm:text-sm overflow-hidden text-ellipsis ml-1 p-1">
                {tab.name}
              </span>
            </Tab>
          ))}
          <div className="grow" />
          {showCloseButton && (
            <img
              src={SUNNYSIDE.icons.close}
              className="flex-none cursor-pointer"
              onClick={onClose}
              style={{
                width: `${PIXEL_SCALE * 11}px`,
                height: `${PIXEL_SCALE * 11}px`,
                marginTop: `${PIXEL_SCALE * 1}px`,
                marginLeft: `${PIXEL_SCALE * 2}px`,
                marginRight: `${PIXEL_SCALE * 1}px`,
              }}
            />
          )}
        </div>
      )}

      {/* Content */}
      <div>
        {title && (
          <div className="flex text-center">
            {(showCloseButton || showBackButton) && !tabs && (
              <div
                className="flex-none"
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                }}
              >
                {showBackButton && (
                  <img
                    src={SUNNYSIDE.icons.arrow_left}
                    className="cursor-pointer"
                    onClick={onBack}
                    style={{
                      width: `${PIXEL_SCALE * 11}px`,
                    }}
                  />
                )}
              </div>
            )}
            <div className="grow mb-3 text-lg">{title}</div>
            {(showCloseButton || showBackButton) && !tabs && (
              <div className="flex-none">
                {showCloseButton && (
                  <img
                    src={SUNNYSIDE.icons.close}
                    className="cursor-pointer"
                    onClick={onClose}
                    style={{
                      width: `${PIXEL_SCALE * 11}px`,
                    }}
                  />
                )}
              </div>
            )}
          </div>
        )}
        {children}
        {showCloseButton && !tabs && !title && (
          <img
            src={SUNNYSIDE.icons.close}
            className="absolute cursor-pointer z-20"
            onClick={onClose}
            style={{
              top: `${PIXEL_SCALE * 4}px`,
              right: `${PIXEL_SCALE * 4}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        )}
      </div>
    </Panel>
  );
};
