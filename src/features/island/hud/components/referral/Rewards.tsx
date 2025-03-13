import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useState } from "react";
import giftIcon from "assets/icons/gift.png";
import { DailyRewardContent } from "../../../../game/expansion/components/dailyReward/DailyReward";
import { SUNNYSIDE } from "assets/sunnyside";
import { TaskBoard } from "./TaskBoard";

interface Props {
  show: boolean;
  onHide: () => void;
}

export const Rewards: React.FC<Props> = ({ show, onHide }) => {
  const [tab, setTab] = useState<number>(0);

  return (
    <Modal show={show} onHide={onHide}>
      <CloseButtonPanel
        tabs={[
          { icon: SUNNYSIDE.ui.board, name: "Task Board" },
          { icon: SUNNYSIDE.decorations.treasure_chest, name: "Daily Reward" },
          { icon: giftIcon, name: "Rewards Shop" },
        ]}
        currentTab={tab}
        setCurrentTab={setTab}
      >
        {tab === 0 && <TaskBoard />}
        {tab === 1 && <DailyRewardContent onClose={onHide} />}
        {/* {tab === 2 && <RewardsShop />} */}
      </CloseButtonPanel>
    </Modal>
  );
};
