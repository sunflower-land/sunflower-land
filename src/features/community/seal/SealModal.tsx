import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sealImg: string;
}

export const SealModal: React.FC<Props> = ({ isOpen, onClose, sealImg }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Modal centered show={isOpen} onHide={onClose}>
      <CloseButtonPanel
        onClose={onClose}
        title="Whoops! This isn't the Community Garden..."
      >
        <div className="flex justify-center items-center gap-6 mb-3">
          <img
            src={sealImg}
            style={{
              width: `${PIXEL_SCALE * 40}px`,
            }}
          />
        </div>
        <div className="space-y-3 mb-3 px-2 text-sm">
          <p>
            I have lost my way back home. Only the Goblin Merchant can bring me
            back to my seal family.
          </p>
          <p>Will you help me?</p>
        </div>

        <Button onClick={() => navigate(`/community-garden/${id}`)}>
          Go To Community Garden
        </Button>
      </CloseButtonPanel>
    </Modal>
  );
};
