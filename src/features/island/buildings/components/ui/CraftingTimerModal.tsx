import React, { useEffect } from "react";
import { useActor } from "@xstate/react";
import { MachineInterpreter } from "../../lib/craftingMachine";
import Modal from "react-bootstrap/esm/Modal";
import { Panel } from "components/ui/Panel";
import { DynamicNFT } from "features/island/bumpkin/components/DynamicNFT";

import close from "assets/icons/close.png";
import stopwatch from "assets/icons/stopwatch.png";
import { ITEM_DETAILS } from "features/game/types/images";
import { secondsToMidString } from "lib/utils/time";

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
      context: { secondsTillReady, name, gameService },
    },
  ] = useActor(service);

  useEffect(() => {
    if (secondsTillReady && secondsTillReady <= 0) {
      onClose();
    }
  }, [secondsTillReady, onClose]);

  if (!secondsTillReady || !name) {
    onClose();
    return null;
  }

  return (
    <Modal show={show} centered onHide={onClose}>
      <Panel>
        <div>
          <div className="absolute w-1/3 left-2 -top-28 -z-10">
            {gameService.state.context.state.bumpkin && (
              <DynamicNFT
                bumpkinParts={gameService.state.context.state.bumpkin.equipped}
              />
            )}
          </div>
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
                <p>{secondsToMidString(secondsTillReady)}</p>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </Modal>
  );
};
