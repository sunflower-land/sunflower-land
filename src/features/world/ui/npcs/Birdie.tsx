import React, { useEffect, useState } from "react";
import { NPC_WEARABLES, acknowledgeNPC } from "lib/npcs";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import {
  getCurrentChapter,
  getChapterTicket,
} from "features/game/types/chapters";
import { translate } from "lib/i18n/translate";
import { useNow } from "lib/utils/hooks/useNow";

interface Props {
  onClose: () => void;
}
export const Birdie: React.FC<Props> = ({ onClose }) => {
  const [showTicketHelp, setShowTicketHelp] = useState(false);
  const [showSeasonHelp, setShowSeasonHelp] = useState(false);
  const now = useNow();
  const chapterTicket = getChapterTicket(now);
  const currentChapter = getCurrentChapter(now);

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
              seasonalTicket: chapterTicket,
            }),
          },
          {
            text: translate("birdieplaza.commonMethod", {
              seasonalTicket: chapterTicket,
            }),
          },
          {
            text: translate("birdieplaza.choresAndRewards", {
              seasonalTicket: chapterTicket,
            }),
          },
          {
            text: translate("birdieplaza.gatherAndCraft", {
              seasonalTicket: chapterTicket,
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
              seasonalTicket: chapterTicket,
            }),
            actions: [
              {
                text: translate("birdieplaza.howToEarnTickets", {
                  seasonalTicket: chapterTicket,
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
            currentSeason: currentChapter,
            seasonalTicket: chapterTicket,
          }),
        },
        {
          text: translate("birdieplaza.collectTickets", {
            seasonalTicket: chapterTicket,
          }),
          actions: [
            {
              text: translate("birdieplaza.whatIsSeason"),
              cb: () => setShowSeasonHelp(true),
            },
            {
              text: translate("birdieplaza.howToEarnTickets", {
                seasonalTicket: chapterTicket,
              }),
              cb: () => setShowTicketHelp(true),
            },
          ],
        },
      ]}
    />
  );
};
