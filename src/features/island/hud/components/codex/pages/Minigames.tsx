import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { PortalName } from "features/game/types/portals";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";

import chickenRescueBanner from "assets/portals/chicken_rescue_preview.png";
import chickenRescueThumbnail from "assets/portals/chicken_rescue_thumbnail.png";

const VALID_PORTALS: PortalName[] = ["chicken-rescue"];

export const Minigames: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [selected, setSelected] = useState<PortalName>();

  const { t } = useAppTranslation();

  if (selected) {
    return (
      <>
        <div className="mb-1">
          <Label type="default" className="mb-1">
            {selected}
          </Label>
          <p className="text-xs my-1">Lorem ipsum</p>
          <img
            src={chickenRescueBanner}
            className="w-full rounded-md mb-1"
            alt=""
          />

          <OuterPanel>
            <span className="text-xs mb-1">Mission: Rescue 50 chickens</span>
            <div className="flex justify-between">
              <Label type="info">3 Hrs Left</Label>
              <Label type="warning">2.2</Label>
            </div>
          </OuterPanel>
        </div>
      </>
    );
  }

  return (
    <>
      {VALID_PORTALS.map((portal) => {
        return (
          <OuterPanel
            className="hover:bg-brown-300 cursor-pointer "
            onClick={() => {
              setSelected(portal);
            }}
          >
            <div className="flex">
              <img
                src={chickenRescueThumbnail}
                className="w-20 h-20 rounded-md"
                alt="Chicken Rescue"
              />
              <div className="px-1 flex-1">
                <div className="flex justify-between">
                  <Label type="default">{portal}</Label>
                  <Label type="warning">5</Label>
                </div>
                <span className="text-xs">
                  Rescue the chickens from the hungry goblins.
                </span>
              </div>
            </div>
          </OuterPanel>
        );
      })}
    </>
  );
};
