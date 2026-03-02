import { useSelector } from "@xstate/react";
import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import React, { useContext } from "react";
import { NPCFixed } from "features/island/bumpkin/components/NPC";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getKeys } from "features/game/types/craftables";
import giftIcon from "assets/icons/gift.png";
import letter from "assets/icons/letter.png";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Announcements } from "features/game/types/announcements";
import classNames from "classnames";
import { MachineState } from "features/game/lib/gameMachine";

const _mailboxRead = (state: MachineState) => state.context.state.mailbox.read;

interface Props {
  setSelected: (name?: string) => void;
  announcements: Announcements;
}
export const Mail: React.FC<Props> = ({ setSelected, announcements }) => {
  const { gameService } = useContext(Context);
  const mailboxRead = useSelector(gameService, _mailboxRead);

  const { t } = useAppTranslation();

  let ids = mailboxRead.map((item) => item.id);

  const announcementIds: string[] = getKeys(announcements)
    // ensure they haven't read it already
    .filter((id) => !ids.find((readId) => readId === id));

  ids = [...announcementIds, ...ids];
  if (ids.length === 0) {
    return (
      <InnerPanel className="flex items-center justify-center flex-col">
        <img
          src={letter}
          className="my-2"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
          }}
        />
        <p className="mb-2 text-sm">{t("no.mail")}</p>
      </InnerPanel>
    );
  }

  const open = (id: string) => {
    setSelected(id);

    const read = mailboxRead.find((item) => item.id === id);

    const details = announcements[id];

    if (!read && !details.reward) {
      gameService.send({ type: "message.read", id });
    }
  };

  return (
    <InnerPanel>
      {ids.map((id) => {
        const details = announcements[id];

        // Message was removed
        if (!details) {
          return null;
        }

        const isRead = mailboxRead.find((item) => item.id === id);

        const showUnreadDot = !isRead && !details.reward;
        const showGiftIcon = !isRead && !!details.reward;

        return (
          <ButtonPanel
            key={id}
            onClick={() => open(id)}
            className="flex cursor-pointer hover:bg-brown-200 mb-1 relative"
          >
            <div className="h-10 mr-2">
              <NPCFixed
                width={PIXEL_SCALE * 16}
                parts={NPC_WEARABLES[details.from as NPCName]}
              />
            </div>
            <div>
              <p
                className={classNames("text-sm", {
                  "mr-4": showUnreadDot,
                  "mr-10": showGiftIcon,
                })}
              >
                {details.headline}
              </p>
              <p className="text-xs capitalize underline">{details.from}</p>
            </div>
            {showUnreadDot && (
              <div className="bg-blue-500 border-1 border-white w-3 h-3 rounded-full absolute right-1 top-1" />
            )}
            {showGiftIcon && (
              <div className="absolute flex items-center h-full top-0 right-1">
                <img
                  src={giftIcon}
                  style={{
                    width: `${PIXEL_SCALE * 12}px`,
                  }}
                />
              </div>
            )}
          </ButtonPanel>
        );
      })}
    </InnerPanel>
  );
};
