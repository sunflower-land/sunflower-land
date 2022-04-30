import React, { useContext, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { AnnouncementContext } from "./AnnouncementQueueProvider";
import { AnnouncementItems } from "./components/AnnouncementItems";

import { fetchAnnouncements } from "./lib/announcements";

interface Props {
  show: boolean;
}

export const AnnouncementManager: React.FC<Props> = ({ show }) => {
  const { setAnnouncements, setShowAnnouncements, showAnnouncements } =
    useContext(AnnouncementContext);

  const [allAnnouncementsLoaded, setAllAnnouncementsLoaded] =
    useState<boolean>(false);
  const [showAnnouncementsOnMount, setShowAnnouncementsOnMount] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleHide = () => {
    setShowAnnouncements(false);
    setShowAnnouncementsOnMount(false);
  };

  // Query announcements to show on mount
  useEffect(() => {
    (async function () {
      const newAnnouncements = await fetchAnnouncements();
      setAnnouncements(newAnnouncements);
      // Only force-show announcements when there's new ones the player hasn't yet seen
      setShowAnnouncementsOnMount(newAnnouncements.length > 0);
    })();
  }, []);

  // Also, query announcements whenever user explicitly requests (i.e. 'News' button)
  useEffect(() => {
    if (!showAnnouncements || allAnnouncementsLoaded) {
      return;
    }
    (async function () {
      setIsLoading(true);
      const allAnnouncements = await fetchAnnouncements(true);
      setAnnouncements(allAnnouncements);
      setAllAnnouncementsLoaded(true);
      setIsLoading(false);
    })();
  }, [showAnnouncements]);

  const shouldShowAnnouncements = showAnnouncements || showAnnouncementsOnMount;

  return (
    <Modal
      centered
      scrollable
      size="lg"
      show={show && shouldShowAnnouncements}
      onHide={handleHide}
    >
      <AnnouncementItems isLoading={isLoading} onClose={handleHide} />
    </Modal>
  );
};
