import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import lock from "assets/skills/lock.png";
import chest from "assets/icons/chest.png";
import powerup from "assets/icons/level_up.png";
import lightning from "assets/icons/lightning.png";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";

export const LabelTest: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
      <CloseButtonPanel onClose={() => setIsOpen(false)}>
        <div className="p-2">
          <p className="mb-2">Labels</p>
          <div className="flex flex-col space-y-2">
            <div className="flex flex-wrap justify-between w-full">
              <Label type="danger" className="block">
                Danger
              </Label>
              <Label type="danger" className="block" icon={lock}>
                Danger
              </Label>
              <Label
                type="danger"
                className="block"
                icon={lock}
                secondaryIcon={SUNNYSIDE.icons.stressed}
              >
                Danger
              </Label>
            </div>
            <div className="flex flex-wrap justify-between w-full">
              <Label type="success">Buff</Label>
              <Label type="success" icon={powerup}>
                Buff
              </Label>
              <Label
                type="success"
                icon={powerup}
                secondaryIcon={CROP_LIFECYCLE.Pumpkin.crop}
              >
                Buff
              </Label>
            </div>
            <div className="flex flex-wrap justify-between w-full">
              <Label type="info">Speed</Label>
              <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                Speed
              </Label>
              <Label
                type="info"
                icon={SUNNYSIDE.icons.stopwatch}
                secondaryIcon={SUNNYSIDE.resource.stone}
              >
                Speed
              </Label>
            </div>

            <div className="flex flex-wrap justify-between w-full">
              <Label type="warning">Treasure</Label>
              <Label type="warning" icon={chest}>
                Treasure
              </Label>
              <Label
                type="warning"
                icon={chest}
                secondaryIcon={SUNNYSIDE.icons.heart}
              >
                Treasure
              </Label>
            </div>
            <div className="flex flex-wrap justify-between w-full">
              <Label type="vibrant">Special</Label>
              <Label type="vibrant" icon={lightning}>
                Special
              </Label>
              <Label
                type="vibrant"
                icon={lightning}
                secondaryIcon={SUNNYSIDE.icons.basket}
              >
                Special
              </Label>
            </div>
            <div className="flex flex-wrap justify-between w-full">
              <Label type="default">Default</Label>
              <Label type="default" icon={SUNNYSIDE.tools.fishing_rod}>
                Default
              </Label>
              <Label
                type="default"
                icon={SUNNYSIDE.tools.fishing_rod}
                secondaryIcon={SUNNYSIDE.resource.clam_shell}
              >
                Default
              </Label>
            </div>
            <div className="flex flex-wrap justify-between w-full">
              <Label type="formula">Formula</Label>
              <Label type="formula" icon={SUNNYSIDE.icons.player}>
                Formula
              </Label>
              <Label
                type="formula"
                icon={SUNNYSIDE.icons.player}
                secondaryIcon={SUNNYSIDE.tools.axe}
              >
                Formula
              </Label>
            </div>
            <div className="flex flex-wrap justify-between w-full">
              <Label type="chill">Chill</Label>
              <Label type="chill" icon={SUNNYSIDE.icons.heart}>
                Chill
              </Label>
              <Label
                type="chill"
                icon={SUNNYSIDE.icons.heart}
                secondaryIcon={CROP_LIFECYCLE.Sunflower.crop}
              >
                Formula
              </Label>
            </div>
          </div>
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
