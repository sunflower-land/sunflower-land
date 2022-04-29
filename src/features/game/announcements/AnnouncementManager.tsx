import React, { useContext, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { AnnouncementContext } from "./AnnouncementQueueProvider";
import { AnnouncementItems } from "./components/AnnouncementItems";

import { fetchAnnouncements } from "./lib/announcements";

interface Props {
  show: boolean;
}

export const AnnouncementManager: React.FC<Props> = ({ show }) => {
  const { setAnnouncements, showAnnouncements, setShowAnnouncements } =
    useContext(AnnouncementContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [announcementsWereFetched, setAnnouncementsWereFetched] =
    useState<boolean>(false);

  const getAnnouncements = async () => {
    setIsLoading(true);
    const fetchedAnnoucements = await fetchAnnouncements(setAnnouncements);
    setIsLoading(false);
    setAnnouncementsWereFetched(true);
    // TODO - fix this part
    // If any announcements were fetched, then automatically display the announcement modal
    setShowAnnouncements(fetchedAnnoucements.length > 0);
  };

  useEffect(() => {
    getAnnouncements();
  }, []);

  return (
    <Modal
      centered
      scrollable
      size="lg"
      show={show && showAnnouncements}
      onHide={() => setShowAnnouncements(false)}
    >
      <AnnouncementItems
        isLoading={isLoading}
        onClose={() => setShowAnnouncements(false)}
      />
    </Modal>
  );
};
