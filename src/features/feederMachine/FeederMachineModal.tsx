import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

interface Props {
  show: boolean;
  onClose: () => void;
}

export const FeederMachineModal: React.FC<Props> = ({ show, onClose }) => {
  const { t } = useAppTranslation();

  return (
    <Modal show={show} onHide={onClose}>
      <CloseButtonPanel
        onClose={onClose}
        tabs={[{ icon: SUNNYSIDE.resource.chicken, name: "Feeder Machine" }]}
      ></CloseButtonPanel>
    </Modal>
  );
};
