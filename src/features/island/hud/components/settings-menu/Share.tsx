import React from "react";

import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";

import { Modal } from "react-bootstrap";

import farmImg from "assets/brand/nft.png";
import { CopyField } from "components/ui/CopyField";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Share: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useAppTranslation();
  const farmUrl = window.location.href.replace("/land", "/visit");

  const handleTweetClick = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=Visit My Sunflower Land Farm \uD83D\uDC47\n${encodeURIComponent(
        farmUrl
      )}&ref_src=https://sunflower-land.com`,
      "_blank"
    );
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Panel>
        <Modal.Header className="justify-content-space-between">
          <h1 className="ml-2">{t("share.ShareYourFarmLink")}</h1>
          <img
            src={SUNNYSIDE.icons.close}
            className="absolute cursor-pointer z-20"
            onClick={onClose}
            style={{
              top: `${PIXEL_SCALE * 6}px`,
              right: `${PIXEL_SCALE * 6}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </Modal.Header>
        <Modal.Body>
          <div className="row justify-content-center align-items-center">
            <div className="flex d-none d-sm-block col-sm col justify-content-center align-items-center">
              <p className="text-sm whitespace-normal">
                {t("share.ShowOffToFarmers")}
              </p>
            </div>
            <div className="flex col-sm-12 col justify-content-center md-px-4 lg-px-4 align-items-center">
              <img
                src={farmImg}
                className="w-64 md-mt-2"
                alt={t("share.FarmNFTImageAlt")}
              />
            </div>
          </div>
          <CopyField text={farmUrl} copyFieldMessage={t("share.CopyFarmURL")} />
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button className="text-s w-1/4 px-1" onClick={handleTweetClick}>
            {"TweeT"}
          </Button>
          <Button
            className="text-s w-1/4 px-1"
            onClick={() => window.open(farmUrl, "_blank")}
          >
            {t("visit")}
          </Button>
        </Modal.Footer>
      </Panel>
    </Modal>
  );
};
