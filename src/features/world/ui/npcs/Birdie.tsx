import React, { useEffect, useState } from "react";
import { NPC_WEARABLES, acknowledgeNPC } from "lib/npcs";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import {
  getCurrentChapter,
  getChapterTicket,
} from "features/game/types/chapters";
import { translate } from "lib/i18n/translate";

interface Props {
  onClose: () => void;
}
export const Birdie: React.FC<Props> = ({ onClose }) => {
  const [showTicketHelp, setShowTicketHelp] = useState(false);
  const [showSeasonHelp, setShowSeasonHelp] = useState(false);

  useEffect(() => {
    acknowledgeNPC("birdie");
  }, []);

  if (showTicketHelp) {
    return (
      <SpeakingModal
        key="tickets"
        onClose={() => {
          onClose();
        }}
        bumpkinParts={NPC_WEARABLES.birdie}
        message={[
          {
            text: translate("birdieplaza.earnTicketsVariety", {
              chapterTicket: getChapterTicket(),
            }),
          },
          {
            text: translate("birdieplaza.commonMethod", {
              chapterTicket: getChapterTicket(),
            }),
          },
          {
            text: translate("birdieplaza.choresAndRewards", {
              chapterTicket: getChapterTicket(),
            }),
          },
          {
            text: translate("birdieplaza.gatherAndCraft", {
              chapterTicket: getChapterTicket(),
            }),
          },
        ]}
      />
    );
  }

  if (showSeasonHelp) {
    return (
      <SpeakingModal
        onClose={() => {
          onClose();
        }}
        bumpkinParts={NPC_WEARABLES.birdie}
        key="season"
        message={[
          {
            text: translate("birdieplaza.newSeasonIntro"),
          },
          {
            text: translate("birdieplaza.seasonQuests"),
          },
          {
            text: translate("birdieplaza.craftItems", {
              chapterTicket: getChapterTicket(),
            }),
            actions: [
              {
                text: translate("birdieplaza.howToEarnTickets", {
                  chapterTicket: getChapterTicket(),
                }),
                cb: () => setShowTicketHelp(true),
              },
            ],
          },
        ]}
      />
    );
  }

  return (
    <SpeakingModal
      onClose={() => {
        onClose();
        acknowledgeNPC("pumpkin' pete");
      }}
      bumpkinParts={NPC_WEARABLES.birdie}
      message={[
        {
          text: translate("birdieplaza.birdieIntro"),
        },
        {
          text: translate("birdieplaza.admiringOutfit"),
        },
        {
          text: translate("birdieplaza.currentSeason", {
            currentSeason: getCurrentChapter(),
            chapterTicket: getChapterTicket(),
          }),
        },
        {
          text: translate("birdieplaza.collectTickets", {
            chapterTicket: getChapterTicket(),
          }),
          actions: [
            {
              text: translate("birdieplaza.whatIsSeason"),
              cb: () => setShowSeasonHelp(true),
            },
            {
              text: translate("birdieplaza.howToEarnTickets", {
                chapterTicket: getChapterTicket(),
              }),
              cb: () => setShowTicketHelp(true),
            },
          ],
        },
      ]}
    />
  );
};
