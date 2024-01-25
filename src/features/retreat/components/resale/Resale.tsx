import React from "react";

import resale from "assets/buildings/resale.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { translate } from "lib/i18n/translate";

export const Resale: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openResale = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Modal show={isOpen} onHide={() => setIsOpen(false)} centered>
        <CloseButtonPanel
          onClose={() => setIsOpen(false)}
          title={translate("retreatTerms.lookingForRareItems")}
        >
          <div className="p-2">
            <p className="text-sm mb-3">
              {translate("retreatTerms.resale.one")}
            </p>
            <p className="text-sm mb-3">
              {translate("retreatTerms.resale.two")}
            </p>

            <Button
              onClick={() => {
                window.open(
                  "https://opensea.io/collection/sunflower-land-collectibles",
                  "_blank"
                );
              }}
            >
              {translate("retreatTerms.resale.three")}
            </Button>
          </div>
        </CloseButtonPanel>
      </Modal>
      <MapPlacement x={1} y={-7} height={5} width={4}>
        <div
          className="relative w-full h-full cursor-pointer hover:img-highlight"
          onClick={openResale}
        >
          <img
            src={resale}
            alt="Resale"
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 53}px`,
              left: `${PIXEL_SCALE * 5}px`,
              bottom: `${PIXEL_SCALE * 11}px`,
            }}
          />
          <div
            className="flex justify-center absolute w-full pointer-events-none"
            style={{
              bottom: `${PIXEL_SCALE * 3}px`,
            }}
          >
            <Action
              className="pointer-events-none"
              text={translate("resale.actionText")}
              icon={SUNNYSIDE.icons.heart}
            />
          </div>
        </div>
      </MapPlacement>
    </>
  );
};
