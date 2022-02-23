import React from "react";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel, Panel } from "components/ui/Panel";

import { Modal } from "react-bootstrap";

import close from "assets/icons/close.png";
import farmImg from "assets/brand/nft.png";

interface Props {
  farmURL: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Share: React.FC<Props> = ({ farmURL, isOpen, onClose }) => {
  const [tooltipMessage, setTooltipMessage] = React.useState(
    "Click to copy farm link (URL)"
  );
  const [showLabel, setShowLabel] = React.useState(false);

  const handleCopyFarmURL = (): void => {
    // copy farm link to clipboard
    navigator.clipboard.writeText(farmURL as string);
    setTooltipMessage("Copied!");
    setShowLabel(true);
    setTimeout(() => {
      setTooltipMessage("Click to copy farm link (URL)");
      setShowLabel(false);
    }, 1500);
  };

  const handleMouseEnter = () => {
    setShowLabel(true);
  };

  const handleMouseLeave = () => {
    setShowLabel(false);
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
          <InnerPanel className="mt-2 hover:bg-brown-200 !p-0">
            <div
              className="p-1 cursor-pointer hover:bg-brown-200"
              onClick={handleCopyFarmURL}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span className="text-xs hover:bg-brown-200 whitespace-normal">
                {farmURL}
              </span>
            </div>
          </InnerPanel>
          <div
            className={`absolute mr-5 transition duration-400 pointer-events-none ${
              showLabel ? "opacity-100" : "opacity-0"
            }`}
          >
            <Label>{tooltipMessage}</Label>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button className="text-s w-1/4 px-1" onClick={handleCopyFarmURL}>
            Copy
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
