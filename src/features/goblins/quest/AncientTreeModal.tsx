import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import close from "assets/icons/close.png";
import whiteTree from "assets/quest/white_tree.png";

import { Context } from "features/game/GoblinProvider";
import {
  canChopAncientTree,
  getAncientTreeIngredients,
} from "./actions/canChop";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  onClose: () => void;
}

export const AncientTreeModal: React.FC<Props> = ({ onClose }) => {
  const { goblinService } = useContext(Context);
  const [{ context }] = useActor(goblinService);

  const craft = () => {
    onClose();
    goblinService.send("MINT", { item: "Goblin Key", captcha: "0x" });
  };

  return (
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
      <div className="flex items-start">
        <img src={whiteTree} className="w-12 img-highlight mr-2" />
        <div className="flex-1">
          <span className="block">Ancient Tree</span>
          <span className="block mt-4">There is something in the tree!</span>
          {canChopAncientTree(context) ? (
            <>
              <span className="block mt-4">Required Resources</span>
              {getAncientTreeIngredients(context)?.map((ingredient) => {
                return (
                  <div className="flex items-end" key={ingredient.item}>
                    <img
                      src={ITEM_DETAILS[ingredient.item].image}
                      className="w-5 me-2"
                    />
                    <span className="mt-2 ">
                      {ingredient.amount.toString()}
                    </span>
                  </div>
                );
              })}

              <Button className="text-sm mt-4" onClick={craft}>
                Cut it down
              </Button>
            </>
          ) : (
            <span className="block mt-4">
              Alas, no human is strong enough to cut it down.
            </span>
          )}
        </div>
      </div>
    </Panel>
  );
};
