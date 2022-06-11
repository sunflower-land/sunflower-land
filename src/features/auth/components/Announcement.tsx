import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { announcements } from "features/announcements";
import fence from "assets/land/goblin_fence.png";
import { useShowScrollbar } from "lib/utils/hooks/useShowScrollbar";
import classNames from "classnames";

const CONTENT_HEIGHT = 400;
export const Announcement: React.FC = () => {
  const { ref: itemContainerRef, showScrollbar } =
    useShowScrollbar(CONTENT_HEIGHT);
  const { gameService } = useContext(Context);

  const storedDate = localStorage.getItem("announcementLastRead");

  function onAcknowledge() {
    gameService.send("ACKNOWLEDGE");
  }

  const filtered = storedDate
    ? announcements.filter(
        (announcement) => announcement.date > new Date(storedDate)
      )
    : announcements;

  // Sort latest first
  filtered.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    filtered && (
      <div
        ref={itemContainerRef}
        style={{ maxHeight: CONTENT_HEIGHT }}
        className={classNames("overflow-y-auto", {
          scrollable: showScrollbar,
        })}
      >
        <p className="flex flex-col items-center text-2xl mb-4">
          {`What's new!`}
        </p>

        {filtered.map((announcement, index) => (
          <div className="flex flex-col items-center" key={index}>
            {/* Title */}
            <span className="text-center mb-2">{announcement.title}</span>

            {/* Date */}
            <p className="text-center text-xs mb-3">
              {announcement.date.toLocaleDateString()}
            </p>

            {/* Description */}
            <span className="text-center mb-2">{announcement.description}</span>

            {/* Links */}
            {announcement.link && (
              <a href={announcement.link} target="_blank" rel="noreferrer">
                Read more
              </a>
            )}

            {/* Image */}
            {announcement.image && (
              <img
                src={announcement.image}
                className="w-28"
                alt={announcement.title}
              />
            )}
            {/* Fence */}
            <div className="flex flex-row mb-3">
              <img src={fence} alt={announcement.title} className="w-28" />
              <img src={fence} alt={announcement.title} className="w-28" />
            </div>
          </div>
        ))}
        <Button onClick={() => onAcknowledge()}>Continue farming</Button>
      </div>
    )
  );
};
