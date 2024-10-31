import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useState } from "react";
import { Modal } from "components/ui/Modal";
import lock from "assets/skills/lock.png";
import chest from "assets/icons/chest.png";
import powerup from "assets/icons/level_up.png";
import lightning from "assets/icons/lightning.png";
import { PLOT_CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const LabelTest: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useAppTranslation();
  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)}>
      <CloseButtonPanel onClose={() => setIsOpen(false)}>
        <div className="p-2">
          <p className="mb-2">{t("labels")}</p>
          <div className="flex flex-col space-y-2">
            <div className="flex flex-wrap justify-between w-full">
              <Label type="danger" className="block">
                {t("danger")}
              </Label>
              <Label type="danger" className="block" icon={lock}>
                {t("danger")}
              </Label>
              <Label
                type="danger"
                className="block"
                icon={lock}
                secondaryIcon={SUNNYSIDE.icons.stressed}
              >
                {t("danger")}
              </Label>
            </div>
            <div className="flex flex-wrap justify-between w-full">
              <Label type="success">{t("buff")}</Label>
              <Label type="success" icon={powerup}>
                {t("buff")}
              </Label>
              <Label
                type="success"
                icon={powerup}
                secondaryIcon={PLOT_CROP_LIFECYCLE.Pumpkin.crop}
              >
                {t("buff")}
              </Label>
            </div>
            <div className="flex flex-wrap justify-between w-full">
              <Label type="info">{t("speed")}</Label>
              <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                {t("speed")}
              </Label>
              <Label
                type="info"
                icon={SUNNYSIDE.icons.stopwatch}
                secondaryIcon={SUNNYSIDE.resource.stone}
              >
                {t("speed")}
              </Label>
            </div>

            <div className="flex flex-wrap justify-between w-full">
              <Label type="warning">{t("treasure")}</Label>
              <Label type="warning" icon={chest}>
                {t("treasure")}
              </Label>
              <Label
                type="warning"
                icon={chest}
                secondaryIcon={SUNNYSIDE.icons.heart}
              >
                {t("treasure")}
              </Label>
            </div>
            <div className="flex flex-wrap justify-between w-full">
              <Label type="vibrant">{t("special")}</Label>
              <Label type="vibrant" icon={lightning}>
                {t("special")}
              </Label>
              <Label
                type="vibrant"
                icon={lightning}
                secondaryIcon={SUNNYSIDE.icons.basket}
              >
                {t("special")}
              </Label>
            </div>
            <div className="flex flex-wrap justify-between w-full">
              <Label type="default">{t("default")}</Label>
              <Label type="default" icon={SUNNYSIDE.tools.fishing_rod}>
                {t("default")}
              </Label>
              <Label
                type="default"
                icon={SUNNYSIDE.tools.fishing_rod}
                secondaryIcon={SUNNYSIDE.resource.clam_shell}
              >
                {t("default")}
              </Label>
            </div>
            <div className="flex flex-wrap justify-between w-full">
              <Label type="formula">{t("formula")}</Label>
              <Label type="formula" icon={SUNNYSIDE.icons.player}>
                {t("formula")}
              </Label>
              <Label
                type="formula"
                icon={SUNNYSIDE.icons.player}
                secondaryIcon={SUNNYSIDE.tools.axe}
              >
                {t("formula")}
              </Label>
            </div>
            <div className="flex flex-wrap justify-between w-full">
              <Label type="chill">{t("chill")}</Label>
              <Label type="chill" icon={SUNNYSIDE.icons.heart}>
                {t("chill")}
              </Label>
              <Label
                type="chill"
                icon={SUNNYSIDE.icons.heart}
                secondaryIcon={PLOT_CROP_LIFECYCLE.Sunflower.crop}
              >
                {t("formula")}
              </Label>
            </div>
          </div>
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
