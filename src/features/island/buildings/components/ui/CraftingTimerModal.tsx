import React, { useEffect } from "react";
import { useActor } from "@xstate/react";
import { MachineInterpreter } from "../../lib/craftingMachine";
import Modal from "react-bootstrap/esm/Modal";
import { Panel } from "components/ui/Panel";

import close from "assets/icons/close.png";
import stopwatch from "assets/icons/stopwatch.png";
import { ITEM_DETAILS } from "features/game/types/images";
import { secondsToString } from "lib/utils/time";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";

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
      <div className="absolute w-48 -left-4 -top-32 -z-10">
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
        <div>
          <div className="flex items-start w-full">
            <span className="w-full">Is it ready yet?</span>
            <img
              src={close}
              className="h-6 ml-2 cursor-pointer"
              onClick={onClose}
            />
          </div>
          <div className="my-2 flex flex-col">
            <p>{`Your ${name.toLowerCase()} will be ready in: `}</p>
            <div className="flex w-full justify-between mt-2">
              <img src={ITEM_DETAILS[name].image} className="h-7" />
              <div className="flex items-center">
                <img src={stopwatch} className="h-7 mr-2" />
                <p>{secondsToString(secondsTillReady, { length: "medium" })}</p>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </Modal>
  );
};
