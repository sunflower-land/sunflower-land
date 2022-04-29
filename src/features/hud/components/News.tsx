import React, { useContext } from "react";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import { AnnouncementContext } from "features/game/announcements/AnnouncementQueueProvider";
import { fetchAnnouncements } from "features/game/announcements/lib/announcements";

export const News: React.FC = () => {
  const { setAnnouncements, setShowAnnouncements } =
    useContext(AnnouncementContext);

  const handleNewsClick = () => {
    setShowAnnouncements(true);
    fetchAnnouncements(setAnnouncements, true);
  };

  return (
    <OuterPanel className="fixed bottom-2 left-2 z-50 p-1 flex items-center shadow-lg cursor-pointer">
      <Button onClick={handleNewsClick}>
        <span className="text-white text-sm text-shadow ml-2">News</span>
      </Button>
    </OuterPanel>
  );
};
