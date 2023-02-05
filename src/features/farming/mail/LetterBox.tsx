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
import { FocussedMail, Letter, Mail } from "./Mail";

export const LetterBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [focussedMail, setFocussedMail] = useState<Letter>();

  const [tab, setTab] = useState(0);

  const close = () => {
    acknowledgeRead();
    setIsOpen(false);
  };

  const hasUnread = hasAnnouncements();

  if (focussedMail) {
    return (
      <FocussedMail
        letter={focussedMail}
        onClose={() => {
          setFocussedMail(undefined);
          setIsOpen(false);
        }}
      />
    );
  }

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
        <CloseButtonPanel
          currentTab={tab}
          setCurrentTab={setTab}
          tabs={[
            {
              icon: SUNNYSIDE.icons.expression_chat,
              name: "Mail",
            },
            {
              icon: SUNNYSIDE.icons.expression_chat,
              name: "News",
            },
          ]}
          onClose={close}
        >
          {tab === 0 && <Mail onOpen={(letter) => setFocussedMail(letter)} />}
          {tab === 1 && (
            <div className="text-sm mt-2 text-break divide-y-2 divide-dashed divide-brown-600 max-h-[27rem] overflow-x-hidden overflow-y-auto scrollable p-1">
              {PAST_ANNOUNCEMENTS.map((announcement, index) => (
                <Announcement key={index} announcement={announcement} />
              ))}
            </div>
          )}
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
