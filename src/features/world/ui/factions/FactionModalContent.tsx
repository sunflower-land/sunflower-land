import React, { useContext, useState } from "react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { FactionDetailsPanel } from "./FactionDetailsPanel";
import {
  FactionDonationPanel,
  FACTION_POINT_ICONS,
} from "./FactionDonationPanel";
import { FactionName } from "features/game/types/game";

import factionsIcon from "assets/icons/factions.webp";
import { PledgeFaction } from "./PledgeFaction";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";

interface Props {
  representativeFaction?: FactionName;
  defaultTab?: number;
  onClose: () => void;
}

const _faction = (state: MachineState) => state.context.state.faction;

export const FactionModalContent: React.FC<Props> = ({
  representativeFaction,
  defaultTab = 0,
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const [tab, setTab] = useState(defaultTab);
  const { t } = useAppTranslation();

  const joinedFaction = useSelector(gameService, _faction);
  const showPledge = !joinedFaction && representativeFaction;

  return (
    <CloseButtonPanel
      tabs={[
        {
          name: t("faction"),
          icon: factionsIcon,
        },
        ...(joinedFaction
          ? [
              {
                name: t("donations"),
                icon: FACTION_POINT_ICONS[joinedFaction.name],
              },
            ]
          : []),
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
      onClose={onClose}
      className="max-h-[92vh]"
    >
      {tab === 0 && showPledge && (
        <PledgeFaction faction={representativeFaction} onClose={onClose} />
      )}
      {tab === 0 && joinedFaction && (
        <FactionDetailsPanel faction={joinedFaction} onClose={onClose} />
      )}
      {tab === 1 && <FactionDonationPanel onClose={onClose} />}
    </CloseButtonPanel>
  );
};
