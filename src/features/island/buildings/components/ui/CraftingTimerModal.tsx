import React, { useEffect } from "react";
import { useActor } from "@xstate/react";
import { MachineInterpreter } from "../../lib/craftingMachine";
import Modal from "react-bootstrap/esm/Modal";
import { Panel } from "components/ui/Panel";

import close from "assets/icons/close.png";
import stopwatch from "assets/icons/stopwatch.png";
import { ITEM_DETAILS } from "features/game/types/images";
import { secondsToMidString } from "lib/utils/time";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  service: MachineInterpreter;
  onClose: () => void;
  show: boolean;
}

export const CraftingTimerModal: React.FC<Props> = ({
  show,
  onClose,
  service,
}) => {
  const [
    {
      context: { secondsTillReady, name },
    },
  ] = useActor(service);

  useEffect(() => {
    if (secondsTillReady && secondsTillReady <= 0) {
      onClose();
    }
  }, [secondsTillReady, onClose]);

  if (!secondsTillReady || !name) {
    return null;
  }

  return (
    <Modal show={show} centered onHide={onClose}>
      <div className="absolute w-72 -left-8 -top-44 -z-10">
        <DynamicNFT
          bumpkinParts={{
            body: "Beige Farmer Potion",
            hair: "Buzz Cut",
            pants: "Farmer Pants",
            shirt: "Yellow Farmer Shirt",
            coat: "Chef Apron",
            tool: "Farmer Pitchfork",
            background: "Farm Background",
            shoes: "Black Farmer Boots",
          }}
        />
      </div>
      <Panel>
        <img
          src={close}
          className="absolute cursor-pointer z-20"
          onClick={onClose}
          style={{
            top: `${PIXEL_SCALE * 6}px`,
            right: `${PIXEL_SCALE * 6}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
        <div>
          <div className="flex items-start w-full">
            <span className="w-full">Is it ready yet?</span>
          </div>
          <div className="my-2 flex flex-col">
            <p>{`Your ${name.toLowerCase()} will be ready in: `}</p>
            <div className="flex w-full justify-between mt-2">
              <img src={ITEM_DETAILS[name].image} className="h-7" />
              <div className="flex items-center">
                <img src={stopwatch} className="h-7 mr-2" />
                <p>{secondsToMidString(secondsTillReady)}</p>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </Modal>
  );
};
