import React, { useContext } from "react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { FactionName } from "features/game/types/game";

import { Context } from "features/game/GameProvider";
import { NPC_WEARABLES } from "lib/npcs";
import { JoinFaction } from "./JoinFaction";

interface Props {
  representativeFaction?: FactionName;
  onClose: () => void;
}

// const _faction = (state: MachineState) => state.context.state.faction;

export const JoinFactionModal: React.FC<Props> = ({
  representativeFaction,
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  // const joinedFaction = useSelector(gameService, _faction);

  enum Faction {
    "goblins" = "goblins recruiter",
    "sunflorians" = "sunflorians recruiter",
    "bumpkins" = "bumpkins recruiter",
    "nightshades" = "nightshades recruiter",
  }

  return (
    <CloseButtonPanel
      bumpkinParts={
        representativeFaction
          ? NPC_WEARABLES[Faction[representativeFaction]]
          : undefined
      }
    >
      {representativeFaction && (
        <JoinFaction faction={representativeFaction} onClose={onClose} />
      )}
    </CloseButtonPanel>
  );
};
