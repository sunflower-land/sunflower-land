import React from "react";
import { useSelector } from "@xstate/react";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { useGame } from "features/game/GameProvider";

import { NPC_WEARABLES } from "lib/npcs";
import { getKeys } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import { Message } from "features/farming/mail/components/Message";
import { ConversationName } from "features/game/types/announcements";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";

const _announcements = (state: MachineState) => state.context.announcements;
const _mailbox = (state: MachineState) => state.context.state.mailbox;
const _isMailbox = (state: MachineState) => state.matches("mailbox");
export const NewMail: React.FC = () => {
  const { gameService } = useGame();
  const isMailbox = useSelector(gameService, _isMailbox);

  const announcements = useSelector(gameService, _announcements);
  const mailbox = useSelector(gameService, _mailbox);
  const { t } = useAppTranslation();
  const newestMailId = getKeys(announcements ?? {})
    // Ensure they haven't read it already
    .sort(
      (a, b) =>
        (announcements[b].announceAt ?? 0) - (announcements[a].announceAt ?? 0),
    )
    .find((id) => {
      return !mailbox.read.find((message) => message.id === id);
    });

  const details = newestMailId ? announcements[newestMailId] : undefined;

  return (
    <Modal show={isMailbox} onHide={() => gameService.send("ACKNOWLEDGE")}>
      {details ? (
        <Panel bumpkinParts={NPC_WEARABLES[details.from]}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm capitalize ml-1 underline">{details.from}</p>
            <img
              src={SUNNYSIDE.icons.close}
              className="h-6 mr-2 cursor-pointer"
              onClick={() => gameService.send("ACKNOWLEDGE")}
            />
          </div>

          <Message
            message={announcements[newestMailId as ConversationName]}
            conversationId={newestMailId as ConversationName}
            read={!!mailbox.read.find((item) => item.id === newestMailId)}
            onAcknowledge={() => gameService.send("ACKNOWLEDGE")}
            onClose={() => gameService.send("ACKNOWLEDGE")}
          />
        </Panel>
      ) : (
        <CloseButtonPanel onClose={() => gameService.send("ACKNOWLEDGE")}>
          <div>{t("no.mail")}</div>
        </CloseButtonPanel>
      )}
    </Modal>
  );
};
