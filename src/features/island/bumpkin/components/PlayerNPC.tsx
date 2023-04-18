import React from "react";
import { useContext, useState } from "react";
import { NPC, NPCProps } from "./NPC";
import { Context } from "features/game/GameProvider";
import { ConsumableName } from "features/game/types/consumables";
import { NPCModal } from "./NPCModal";

export const PlayerNPC: React.FC<NPCProps> = ({
  body,
  hair,
  shirt,
  pants,
  hat,
  suit,
  onesie,
  wings,
  coat,
  dress,
}) => {
  const { gameService } = useContext(Context);

  const [open, setOpen] = useState(false);

  const eat = (food: ConsumableName) => {
    gameService.send("bumpkin.feed", { food });
  };

  // TODO On Food gain, show love heart

  return (
    <>
      <NPC
        body={body}
        hair={hair}
        shirt={shirt}
        pants={pants}
        hat={hat}
        suit={suit}
        onesie={onesie}
        wings={wings}
        coat={coat}
        dress={dress}
        onClick={() => setOpen(true)}
      />

      <NPCModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onFeed={(food) => eat(food)}
      />
    </>
  );
};
