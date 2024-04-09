import React, { useContext, useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";

import bank from "assets/buildings/goblin_bank.gif";
import icon from "assets/icons/sfl.webp";

import { Action } from "components/ui/Action";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { bankAudio, loadAudio } from "lib/utils/sfx";
import { BankModal } from "features/goblins/bank/components/BankModal";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { Context } from "features/game/GoblinProvider";

export const RetreatBank: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadAudio([bankAudio]);
  }, []);

  const openBank = () => {
    setIsOpen(true);
    //Checks if bankAudio is playing, if false, plays the sound
    if (!bankAudio.playing()) {
      bankAudio.play();
    }
  };

  return (
    <MapPlacement x={-4} y={19} height={5} width={5}>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={openBank}
      >
        <img
          src={bank}
          alt="bank"
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 67}px`,
            left: `${PIXEL_SCALE * 6}px`,
            bottom: `${PIXEL_SCALE * 14}px`,
          }}
        />
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            bottom: `${PIXEL_SCALE * 3}px`,
          }}
        >
          <Action className="pointer-events-none" text="Bank" icon={icon} />
        </div>
      </div>
      <Modal show={isOpen} onHide={() => setIsOpen(false)}>
        <BankModal
          farmAddress={goblinService.state?.context.farmAddress as string}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </MapPlacement>
  );
};
