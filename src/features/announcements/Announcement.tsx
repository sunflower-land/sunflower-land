import React, { useContext } from "react";
import { Context } from "features/game/GameProvider";
import { Announcement as IAnnouncement } from "features/announcements";
import { useShowScrollbar } from "lib/utils/hooks/useShowScrollbar";
import classNames from "classnames";
import { getAnnouncements } from "./announcementsStorage";
import close from "assets/icons/close.png";

const CONTENT_HEIGHT = 400;

export const Announcements: React.FC = () => {
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
        <div className="flex justify-between items-center mb-2 px-2">
          <p className="text-sm">{`What's new!`}</p>
          <img
            src={close}
            className="h-6 cursor-pointer"
            onClick={onAcknowledge}
          />
        </div>

        <div
          ref={itemContainerRef}
          style={{ maxHeight: CONTENT_HEIGHT }}
          className={classNames("overflow-y-auto p-2 divide-brown-600", {
            scrollable: showScrollbar,
          })}
        >
          {announcements.map((announcement, index) => (
            <div className="mb-10" key={index}>
              <Announcement key={index} announcement={announcement} />
            </div>
          ))}
        </div>
      </>
    )
  );
};

export const Announcement: React.FC<{ announcement: IAnnouncement }> = ({
  announcement,
}) => (
  <div className="py-4 first:!pt-0 last:!pb-0">
    {/* Image */}
    {announcement.image && (
      <img
        src={announcement.image}
        className="w-full rounded-sm mb-1"
        alt={announcement.title}
      />
    )}

    {/* Date */}
    <span className="block mb-1 text-xs">
      {announcement.date.toDateString()}
    </span>

    {/* Title */}
    <span className="block underline mb-1 text-sm">{announcement.title}</span>

    {/* Notes */}
    <ul className="list-disc ml-2 mt-1">
      {announcement.notes.map((note, index) => (
        <li key={index} className="text-xs mb-1">
          {note}
        </li>
      ))}
    </ul>

    {/* Links */}
    {announcement.link && (
      <a
        href={announcement.link}
        target="_blank"
        rel="noreferrer"
        className="text-xs"
      >
        Read more
      </a>
    )}
  </div>
);
