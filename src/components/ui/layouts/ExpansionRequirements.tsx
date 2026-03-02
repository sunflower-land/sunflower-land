import Decimal from "decimal.js-light";
import { getBumpkinLevel } from "features/game/lib/level";
import { getKeys } from "features/game/types/craftables";
import {
  Bumpkin,
  GameState,
  ExpansionRequirements as IExpansionRequirements,
  Inventory,
} from "features/game/types/game";
import React, { useContext, useEffect } from "react";
import { RequirementLabel } from "../RequirementsLabel";
import { InlineDialogue } from "features/world/ui/TypingMessage";
import { SUNNYSIDE } from "assets/sunnyside";

import { Label } from "../Label";
import { secondsToString } from "lib/utils/time";
import { InnerPanel } from "../Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { ResizableBar } from "../ProgressBar";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { expansionRequirements } from "features/game/events/landExpansion/revealLand";
import { Button } from "../Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { gameAnalytics } from "lib/gameAnalytics";
import { Context } from "features/game/GameProvider";
import { craftingRequirementsMet } from "features/game/lib/craftingRequirement";
import { getInstantGems } from "features/game/events/landExpansion/speedUpRecipe";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
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
  state: GameState;
  onClose: () => void;
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
  coins,
  state,
  onClose,
}: Props) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const hasLevel =
    getBumpkinLevel(bumpkin.experience) >= requirements.bumpkinLevel;

  const onExpand = () => {
    gameService.send({ type: "land.expanded" });
    gameService.send({ type: "SAVE" });

    const blockBucks = requirements?.resources["Gem"] ?? 0;
    if (blockBucks) {
      gameAnalytics.trackSink({
        currency: "Gem",
        amount: blockBucks,
        item: "Basic Land",
        type: "Fee",
      });
    }

    const expansions = (state.inventory["Basic Land"]?.toNumber() ?? 3) + 1;

    gameAnalytics.trackMilestone({
      event: `Farm:Expanding:Expansion${expansions}`,
    });

    onClose();
  };

  const canExpand = craftingRequirementsMet(state, requirements);

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

        <InnerPanel className="-ml-2 -mr-2 relative flex flex-col space-y-0.5">
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
        </InnerPanel>

        {!hasLevel && (
          <>
            <Label type="danger" icon={SUNNYSIDE.icons.lock} className="my-2">
              {t("warning.level.required", {
                lvl: requirements.bumpkinLevel,
              })}
            </Label>
            <p className="text-xs mb-2">{t("statements.visit.firePit")}</p>
          </>
        )}
      </div>
      <Button onClick={onExpand} disabled={!canExpand}>
        {t("expand")}
      </Button>
    </div>
  );
};

export const Expanding: React.FC<{
  state: GameState;
  onClose: () => void;
  onInstantExpanded: () => void;
}> = ({ state, onClose, onInstantExpanded }) => {
  const { t } = useAppTranslation();
  const readyAt = state.expansionConstruction?.readyAt ?? 0;

  const { requirements } = expansionRequirements({ game: state });
  const totalSeconds = requirements?.seconds ?? 0;
  const { totalSeconds: secondsTillReady, ...ready } = useCountdown(
    readyAt ?? 0,
  );

  const gems = getInstantGems({
    readyAt: readyAt as number,
    game: state,
  });

  const hasAccess = !hasRequiredIslandExpansion(state.island.type, "desert");

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() > readyAt) {
        onClose();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="p-1 ">
        <Label
          type="default"
          icon={SUNNYSIDE.icons.stopwatch}
        >{`In progress`}</Label>
        <p className="text-sm my-2">{t("crafting.expansionSoon")}</p>
        <div className="flex items-center mb-1">
          <div>
            <div className="relative flex flex-col w-full">
              <div className="flex items-center gap-x-1">
                <ResizableBar
                  percentage={(1 - secondsTillReady! / totalSeconds) * 100}
                  type="progress"
                />
                <TimerDisplay time={ready} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        <Button onClick={onClose}>{t("close")}</Button>
        {hasAccess && (
          <Button
            disabled={!state.inventory.Gem?.gte(gems)}
            className="relative ml-1"
            onClick={onInstantExpanded}
          >
            {t("gems.speedUp")}
            <Label
              type={state.inventory.Gem?.gte(gems) ? "default" : "danger"}
              icon={ITEM_DETAILS.Gem.image}
              className="flex absolute right-0 -top-5"
            >
              {gems}
            </Label>
          </Button>
        )}
      </div>
    </>
  );
};
