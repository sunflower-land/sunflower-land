import React from "react";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SignupBumpkinEquip } from "./SignupBumpkinEquip";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { Wardrobe } from "features/game/types/game";
import {
  getSignupWardrobe,
  DEFAULT_SIGNUP_EQUIPMENT,
} from "features/auth/lib/signupBumpkinDefaults";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (equipment: BumpkinParts) => void;
  wardrobe?: Wardrobe;
  initialEquipment?: BumpkinParts;
}

export const SignupBumpkinModal: React.FC<Props> = ({
  show,
  onClose,
  onSave,
  wardrobe = getSignupWardrobe(),
  initialEquipment = DEFAULT_SIGNUP_EQUIPMENT,
}) => {
  const { t } = useAppTranslation();

  const handleSave = (equipment: BumpkinParts) => {
    onSave(equipment);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} dialogClassName="md:max-w-4xl">
      <CloseButtonPanel
        tabs={[
          {
            id: "createBumpkin",
            icon: SUNNYSIDE.icons.player,
            name: t("signup.createBumpkin"),
          },
        ]}
        onClose={onClose}
      >
        <SignupBumpkinEquip
          wardrobe={wardrobe}
          initialEquipment={initialEquipment}
          onSave={handleSave}
        />
      </CloseButtonPanel>
    </Modal>
  );
};
