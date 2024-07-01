import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useContext } from "react";
import { FACTION_RECRUITERS } from "./JoinFaction";
import { FactionName } from "features/game/types/game";

export function hasReadFactionIntro() {
  return !!localStorage.getItem("faction.intro");
}

function acknowledgeIntro() {
  return localStorage.setItem("faction.intro", new Date().toISOString());
}

interface Props {
  onClose: () => void;
}

export const FactionWelcome: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { t } = useAppTranslation();

  const npc =
    FACTION_RECRUITERS[gameState.context.state.faction?.name as FactionName];
  return (
    <SpeakingModal
      bumpkinParts={NPC_WEARABLES[npc]}
      message={[
        {
          text: t("faction-intro.one"),
        },
        {
          text: t("faction-intro.two"),
        },
        {
          text: t("faction-intro.three"),
        },
      ]}
      onClose={() => {
        acknowledgeIntro();
        onClose();
      }}
    />
  );
};
