import React, { useEffect, useState } from "react";
import { NPC_WEARABLES, acknowledgeNPC } from "lib/npcs";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import {
  getCurrentSeason,
  getSeasonalTicket,
} from "features/game/types/seasons";
import { translate } from "lib/i18n/translate";

interface Props {
  onClose: () => void;
}
export const Birdie: React.FC<Props> = ({ onClose }) => {
  const [showFeatherHelp, setShowFeatherHelp] = useState(false);
  const [showSeasonHelp, setShowSeasonHelp] = useState(false);

  useEffect(() => {
    acknowledgeNPC("birdie");
  }, []);

  if (showFeatherHelp) {
    return (
      <SpeakingModal
        key="feathers"
        onClose={() => {
          onClose();
        }}
        bumpkinParts={NPC_WEARABLES.birdie}
        message={[
          {
            text: translate("birdieplaza.earnTicketsVariety", {
              seasonalTicket: getSeasonalTicket(),
            }),
          },
          {
            text: translate("birdieplaza.commonMethod", {
              seasonalTicket: getSeasonalTicket(),
            }),
          },
          {
            text: translate("birdieplaza.choresAndRewards", {
              seasonalTicket: getSeasonalTicket(),
            }),
          },
          {
            text: translate("birdieplaza.gatherAndCraft", {
              seasonalTicket: getSeasonalTicket(),
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
              seasonalTicket: getSeasonalTicket(),
            }),
            actions: [
              {
                text: translate("birdieplaza.howToEarnTickets", {
                  seasonalTicket: getSeasonalTicket(),
                }),
                cb: () => setShowFeatherHelp(true),
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
            currentSeason: getCurrentSeason(),
            seasonalTicket: getSeasonalTicket(),
          }),
        },
        {
          text: translate("birdieplaza.collectTickets", {
            seasonalTicket: getSeasonalTicket(),
          }),
          actions: [
            {
              text: translate("birdieplaza.whatIsSeason"),
              cb: () => setShowSeasonHelp(true),
            },
            {
              text: translate("birdieplaza.howToEarnTickets", {
                seasonalTicket: getSeasonalTicket(),
              }),
              cb: () => setShowFeatherHelp(true),
            },
          ],
        },
      ]}
    />
  );
};
