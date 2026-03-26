import React from "react";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import type { SaltHarvestSlotUi } from "./getSaltModalState";

type Props = {
  slot: SaltHarvestSlotUi | undefined;
  now: number;
};

export const SaltHarvestQueueSlot: React.FC<Props> = ({ slot, now }) => {
  if (!slot) {
    return <Box />;
  }

  const isReady = slot.readyAt <= now;

  return (
    <div className="relative">
      {isReady && (
        <img
          className="absolute top-1 right-1 w-4 z-10"
          src={SUNNYSIDE.icons.confirm}
          alt="Confirm"
        />
      )}
      <Box image={ITEM_DETAILS.Salt.image} />
    </div>
  );
};
