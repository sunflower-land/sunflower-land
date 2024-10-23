import React, { useState } from "react";
import page from "assets/decorations/page.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Panel } from "components/ui/Panel";
import { Modal } from "components/ui/Modal";
import { RecipeItemName } from "features/game/lib/crafting";
import { Button } from "components/ui/Button";
import { useTranslation } from "react-i18next";
import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";

export const Recipe: React.FC<{ recipe: RecipeItemName }> = ({ recipe }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { t } = useTranslation();

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <img
        className="cursor-pointer animate-float"
        onClick={() => setIsModalOpen(true)}
        src={page}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          height: `${PIXEL_SCALE * 16}px`,
        }}
      />

      <Modal show={isModalOpen} onHide={handleClose}>
        <Panel>
          <div className="flex flex-col justify-center items-center space-y-2">
            <div className="flex flex-col justify-center items-center">
              <Label type="warning" icon={page}>
                New Recipe Discovered!
              </Label>
              <span className="text-sm mb-2">{recipe}</span>
              <img src={ITEM_DETAILS[recipe]?.image} className="h-12 mb-2" />
              <span className="text-xs text-center mb-2">
                {ITEM_DETAILS[recipe].description}
              </span>
              <span className="text-xs text-center mb-2">
                Craft this item at the crafting box
              </span>
            </div>
          </div>
          <Button onClick={handleClose}>{t("close")}</Button>
        </Panel>
      </Modal>
    </>
  );
};
