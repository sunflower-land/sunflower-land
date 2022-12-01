import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import npc from "assets/npcs/community_garden_npc.gif";
import boats from "assets/npcs/paperboats.gif";
import close from "assets/icons/close.png";

import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunityGardenModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Modal centered show={isOpen} onHide={onClose}>
      <Panel>
        <img
          src={close}
          className="absolute cursor-pointer z-20"
          onClick={onClose}
          style={{
            top: `${PIXEL_SCALE * 6}px`,
            right: `${PIXEL_SCALE * 6}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
        <div className="p-2">
          <div className="flex flex-col items-center mb-3">
            <h1 className="text-lg mb-2 text-center">
              Do you want to visit the Community Garden?
            </h1>
            <div className="flex items-center gap-6">
              <img
                src={boats}
                style={{
                  width: `${PIXEL_SCALE * 21}px`,
                  height: `${PIXEL_SCALE * 19}px`,
                }}
              />
              <img
                src={npc}
                style={{
                  width: `${PIXEL_SCALE * 16}px`,
                  height: `${PIXEL_SCALE * 16}px`,
                }}
              />
            </div>
          </div>

          <p className="mb-4 text-sm block">
            Community Garden offers NFTs built entirely by the community.
          </p>

          <p className="mb-4 text-sm block">
            {`You can only use SFL that is in your personal wallet, not your
            farm's wallet.`}
          </p>

          <p className="mb-4 text-sm block">
            The Sunflower Land team does not maintain or support these features.
            <br />
            Proceed at your own risk.
          </p>
        </div>

        <div className="flex">
          <Button
            className="ml-1"
            onClick={() => navigate(`/community-garden/${id}`)}
          >
            Continue
          </Button>
        </div>
      </Panel>
    </Modal>
  );
};
