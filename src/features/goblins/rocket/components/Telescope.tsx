import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { getTelescopeIngredients } from "../actions/canEndMomEvent";
import { Context } from "features/game/GoblinProvider";

interface Props {
  onCraft: () => void;
}

// TODO - Use this component for minting the telescope. See old "EngineCore.tsx" and 'AncientTreeModal' for inspiration.
export const Telescope: React.FC<Props> = ({ onCraft }) => {
  const { goblinService } = useContext(Context);
  const [{ context }] = useActor(goblinService);

  // TODO
  const craft = () => {
    onCraft();
    goblinService.send("MINT", { item: "Telescope", captcha: "0x" });
  };

  const telescopeIngredients = getTelescopeIngredients(context);
  console.log("TELESCOPE INGREDIENTS: ", telescopeIngredients);

  // TODO - Define content window
  return null;
};
