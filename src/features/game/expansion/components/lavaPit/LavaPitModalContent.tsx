import React, { useContext } from "react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { useTranslation } from "react-i18next";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { getKeys } from "features/game/types/craftables";
import { LAVA_PIT_REQUIREMENTS } from "features/game/events/landExpansion/startLavaPit";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";

const _inventory = (state: MachineState) => state.context.state.inventory;

interface Props {
  onClose: () => void;
}

export const LavaPitModalContent: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const inventory = useSelector(gameService, _inventory);

  const { t } = useTranslation();
  return (
    <CloseButtonPanel
      onClose={onClose}
      tabs={[
        {
          name: "Lava Pit",
          icon: ITEM_DETAILS["Lava Pit"].image,
        },
        {
          name: "Guide",
          icon: SUNNYSIDE.icons.angry,
        },
      ]}
    >
      <Label type="default" className="mt-2">
        {"Requirements"}
      </Label>
      <div className="flex flex-col gap-2">
        {getKeys(LAVA_PIT_REQUIREMENTS).map((itemName) => {
          return (
            <RequirementLabel
              key={itemName}
              type="item"
              item={itemName}
              balance={inventory[itemName] ?? new Decimal(0)}
              showLabel
              requirement={new Decimal(LAVA_PIT_REQUIREMENTS[itemName] ?? 0)}
            />
          );
        })}
      </div>
      <Button>{"Start Lava Pit"}</Button>
    </CloseButtonPanel>
  );
};
