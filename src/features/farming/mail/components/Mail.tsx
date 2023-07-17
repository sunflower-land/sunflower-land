import { useActor } from "@xstate/react";
import { OuterPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import {
  CONVERSATIONS,
  ConversationName,
} from "features/game/types/conversations";
import React, { useContext } from "react";
import { NPCFixed } from "features/island/bumpkin/components/NPC";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getKeys } from "features/game/types/craftables";
import chest from "assets/icons/chest.png";

interface Props {
  setSelected: (name?: string) => void;
}
export const Mail: React.FC<Props> = ({ setSelected }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  let ids = gameState.context.state.mailbox.read.map((item) => item.id);
  const announcements = gameState.context.announcements;
  const announcementIds: string[] = getKeys(announcements)
    // Ensure they haven't read it already
    .filter((id) => !ids.find((readId) => readId === id));

  console.log({ announcementIds });
  ids = [...announcementIds, ...ids];
  if (ids.length === 0) {
    return <p>No mail</p>;
  }

  const open = (id: string) => {
    setSelected(id);

    const read = gameState.context.state.mailbox.read.find(
      (item) => item.id === id
    );

    const details = CONVERSATIONS[id as ConversationName] ?? announcements[id];

    if (!read && !details.reward) {
      gameService.send("message.read", {
        id,
      });
    }
  };

  return (
    <div>
      {ids.map((id) => {
        console.log({ id });
        const details =
          CONVERSATIONS[id as ConversationName] ?? announcements[id];

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
