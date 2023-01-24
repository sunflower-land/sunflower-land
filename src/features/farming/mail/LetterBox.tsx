import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import { PIXEL_SCALE } from "features/game/lib/constants";
import mailbox from "assets/decorations/mailbox.png";
import classNames from "classnames";
import {
  acknowledgeRead,
  hasAnnouncements,
  PAST_ANNOUNCEMENTS,
} from "features/announcements/announcementsStorage";
import { Announcement } from "features/announcements/Announcement";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";

export const LetterBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => {
    acknowledgeRead();
    setIsOpen(false);
  };

  const hasUnread = hasAnnouncements();

  return (
    <>
      <div
        className="absolute cursor-pointer hover:img-highlight"
        id="letterbox"
        onClick={() => setIsOpen(true)}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          height: `${PIXEL_SCALE * 16}px`,
        }}
      >
        {hasUnread && (
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className="absolute animate-float pointer-events-none z-20"
            style={{
              width: `${PIXEL_SCALE * 4}px`,
              top: `${PIXEL_SCALE * -12}px`,
              left: `${PIXEL_SCALE * 6}px`,
            }}
          />
        )}

        <img
          src={mailbox}
          className={classNames("absolute pointer-events-none", {
            "img-highlight-heavy": hasUnread,
          })}
          style={{
            width: `${PIXEL_SCALE * 8}px`,
            top: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 4}px`,
          }}
        />
      </div>
      <Modal centered show={isOpen} onHide={close}>
        <CloseButtonPanel title="Announcements" onClose={close}>
          <div className="text-sm mt-2 text-break divide-y-2 divide-dashed divide-brown-600 max-h-[27rem] overflow-x-hidden overflow-y-auto scrollable p-1">
            {PAST_ANNOUNCEMENTS.map((announcement, index) => (
              <Announcement key={index} announcement={announcement} />
            ))}
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
