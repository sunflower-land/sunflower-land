import React, { useContext } from "react";
import Decimal from "decimal.js-light";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GoblinProvider";
import { Ingredient } from "features/game/types/craftables";

import { ITEM_DETAILS } from "features/game/types/images";
import close from "assets/icons/close.png";
import telescope from "assets/nfts/mom/telescope.gif";

interface Props {
  onCraft: () => void;
  onClose: () => void;
}

// TODO - Use this component for minting the telescope. See old "EngineCore.tsx" and 'AncientTreeModal' for inspiration.
export const Telescope: React.FC<Props> = ({ onCraft, onClose }) => {
  const { goblinService } = useContext(Context);
  const [{ context }] = useActor(goblinService);

  // TODO
  const craft = () => {
    onCraft();
    goblinService.send("MINT", { item: "Telescope", captcha: "0x" });
  };

  // TODO - Use this to pull ingredients of telescope dynamically once recipe is on testnet.
  //const telescopeIngredients = getTelescopeIngredients(context);

  // TODO - Placeholder recipe. Remove this once recipe becomes live on testnet.
  const telescopeIngredients: Ingredient[] = [
    {
      id: 601,
      item: "Wood",
      amount: new Decimal(1),
    },
    {
      id: 201,
      item: "Sunflower",
      amount: new Decimal(1),
    },
  ];

  return (
    <Panel>
      <img
        src={close}
        className="h-6 top-4 right-4 absolute cursor-pointer"
        onClick={onClose}
      />
      <div className="flex items-start">
        <img src={telescope} className="w-18 img-highlight mr-1" />
        <div className="flex-1">
          <span className="text-shadow block">Telescope</span>
          {/* <span className="text-shadow block mt-4">
            There is something in the tree!
          </span> */}
          <span className="text-shadow block mt-4">Required Resources</span>
          {telescopeIngredients?.map((ingredient) => {
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
            Mint
          </Button>
        </div>
      </div>
    </Panel>
  );
};
