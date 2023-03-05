import React from "react";
import { Announcement as IAnnouncement } from "features/announcements";
import { Label } from "components/ui/Label";
import { SquareIcon } from "components/ui/SquareIcon";

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
    <span className="block mb-1 text-xxs">
      {announcement.date.toDateString()}
    </span>

    {/* Title */}
    <span className="block mb-3 text-base">{announcement.title}</span>

    {/* Notes */}
    <ul className="mt-2">
      {announcement.notes.map((note, index) => (
        <li key={index} className="text-xs mb-3 flex">
          <div className="flex">
            {note.icon && (
              <div className="flex justify-start items-start mr-2">
                <SquareIcon icon={note.icon} width={10} />
              </div>
            )}
            <div className="flex-1">
              <p>{note.text}</p>
              <div className="flex mt-1 items-center">
                {note.date && (
                  <Label type="info" className="mr-2">
                    {note.date.toLocaleString()}
                  </Label>
                )}
                {note.link && (
                  <a
                    target="_blank"
                    className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500"
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
        className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500"
      >
        Read more
      </a>
    )}
  </div>
);
