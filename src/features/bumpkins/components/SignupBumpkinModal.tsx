import React from "react";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SignupBumpkinEquip } from "./SignupBumpkinEquip";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { DEFAULT_SIGNUP_EQUIPMENT } from "features/auth/lib/signupBumpkinDefaults";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (equipment: BumpkinParts) => void;
  initialEquipment?: BumpkinParts;
}

export const SignupBumpkinModal: React.FC<Props> = ({
  show,
  onClose,
  onSave,
  initialEquipment = DEFAULT_SIGNUP_EQUIPMENT,
}) => {
  const { t } = useAppTranslation();

  const handleSave = (equipment: BumpkinParts) => {
    onSave(equipment);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} size="lg">
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
          initialEquipment={initialEquipment}
          onSave={handleSave}
        />
      </CloseButtonPanel>
    </Modal>
  );
};
