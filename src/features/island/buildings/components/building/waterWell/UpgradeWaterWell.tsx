import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";
import { BUILDING_UPGRADES } from "features/game/events/landExpansion/upgradeBuilding";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { getKeys } from "features/game/types/decorations";
import { Inventory } from "features/game/types/game";
import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  wellLevel: number;
  coins: number;
  inventory: Inventory;
  handleUpgradeWaterWell: () => void;
}

export const UpgradeWaterWell: React.FC<Props> = ({
  open,
  onClose,
  wellLevel,
  coins,
  inventory,
  handleUpgradeWaterWell,
}) => {
  const WaterWellUpgradeCost = BUILDING_UPGRADES["Water Well"];

  if (wellLevel >= getKeys(WaterWellUpgradeCost).length) {
    return (
      <Modal show={open} onHide={onClose}>
        <Panel>
          <div className="flex flex-col gap-2 p-2">
            <Label type="default">{`Water Well`}</Label>
            <p>{`Your Water Well is already at maximum level!`}</p>
          </div>
        </Panel>
      </Modal>
    );
  }

  const { coins: upgradeCost = 0, items } = WaterWellUpgradeCost[wellLevel + 1];

  return (
    <Modal show={open} onHide={onClose}>
      <Panel>
        <div className="flex flex-col gap-2 p-2">
          <Label type={"default"}>{`Upgrade Water Well`}</Label>
          <p>{`Current Level: ${wellLevel}`}</p>
          <p>{`Upgrading your well will increase plot fertility.`}</p>
          <div className="flex flex-wrap gap-2 justify-between">
            <RequirementLabel
              type="coins"
              balance={coins}
              requirement={upgradeCost}
            />
            {getObjectEntries(items).map(([item, amount]) => (
              <RequirementLabel
                key={item}
                type="item"
                item={item}
                balance={inventory[item] ?? new Decimal(0)}
                requirement={amount ?? new Decimal(0)}
              />
            ))}
          </div>
        </div>
        <Button className="w-full" onClick={handleUpgradeWaterWell}>
          {`Upgrade to Level ${wellLevel + 1}`}
        </Button>
      </Panel>
    </Modal>
  );
};
