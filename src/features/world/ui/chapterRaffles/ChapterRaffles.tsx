import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useState } from "react";
import prizesIcon from "assets/icons/raffle_icon.png";
import choresIcon from "assets/icons/chores.webp";
import { UpcomingRaffles } from "./UpcomingRaffles";
import { RaffleHistory } from "features/world/ui/chapterRaffles/RaffleHistory";

export const ChapterRaffles: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [tab, setTab] = useState<"raffles" | "history">("raffles");
  return (
    <CloseButtonPanel
      onClose={onClose}
      currentTab={tab}
      setCurrentTab={setTab}
      tabs={[
        {
          id: "raffles",
          name: "Raffles",
          icon: prizesIcon,
        },
        {
          id: "history",
          name: "History",
          icon: choresIcon,
        },
      ]}
    >
      {tab === "raffles" && <UpcomingRaffles />}
      {tab === "history" && <RaffleHistory />}
    </CloseButtonPanel>
  );
};
