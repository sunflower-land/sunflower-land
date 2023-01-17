import React, { useContext } from "react";
import { Context } from "features/game/GameProvider";
import { Announcement as IAnnouncement } from "features/announcements";
import { acknowledgeRead, getAnnouncements } from "./announcementsStorage";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";

const CONTENT_HEIGHT = 400;

export const Announcements: React.FC = () => {
  const { gameService } = useContext(Context);

  function onAcknowledge() {
    acknowledgeRead();
    gameService.send("ACKNOWLEDGE");
  }

  const announcements = getAnnouncements();

  return (
    true && (
      <>
        <div className="flex justify-between items-center mb-2 px-2">
          <p className="text-sm">{`What's new!`}</p>
          <img
            src={SUNNYSIDE.icons.close}
            className="absolute cursor-pointer z-20"
            onClick={onAcknowledge}
            style={{
              top: `${PIXEL_SCALE * 6}px`,
              right: `${PIXEL_SCALE * 6}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </div>

        <div
          style={{ maxHeight: CONTENT_HEIGHT }}
          className="overflow-y-auto p-2 divide-brown-600 scrollable"
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
        className="w-full rounded-lg mb-1 object-contain"
        alt={announcement.title}
        style={{
          maxHeight: "10rem",
        }}
      />
    )}

    {/* Date */}
    <span className="block mb-1 text-xs">
      {announcement.date.toDateString()}
    </span>

    {/* Title */}
    <span className="block underline mb-1 text-sm">{announcement.title}</span>

    {/* Notes */}
    <ul className="mt-2">
      {announcement.notes.map((note, index) => (
        <li key={index} className="text-xs mb-3 flex">
          <div className="flex">
            {note.icon && (
              <div className="w-10 flex justify-start items-start">
                <img src={note.icon} className="w-6" />
              </div>
            )}
            <div className="flex-1">
              <p>{note.text}</p>
              <div className="flex mt-1 items-center">
                {note.date && (
                  <p className="text-xxs mr-2">{note.date.toLocaleString()}</p>
                )}
                {note.link && (
                  <a
                    target="_blank"
                    className="underline text-xxs"
                    href={note.link.url}
                    rel="noreferrer"
                  >
                    {note.link.text}
                  </a>
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>

    {/* Links */}
    {announcement.link && (
      <a
        href={announcement.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs"
      >
        Read more
      </a>
    )}
  </div>
);
