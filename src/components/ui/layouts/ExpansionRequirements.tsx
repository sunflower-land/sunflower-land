import Decimal from "decimal.js-light";
import { getBumpkinLevel } from "features/game/lib/level";
import { getKeys } from "features/game/types/craftables";
import {
  Bumpkin,
  ExpansionRequirements as IExpansionRequirements,
  Inventory,
} from "features/game/types/game";
import React from "react";
import { RequirementLabel } from "../RequirementsLabel";
import { InlineDialogue } from "features/world/ui/TypingMessage";
import { SUNNYSIDE } from "assets/sunnyside";
import lockIcon from "assets/skills/lock.png";

import { Label } from "../Label";
import { secondsToString } from "lib/utils/time";
import { OuterPanel } from "../Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
/**
 * The props for the component.
 * @param gameState The game state.
 * @param details The expansion details.
 * @param requirements The expansion requirement.
 * @param actionView The view for displaying the expansion action.
 */
interface Props {
  inventory: Inventory;
  coins: number;
  bumpkin: Bumpkin;
  details: DetailsProps;
  requirements: IExpansionRequirements;
  actionView?: JSX.Element;
}

/**
 * The props for the details.
 * @param title The title.
 * @param description The description.
 */
interface DetailsProps {
  description: string;
}

/**
 * The view for displaying expansion details, requirements and action.
 * @props The component props.
 */
export const ExpansionRequirements: React.FC<Props> = ({
  inventory,
  bumpkin,
  details,
  requirements,
  actionView,
  coins,
}: Props) => {
  const { t } = useAppTranslation();

  const hasLevel =
    getBumpkinLevel(bumpkin.experience) >= requirements.bumpkinLevel;

  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-col justify-center p-2">
        <Label
          type="default"
          icon={SUNNYSIDE.icons.player}
          className="capitalize mb-2"
        >
          {`Grimbly`}
        </Label>
        <div
          style={{
            minHeight: "50px",
          }}
          className="mb-2"
        >
          <InlineDialogue trail={25} message={details.description} />
        </div>
        <div className="mb-2 flex justify-between items-center">
          <Label type={"default"} icon={SUNNYSIDE.icons.basket}>
            {t("requirements")}
          </Label>
          <Label
            type="info"
            icon={SUNNYSIDE.icons.stopwatch}
            secondaryIcon={SUNNYSIDE.icons.hammer}
          >
            {secondsToString(requirements.seconds, { length: "medium" })}
          </Label>
        </div>

        <OuterPanel className="-ml-2 -mr-2 relative flex flex-col space-y-0.5">
          {!!requirements.coins && (
            <RequirementLabel
              key={"coins"}
              type="coins"
              balance={coins}
              showLabel
              requirement={requirements.coins}
            />
          )}
          {getKeys(requirements.resources).map((itemName) => {
            return (
              <RequirementLabel
                key={itemName}
                type="item"
                item={itemName}
                balance={inventory[itemName] ?? new Decimal(0)}
                showLabel
                requirement={new Decimal(requirements.resources[itemName] ?? 0)}
              />
            );
          })}
        </OuterPanel>

        {!hasLevel && (
          <>
            <Label type="danger" icon={lockIcon} className="my-2">
              {t("warning.level.required", {
                lvl: requirements.bumpkinLevel,
              })}
            </Label>
            <p className="text-xs mb-2">{t("statements.visit.firePit")}</p>
          </>
        )}
      </div>
      {actionView}
    </div>
  );
};
