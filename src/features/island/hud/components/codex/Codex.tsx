import React, { useContext, useState } from "react";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";

import { Modal } from "components/ui/Modal";
import { SUNNYSIDE } from "assets/sunnyside";
import { SquareIcon } from "components/ui/SquareIcon";

// Section Icons
import { Fish } from "./pages/Fish";
import { CodexCategory } from "features/game/types/codex";
import { MilestoneReached } from "./components/MilestoneReached";
import { MilestoneName } from "features/game/types/milestones";
import { Flowers } from "./pages/Flowers";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Deliveries } from "./pages/Deliveries";
import { Chores } from "./pages/Chores";
import { Label } from "components/ui/Label";
import classNames from "classnames";

interface Props {
  show: boolean;
  onHide: () => void;
}

export const Codex: React.FC<Props> = ({ show, onHide }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [
    {
      context: { state, farmId },
    },
  ] = useActor(gameService);

  const [currentTab, setCurrentTab] = useState<number>(0);
  const [showMilestoneReached, setShowMilestoneReached] = useState(false);
  const [milestoneName, setMilestoneName] = useState<MilestoneName>();

  const handleTabClick = (index: number) => {
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

  const incompleteDeliveries = state.delivery.orders.filter(
    (order) => !order.completedAt
  ).length;

  const incompleteChores = Object.values(state.chores?.chores ?? {}).filter(
    (chore) => !chore.completedAt
  ).length;

  const categories: CodexCategory[] = [
    {
      name: "Deliveries",
      icon: SUNNYSIDE.icons.player,
      count: incompleteDeliveries,
    },
    {
      name: "Chores",
      icon: SUNNYSIDE.icons.hammer,
      count: incompleteChores,
    },
    {
      name: "Fish",
      icon: SUNNYSIDE.icons.fish,
      count: 0,
    },
    {
      name: "Flowers",
      icon: ITEM_DETAILS["Red Pansy"].image,
      count: 0,
    },
  ];

  return (
    <Modal show={show} onHide={onHide} dialogClassName="md:max-w-3xl">
      <div className="h-[500px] relative">
        {/* Header */}
        <OuterPanel className="flex flex-col h-full">
          <div className="flex items-center pl-1 mb-2">
            <div className="flex items-center grow">
              <img src={SUNNYSIDE.icons.search} className="h-6 mr-3 ml-1" />
              <p>{t("sunflowerLandCodex")}</p>
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
              paddingLeft: `${PIXEL_SCALE * 16.5}px`,
            }}
          >
            {/* Tabs */}
            <div className="absolute top-1.5 left-0">
              <div className="flex flex-col">
                {categories.map((tab, index) => (
                  <OuterPanel
                    key={`${tab}-${index}`}
                    className={classNames(
                      "flex items-center relative p-0.5 mb-1 cursor-pointer",
                      {
                        "bg-[#ead4aa]": currentTab === index,
                      }
                    )}
                    onClick={() => handleTabClick(index)}
                  >
                    {!!tab.count && (
                      <Label
                        type="default"
                        className="absolute -top-3 left-3 z-10"
                      >
                        {tab.count}
                      </Label>
                    )}

                    <SquareIcon icon={tab.icon} width={9} />
                  </OuterPanel>
                ))}
              </div>
            </div>
            {/* Content */}
            <InnerPanel className="flex flex-col h-full overflow-y-auto scrollable">
              {currentTab === 0 && <Deliveries />}
              {currentTab === 1 && <Chores />}
              {currentTab === 2 && (
                <Fish onMilestoneReached={handleMilestoneReached} />
              )}
              {currentTab === 3 && (
                <Flowers onMilestoneReached={handleMilestoneReached} />
              )}
            </InnerPanel>
          </div>
        </OuterPanel>
        {showMilestoneReached && (
          <div className="absolute w-full sm:w-5/6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <MilestoneReached
              milestoneName={milestoneName as MilestoneName}
              onClose={handleCloseMilestoneReached}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
