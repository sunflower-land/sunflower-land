import React from "react";

import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import kuebiko from "assets/sfts/kuebiko.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { translate } from "lib/i18n/translate";

interface Props {
  onClose: () => void;
  onRemove: () => void;
}

export const RemoveKuebikoModal: React.FC<Props> = ({ onClose, onRemove }) => (
  <Modal show={true} onHide={onClose} centered={true}>
    <CloseButtonPanel title={translate("removeKuebiko.title")} onClose={onClose}>
      <div className="flex flex-col items-center p-2 w-full text-center text-sm">
        <img
          src={kuebiko}
          className="mb-2"
          style={{
            width: `${PIXEL_SCALE * 30}px`,
          }}
        />
        <span>{translate("removeKuebiko.description")}</span>
      </div>

      <Button onClick={onRemove} className="mt-2">
        {translate("removeKuebiko.removeSeeds")}
      </Button>
    </CloseButtonPanel>
  </Modal>
);
