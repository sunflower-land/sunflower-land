import { useSelector } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { hasFeatureAccess } from "lib/flags";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useContext } from "react";
import { PetShopModal } from "./PetShopModal";
import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";

interface Props {
  onClose: () => void;
}
const _hasPetsAccess = (state: MachineState) =>
  hasFeatureAccess(state.context.state, "PETS");

export const PetShop: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const hasPetsAccess = useSelector(gameService, _hasPetsAccess);

  if (!hasPetsAccess) {
    return (
      <CloseButtonPanel onClose={onClose}>
        <div className="p-1">
          <Label type="info" className="mb-2">
            {t("coming.soon")}
          </Label>
          <p className="text-sm">{t("pets.coming.soon")}</p>
        </div>
        <Button onClick={onClose}>{t("close")}</Button>
      </CloseButtonPanel>
    );
  }

  return (
    <CloseButtonPanel
      tabs={[
        {
          icon: ITEM_DETAILS.Barkley.image,
          name: "Pet Shop",
        },
      ]}
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES.chase}
      container={OuterPanel}
    >
      <PetShopModal />
    </CloseButtonPanel>
  );
};
