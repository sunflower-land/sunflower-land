import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { UpgradeSaltFarm } from "./UpgradeSaltFarm";
import { OuterPanel } from "components/ui/Panel";

interface Props {
  onClose: () => void;
}

const _saltFarmLevel = (state: MachineState) =>
  state.context.state.saltFarm.level;

export const UpgradeSaltFarmModalPanel: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const saltFarmLevel = useSelector(gameService, _saltFarmLevel);
  const upgradeTabLabel =
    saltFarmLevel === 0 ? t("saltFarm.unlockTab") : t("upgrade");

  return (
    <CloseButtonPanel
      onClose={onClose}
      tabs={[
        {
          id: "upgradeSaltFarm",
          name: upgradeTabLabel,
          icon: ITEM_DETAILS.Hammer.image,
        },
      ]}
      currentTab="upgradeSaltFarm"
      container={OuterPanel}
    >
      <UpgradeSaltFarm />
    </CloseButtonPanel>
  );
};
