import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import mailbox from "assets/decorations/mailbox.png";
import alerted from "assets/icons/expression_alerted.png";
import classNames from "classnames";
import {
  acknowledgeRead,
  hasAnnouncements,
  PAST_ANNOUNCEMENTS,
} from "features/announcements/announcementsStorage";
import { Announcement } from "features/announcements/Announcement";
import { Panel } from "components/ui/Panel";

export const LetterBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => {
    acknowledgeRead();
    setIsOpen(false);
  };

  const hasUnread = hasAnnouncements();

  return (
    <div
      className="absolute"
      id="letterbox"
      style={{
        top: `${PIXEL_SCALE * -1}px`,
        right: `${PIXEL_SCALE * 1}px`,
        width: `${GRID_WIDTH_PX}px`,
      }}
    >
      {hasUnread && (
        <img
          src={alerted}
          className="w-3 absolute  animate-float"
          style={{
            width: `${PIXEL_SCALE * 3}px`,
            top: `${PIXEL_SCALE * -12}px`,
            left: `${PIXEL_SCALE * 2}px`,
          }}
        />
      )}

      <img
        src={mailbox}
        className={classNames(
          "absolute cursor-pointer hover:img-highlight left-0 right-0",
          {
            "img-highlight-heavy": hasUnread,
          }
        )}
        style={{
          width: `${PIXEL_SCALE * 8}px`,
        }}
        onClick={() => setIsOpen(true)}
      />

      <Modal centered show={isOpen} onHide={close}>
        <Panel>
          <div className="text-sm mt-2 text-shadow text-break divide-y-2 divide-dashed divide-brown-600 max-h-[27rem] overflow-y-auto scrollable p-1">
            {PAST_ANNOUNCEMENTS.map((announcement, index) => (
              <Announcement key={index} announcement={announcement} />
            ))}
          </div>
        </Panel>
      </Modal>
    </div>
  );
};
