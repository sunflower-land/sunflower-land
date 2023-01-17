import React from "react";

import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Message } from "../types/message";

import { PAST_ANNOUNCEMENTS } from "features/announcements/announcementsStorage";
import { Announcement } from "features/announcements/Announcement";

interface Props {
  inbox: Message[];
  isLoading: boolean;
}

export const Inbox: React.FC<Props> = ({ inbox, isLoading }) => {
  return (
    <OuterPanel className="relative">
      {isLoading ? (
        <InnerPanel>
          <span className="loading">Loading</span>
        </InnerPanel>
      ) : inbox.length ? (
        <div className="text-sm mt-2 text-shadow text-break divide-y-2 divide-dashed divide-brown-600 max-h-[27rem] overflow-y-auto scrollable">
          {PAST_ANNOUNCEMENTS.map((announcement, index) => (
            <Announcement key={index} announcement={announcement} />
          ))}
        </div>
      ) : (
        <InnerPanel>No messages</InnerPanel>
      )}
    </OuterPanel>
  );
};
