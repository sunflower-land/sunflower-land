import React, { useEffect, useState } from "react";
import { NPC_WEARABLES, acknowledgeNPC } from "lib/npcs";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import {
  getCurrentSeason,
  getSeasonalTicket,
} from "features/game/types/seasons";
import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
}
export const Birdie: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();

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
            text: `${t(
              "birdieplaza.earnTicketsVariety"
            )} ${getSeasonalTicket()} ${t(
              "birdieplaza.earnTicketsVariety.two"
            )}`, //Translate
          },
          {
            text: `${t("birdieplaza.commonMethod")} ${getSeasonalTicket()} ${t(
              "birdieplaza.commonMethod.two"
            )}`, //Translate
          },
          {
            text: `${t(
              "birdieplaza.choresAndRewards"
            )} ${getSeasonalTicket()} ${t("birdieplaza.choresAndRewards.two")}`, //Translate
          },
          {
            text: `${t(
              "birdieplaza.gatherAndCraft"
            )} ${getSeasonalTicket()} ${t("birdieplaza.gatherAndCraft.two")}`, //Translate
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
            text: translate("birdieplaza.craftItems"),
            actions: [
              {
                text: `${t(
                  "birdieplaza.howToEarnTickets"
                )} ${getSeasonalTicket()}?`,
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
          text: `${t("birdieplaza.currentSeason")} ${getCurrentSeason()} ${t(
            "birdieplaza.currentSeason.two"
          )} ${getSeasonalTicket()}`,
        },
        {
          text: `${t("birdieplaza.collectTickets")} ${getSeasonalTicket()} ${t(
            "birdieplaza.collectTickets.two"
          )}`,
          actions: [
            {
              text: translate("birdieplaza.whatIsSeason"),
              cb: () => setShowSeasonHelp(true),
            },
            {
              text: `${t(
                "birdieplaza.howToEarnTickets"
              )} ${getSeasonalTicket()}?`,
              cb: () => setShowFeatherHelp(true),
            },
          ],
        },
      ]}
    />
  );
};
