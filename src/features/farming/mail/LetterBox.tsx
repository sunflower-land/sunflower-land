import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";

import { PIXEL_SCALE } from "features/game/lib/constants";
import mailbox from "assets/decorations/mailbox.png";
import classNames from "classnames";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { Mail } from "./components/Mail";
import {
  ConversationName,
  CONVERSATIONS,
} from "features/game/types/conversations";
import { Conversation } from "./components/Conversation";
import { Panel } from "components/ui/Panel";
import { NPC_WEARABLES } from "lib/npcs";
import { getKeys } from "features/game/types/craftables";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const LetterBox: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [tab, setTab] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const [selected, setSelected] = useState<string>();

  const announcements = gameState.context.announcements;
  const { t } = useAppTranslation();
  const close = () => {
    setIsOpen(false);
  };

  const hasAnnouncement = getKeys(gameState.context.announcements ?? {})
    // Ensure they haven't read it already
    .some(
      (id) =>
        !gameState.context.state.mailbox.read.find(
          (message) => message.id === id
        )
    );

  const Content = () => {
    if (selected) {
      const details =
        CONVERSATIONS[selected as ConversationName] ?? announcements[selected];
      return (
        <Panel bumpkinParts={NPC_WEARABLES[details.from]}>
          <div className="flex items-center mb-1">
            <img
              src={SUNNYSIDE.icons.arrow_left}
              className="h-6 mr-2 cursor-pointer"
              onClick={() => setSelected(undefined)}
            />
            <p className="text-sm capitalize ml-1 underline">{details.from}</p>
          </div>

          <Conversation
            conversationId={selected as ConversationName}
            read={
              !!gameState.context.state.mailbox.read.find(
                (item) => item.id === selected
              )
            }
          />
        </Panel>
      );
    }

    return (
      <CloseButtonPanel
        onClose={close}
        tabs={[{ icon: SUNNYSIDE.icons.expression_chat, name: t("bumpkinBuzz") }]}
        currentTab={tab}
        setCurrentTab={setTab}
      >
        <Mail setSelected={setSelected} />
      </CloseButtonPanel>
    );
  };
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
        {hasAnnouncement && (
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
          className={classNames("absolute pointer-events-none")}
          style={{
            width: `${PIXEL_SCALE * 8}px`,
            top: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 4}px`,
          }}
        />
      </div>
      <Modal centered show={isOpen} onHide={close}>
        <Content />
      </Modal>
    </>
  );
};
