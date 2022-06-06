import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import close from "assets/icons/close.png";
import rock from "assets/quest/rock.png";

import { Context } from "features/game/GoblinProvider";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  canMineAncientRock,
  getAncientRockIngredients,
} from "./actions/canMine";

interface Props {
  onClose: () => void;
}

export const AncientRockModal: React.FC<Props> = ({ onClose }) => {
  const { goblinService } = useContext(Context);
  const [{ context }] = useActor(goblinService);

  const craft = () => {
    onClose();
    goblinService.send("MINT", { item: "Sunflower Key", captcha: "0x" });
  };

  return (
    <Panel>
      <img
        src={close}
        className="h-6 top-4 right-4 absolute cursor-pointer"
        onClick={onClose}
      />
      <div className="flex items-start">
        <img src={rock} className="w-12 img-highlight mr-2" />
        <div className="flex-1">
          <span className="text-shadow block">Ancient Rock</span>
          {canMineAncientRock(context) ? (
            <>
              <span className="text-shadow block mt-4">Required Resources</span>
              {getAncientRockIngredients(context)?.map((ingredient) => {
                return (
                  <div className="flex items-end" key={ingredient.item}>
                    <img
                      src={ITEM_DETAILS[ingredient.item].image}
                      className="w-5 me-2"
                    />
                    <span className="text-shadow mt-2 ">
                      {ingredient.amount.toString()}
                    </span>
                  </div>
                );
              })}

              <Button className="text-sm mt-4" onClick={craft}>
                Mine it
              </Button>
            </>
          ) : (
            <span className="text-shadow block mt-4">
              This rock is 10 times harder than the average stone.
            </span>
          )}
        </div>
      </div>
    </Panel>
  );
};
