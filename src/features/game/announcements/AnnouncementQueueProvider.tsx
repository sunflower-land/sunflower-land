import React, { FC, useState } from "react";

import { createContext } from "react";

export interface Announcement {
  type: "general" | "whats-new";
  title?: string;
  content: string;
  datetimePosted: Date;
}

export type SetAnnouncements = (announcements: Announcement[]) => void;
export type SetShowAnnouncements = (showAnnouncements: boolean) => void;

export const AnnouncementContext = createContext<{
  setAnnouncements: SetAnnouncements;
  setShowAnnouncements: SetShowAnnouncements;
  announcementList: Announcement[];
  showAnnouncements: boolean;
}>({
  setAnnouncements: console.log,
  setShowAnnouncements: console.log,
  announcementList: [],
  showAnnouncements: false,
});

export const AnnouncementProvider: FC = ({ children }) => {
  const [announcementList, setAnnouncementList] = useState<Announcement[]>([]);
  const [showAnnouncements, setDoShowAnnouncements] = useState<boolean>(false);

  const setAnnouncements: SetAnnouncements = (announcements) =>
    setAnnouncementList(announcements);

  const setShowAnnouncements: SetShowAnnouncements = (showAnnouncements) =>
    setDoShowAnnouncements(showAnnouncements);

  return (
    <AnnouncementContext.Provider
      value={{
        setAnnouncements,
        setShowAnnouncements,
        announcementList,
        showAnnouncements,
      }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
};
