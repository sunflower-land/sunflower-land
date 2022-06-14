import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { useShowScrollbar } from "lib/utils/hooks/useShowScrollbar";
import classNames from "classnames";
import { getAnnouncements } from "./announcementsStorage";
import close from "assets/icons/close.png";

const CONTENT_HEIGHT = 400;
export const Announcement: React.FC = () => {
  const { ref: itemContainerRef, showScrollbar } =
    useShowScrollbar(CONTENT_HEIGHT);
  const { gameService } = useContext(Context);

  function onAcknowledge() {
    gameService.send("ACKNOWLEDGE");
  }

  const announcements = getAnnouncements();

  return (
    announcements && (
      <>
        <img
          src={close}
          className="h-6 top-4 right-4 absolute cursor-pointer"
          onClick={onAcknowledge}
        />

        <div
          ref={itemContainerRef}
          style={{ maxHeight: CONTENT_HEIGHT }}
          className={classNames("overflow-y-auto clear-left m-3", {
            scrollable: showScrollbar,
          })}
        >
          <p className="flex flex-col items-center text-lg">{`What's new!`}</p>
          {announcements.map((announcement, index) => (
            <div key={index}>
              {/* Image */}
              {announcement.image && (
                <img
                  src={announcement.image}
                  className="w-28"
                  alt={announcement.title}
                />
              )}

              <div className="flex flex-row">
                <h1 className="self-center">* </h1>

                {/* Title */}
                <span>{announcement.title}:</span>
              </div>

              {/* Description */}
              <span className="text-center text-xs">
                {announcement.description}
              </span>

              {/* Links */}
              {announcement.link && (
                <a
                  href={announcement.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xxs"
                >
                  Read more
                </a>
              )}
            </div>
          ))}
          <Button onClick={() => onAcknowledge()}>Continue farming</Button>
        </div>
      </>
    )
  );
};
