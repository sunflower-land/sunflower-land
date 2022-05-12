import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import classNames from "classnames";

import { Context } from "features/game/VisitingProvider";
import { InventoryItemName } from "features/game/types/game";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Soil } from "./Soil";

interface Props {
  selectedItem?: InventoryItemName;
  fieldIndex: number;
  className?: string;
  onboarding?: boolean;
}

export const Field: React.FC<Props> = ({ className, fieldIndex }) => {
  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);
  const field = game.context.state.fields[fieldIndex];
  const [showCropDetails] = useState(false);

  return (
    <div
      className={classNames("relative group", className)}
      style={{
        width: `${GRID_WIDTH_PX}px`,
        height: `${GRID_WIDTH_PX}px`,
      }}
    >
      <Soil
        className="absolute bottom-0"
        field={field}
        showCropDetails={showCropDetails}
      />
    </div>
  );
};
