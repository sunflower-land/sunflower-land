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

  const handleTweetClick = () => {
    window.open(
      encodeURI(
        `https://twitter.com/intent/tweet?text=Visit My Sunflower Land Farm \uD83D\uDC47\n${farmURL}&ref_src=https://sunflower-land.com`
      ),
      "_blank"
    );
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
          <div className="mt-2 bg-brown-200 p-1">
            <div className="flex justify-content-between p-1 align-items-center">
              <span className="text-[0.55rem] sm:text-xs whitespace-normal mr-2">
                {farmURL}
              </span>
              <span
                className="cursor-pointer scale-[1.5]"
                onClick={handleCopyFarmURL}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <svg
                  className="fill-white hover:fill-brown-300"
                  aria-hidden="true"
                  height="16"
                  viewBox="0 0 16 16"
                  version="1.1"
                  width="16"
                  data-view-component="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"
                  ></path>
                  <path
                    fillRule="evenodd"
                    d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"
                  ></path>
                </svg>
              </span>
            </div>
          </div>
          <div
            className={`absolute mr-5 transition duration-400 pointer-events-none ${
              showLabel ? "opacity-100" : "opacity-0"
            }`}
          >
            <Label>{tooltipMessage}</Label>
          </div>
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
