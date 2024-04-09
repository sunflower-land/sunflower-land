import { useActor } from "@xstate/react";
import { OuterPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import React, { useContext } from "react";
import { NPCFixed } from "features/island/bumpkin/components/NPC";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getKeys } from "features/game/types/craftables";
import chest from "assets/icons/chest.png";
import letter from "assets/icons/letter.png";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Announcements } from "features/game/types/announcements";

interface Props {
  setSelected: (name?: string) => void;
  announcements: Announcements;
}
export const Mail: React.FC<Props> = ({ setSelected, announcements }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { t } = useAppTranslation();

  let ids = gameState.context.state.mailbox.read.map((item) => item.id);

  const announcementIds: string[] = getKeys(announcements)
    // Ensure they haven't read it already
    .filter((id) => !ids.find((readId) => readId === id));

  ids = [...announcementIds, ...ids];
  if (ids.length === 0) {
    return (
      <div className="flex items-center justify-center flex-col">
        <img src={letter} className="w-32 my-2" />
        <p className="mb-2 text-sm">{t("no.mail")}</p>
      </div>
    );
  }

  const open = (id: string) => {
    setSelected(id);

    const read = gameState.context.state.mailbox.read.find(
      (item) => item.id === id
    );

    const details = announcements[id];

    if (!read && !details.reward) {
      gameService.send("message.read", {
        id,
      });
    }
  };

  return (
    <div>
      {ids.map((id) => {
        const details = announcements[id];

        // Message was removed
        if (!details) {
          return null;
        }

        const isRead = gameState.context.state.mailbox.read.find(
          (item) => item.id === id
        );
        return (
          <OuterPanel
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
              <p className="text-sm">{details.headline}</p>
              <p className="text-xs capitalize underline">{details.from}</p>
            </div>
            {!isRead && !details.reward && (
              <div className="bg-blue-500 border-1 border-white w-3 h-3 rounded-full absolute right-1 top-1" />
            )}
            {!isRead && !!details.reward && (
              <img
                src={chest}
                className="w-6 animate-pulsate img-highlight-heavy absolute right-1 top-1"
              />
            )}
          </OuterPanel>
        );
      })}
    </div>
  );
};
