import React, { type JSX } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Panel, PanelProps } from "../../../components/ui/Panel";
import { Equipped } from "features/game/types/bumpkin";
import { Tab } from "components/ui/Tab";
import { SquareIcon } from "components/ui/SquareIcon";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { useSound } from "lib/utils/hooks/useSound";

/**
 * @icon The icon of the tab.
 * @name The name of the tab. (Must be translated if using string-based tabs)
 * @id The unique identifier of the tab. (Compulsory for string-based tabs)
 * @unread Whether the tab has unread content.
 * @alert Whether the tab has an alert.
 */
export interface PanelTabs {
  icon: string;
  name: string;
  unread?: boolean;
  alert?: boolean;
}

interface StringPanelTabs extends PanelTabs {
  id: string;
}

interface Props<T extends number | string = number> {
  tabs?: (T extends string ? StringPanelTabs : PanelTabs)[];
  currentTab?: T;
  setCurrentTab?: React.Dispatch<React.SetStateAction<T>>;
  title?: string | JSX.Element;
  secondaryAction?: JSX.Element;
  onClose?: () => void;
  onBack?: () => void;
  bumpkinParts?: Partial<Equipped>;
  className?: string;
  container?: React.FC<PanelProps>;
  children?: React.ReactNode;
}

/**
 * A custom panel built for the game.
 * @tabs The tabs of the panel. When using string-based tabs (T extends string),
 *       each tab must have an 'id' field for reliable identification.
 * @currentTab The current selected tab index or name of the panel. Default is 0.
 * @setCurrentTab Dispatch method to set the current selected tab index or name.
 * @title The panel title.
 * @onClose The close panel method.  Close button will show if this is set.
 * @onBack The back button method.  Back button will show if this is set.
 * @bumpkinParts The list of bumpkin parts for the modal.
 * @className Additional class name for the parent panel.
 * @children The panel children content.
 */
export const CloseButtonPanel = <T extends number | string = number>({
  tabs,
  currentTab = 0 as T,
  setCurrentTab,
  title,
  onClose,
  onBack,
  bumpkinParts,
  secondaryAction,
  className,
  children,
  container: Container = Panel,
}: Props<T>) => {
  const tabSound = useSound("tab");
  const button = useSound("button");

  const handleTabClick = (index: T) => {
    setCurrentTab && setCurrentTab(index);
  };

  const showCloseButton = !!onClose;
  const showBackButton = !!onBack;

  return (
    <Container
      className={classNames(
        "relative max-h-[90vh] overflow-y-auto overflow-x-hidden scrollable",
        className,
      )}
      bumpkinParts={bumpkinParts}
      hasTabs={!!tabs}
    >
      {/* Tabs */}
      {tabs && (
        <div
          className="absolute flex"
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            left: `0px`,
            right: `${PIXEL_SCALE * 1}px`,
          }}
        >
          <div className="flex overflow-x-auto scrollbar-hide mr-auto">
            {tabs.map((tab, index) => (
              <Tab
                key={`tab-${index}`}
                isFirstTab={index === 0}
                className="flex items-center relative mr-1"
                isActive={
                  currentTab ===
                  (typeof currentTab === "number"
                    ? index
                    : (tab as StringPanelTabs).id)
                }
                onClick={() => {
                  tabSound.play();
                  handleTabClick(
                    (typeof currentTab === "number"
                      ? index
                      : (tab as StringPanelTabs).id) as T,
                  );
                }}
              >
                <SquareIcon icon={tab.icon} width={7} />
                <span
                  className={classNames(
                    "text-xs sm:text-sm text-ellipsis ml-1 whitespace-nowrap",
                    {
                      pulse:
                        (typeof currentTab === "number"
                          ? currentTab !== index
                          : currentTab !== (tab as StringPanelTabs).id) &&
                        tab.unread,
                    },
                  )}
                >
                  {tab.name}
                </span>
                {tab.alert && (
                  <img
                    src={SUNNYSIDE.icons.expression_alerted}
                    className="ml-2"
                    style={{
                      width: `${PIXEL_SCALE * 3}px`,
                    }}
                  />
                )}
              </Tab>
            ))}
          </div>

          {secondaryAction && (
            <div
              className="flex-none cursor-pointer float-right"
              style={{
                height: `${PIXEL_SCALE * 11}px`,
                marginTop: `${PIXEL_SCALE * 1}px`,
                marginLeft: `${PIXEL_SCALE * 2}px`,
                marginRight: `${PIXEL_SCALE * 3}px`,
              }}
            >
              {secondaryAction}
            </div>
          )}
          {showCloseButton && (
            <img
              src={SUNNYSIDE.icons.close}
              className="flex-none cursor-pointer float-right"
              onClick={() => {
                onClose();
              }}
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
                    onClick={() => {
                      button.play();
                      onBack();
                    }}
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
        {/* Float button to right so that context text will wrap around it */}
        {showCloseButton && !tabs && !title && (
          <img
            src={SUNNYSIDE.icons.close}
            className="absolute cursor-pointer z-20 top-3 right-3"
            onClick={onClose}
            style={{
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        )}
        {children}
      </div>
    </Container>
  );
};
