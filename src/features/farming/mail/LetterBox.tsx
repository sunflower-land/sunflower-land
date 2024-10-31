import React, { useCallback, useContext, useState } from "react";
import { Modal } from "components/ui/Modal";

import { PIXEL_SCALE } from "features/game/lib/constants";
import mailboxImg from "assets/decorations/mailbox.png";

import classNames from "classnames";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { Mail } from "./components/Mail";
import { Message } from "./components/Message";
import { OuterPanel, Panel } from "components/ui/Panel";
import { NPC_WEARABLES } from "lib/npcs";
import { getKeys } from "features/game/types/craftables";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import letterDisc from "assets/icons/letter_disc.png";
import letter from "assets/icons/letter.png";
import { MachineState } from "features/game/lib/gameMachine";
import { PWAInstallMessage } from "./components/PWAInstallMessage";
import { useIsPWA } from "lib/utils/hooks/useIsPWA";
import { WhatsOn } from "./components/WhatsOn";

const _announcements = (state: MachineState) => state.context.announcements;
const _mailbox = (state: MachineState) => state.context.state.mailbox;

export const LetterBox: React.FC = () => {
  const { gameService, showAnimations } = useContext(Context);
  const [tab, setTab] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>();
  const isPWA = useIsPWA();

  const announcements = useSelector(gameService, _announcements);
  const mailbox = useSelector(gameService, _mailbox);

  const { t } = useAppTranslation();
  const close = () => {
    setSelected(undefined);
    setIsOpen(false);
  };

  const hasAnnouncement = getKeys(announcements ?? {})
    // Ensure they haven't read it already
    .some((id) => !mailbox.read.find((message) => message.id === id));

  const Content = useCallback(() => {
    if (selected) {
      const details = announcements[selected];

      return (
        <Panel bumpkinParts={NPC_WEARABLES[details.from]}>
          <div className="flex items-center mb-1 p-1">
            <img
              src={SUNNYSIDE.icons.arrow_left}
              className="mr-2 cursor-pointer"
              style={{
                width: `${PIXEL_SCALE * 11}px`,
              }}
              onClick={() => setSelected(undefined)}
            />
            <p className="text-sm capitalize ml-1 underline">{details.from}</p>
          </div>

          {selected === "pwa-install-prompt" && !isPWA ? (
            <PWAInstallMessage
              message={details}
              conversationId={selected}
              read={!!mailbox.read.find((item) => item.id === selected)}
              onAcknowledge={close}
            />
          ) : (
            <Message
              message={details}
              conversationId={selected}
              read={!!mailbox.read.find((item) => item.id === selected)}
              onClose={close}
            />
          )}
        </Panel>
      );
    }

    return (
      <CloseButtonPanel
        onClose={close}
        tabs={[
          { icon: letter, name: t("mailbox") },
          { icon: SUNNYSIDE.icons.stopwatch, name: t("mailbox.whatsOn") },
        ]}
        currentTab={tab}
        setCurrentTab={setTab}
        container={OuterPanel}
      >
        {tab === 0 && (
          <Mail setSelected={setSelected} announcements={announcements} />
        )}
        {tab === 1 && <WhatsOn />}
      </CloseButtonPanel>
    );
  }, [selected, announcements, tab]);

  return (
    <>
      <div
        className="absolute cursor-pointer hover:img-highlight group"
        id="letterbox"
        onClick={() => setIsOpen(true)}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          height: `${PIXEL_SCALE * 16}px`,
        }}
      >
        {hasAnnouncement && (
          <img
            src={letterDisc}
            className={
              "absolute z-20 cursor-pointer group-hover:img-highlight" +
              (showAnimations ? " animate-pulsate" : "")
            }
            style={{
              width: `${PIXEL_SCALE * 18}px`,
              top: `${PIXEL_SCALE * -14}px`,
              left: `${PIXEL_SCALE * 0}px`,
            }}
          />
        )}

        <img
          src={mailboxImg}
          className={classNames("absolute pointer-events-none")}
          style={{
            width: `${PIXEL_SCALE * 8}px`,
            top: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 4}px`,
          }}
        />
      </div>
      <Modal show={isOpen} onHide={close}>
        <Content />
      </Modal>
    </>
  );
};
