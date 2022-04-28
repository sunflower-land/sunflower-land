import React from "react";

import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";

import { Modal } from "react-bootstrap";

import close from "assets/icons/close.png";
import farmImg from "assets/brand/nft.png";
import { CopyField } from "components/ui/CopyField";

interface Props {
  farmURL: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Share: React.FC<Props> = ({ farmURL, isOpen, onClose }) => {
  const handleTweetClick = () => {
    window.open(
      encodeURI(
        `https://twitter.com/intent/tweet?text=Visit My Sunflower Land Farm \uD83D\uDC47\n${farmURL}&ref_src=https://sunflower-land.com`
      ),
      "_blank"
    );
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Panel>
        <Modal.Header className="justify-content-space-between">
          <h1 className="ml-2">Share Your Farm Link</h1>
          <img
            src={close}
            className="h-6 cursor-pointer mr-2 mb-1 justify-content-end"
            onClick={onClose}
          />
        </Modal.Header>
        <Modal.Body>
          <div className="row justify-content-center align-items-center">
            <div className="flex d-none d-sm-block col-sm col justify-content-center align-items-center">
              <p className="text-sm whitespace-normal">
                Show off to fellow farmers by sharing your farm link (URL), to
                directly visit your farm !
              </p>
            </div>
            <div className="flex col-sm-12 col justify-content-center md-px-4 lg-px-4 align-items-center">
              <img
                src={farmImg}
                className="w-64 md-mt-2"
                alt="Sunflower-Land Farm NFT Image"
              />
            </div>
          </div>
          <CopyField text={farmURL} copyFieldMessage={"Copy farm URL"} />
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button className="text-s w-1/4 px-1" onClick={handleTweetClick}>
            Tweet
          </Button>
          <Button
            className="text-s w-1/4 px-1"
            onClick={() => window.open(farmURL, "_blank")}
          >
            Visit
          </Button>
        </Modal.Footer>
      </Panel>
    </Modal>
  );
};
