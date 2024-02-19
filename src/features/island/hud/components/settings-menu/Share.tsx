import React from "react";

import { Button } from "components/ui/Button";

import { Modal } from "components/ui/Modal";

import farmImg from "assets/brand/nft.png";
import { CopyField } from "components/ui/CopyField";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

interface Props {
  farmId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const Share: React.FC<Props> = ({ isOpen, onClose, farmId }) => {
  const { t } = useAppTranslation();
  const farmUrl = `https://sunflower-land.com/play/#/visit/${farmId}`;

  const handleTweetClick = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=Visit My Sunflower Land Farm \uD83D\uDC47\n${encodeURIComponent(
        farmUrl
      )}&ref_src=https://sunflower-land.com`,
      "_blank"
    );
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <CloseButtonPanel onClose={onClose} title={t("share.ShareYourFarmLink")}>
        <div className="p-2">
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
        </div>
        <div className="flex space-x-1 text-sm">
          <Button onClick={handleTweetClick}>{"Tweet"}</Button>
          <Button onClick={() => window.open(farmUrl, "_blank")}>
            {t("visit")}
          </Button>
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
