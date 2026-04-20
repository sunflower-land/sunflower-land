import React, { useState } from "react";
import { useNavigate } from "react-router";

import { ColorPanel, Panel } from "components/ui/Panel";
import { Modal } from "components/ui/Modal";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

/**
 * Call-to-action widget.
 *
 * A vibrant ColorPanel that reads "Create your own economy". Clicking it
 * opens a modal with a short pitch and a button that routes the player to
 * the PlayerEconomyEditor create page (/economy-editor/create).
 */
export const CreateEconomyWidget: React.FC = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const openEditor = () => {
    setShowModal(false);
    navigate("/economy-editor/create");
  };

  return (
    <>
      <ColorPanel
        type="vibrant"
        className="flex items-center p-2 mb-2 cursor-pointer hover:brightness-110"
        onClick={() => setShowModal(true)}
      >
        <img
          src={SUNNYSIDE.icons.plus}
          className="object-contain mr-2"
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            height: `${PIXEL_SCALE * 10}px`,
          }}
        />
        <p className="text-xs flex-1 leading-tight">
          {t("economyHub.createYourOwn")}
        </p>
      </ColorPanel>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Panel>
          <div className="p-1">
            <Label type="vibrant" className="mb-2">
              {t("economyHub.createAnEconomy")}
            </Label>
            <p className="text-sm mb-3 leading-tight">
              {t("economyHub.createModalDescription")}
            </p>
            <Button onClick={openEditor}>{t("economyHub.create")}</Button>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
