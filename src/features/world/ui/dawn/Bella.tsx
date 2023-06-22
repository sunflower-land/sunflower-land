import { useActor } from "@xstate/react";
import { ResizableBar } from "components/ui/ProgressBar";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { PARTY_COOLDOWN } from "features/game/events/landExpansion/prepareDawnParty";
import { InventoryItemName, Party } from "features/game/types/game";
import { NPC_WEARABLES } from "lib/npcs";
import { secondsToString } from "lib/utils/time";
import React, { useContext, useState } from "react";
import chest from "assets/icons/chest.png";
import { getKeys } from "features/game/types/craftables";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { Revealed } from "features/game/components/Revealed";

const MILESTONES = [3, 8, 14, 22];
interface Props {
  onClose: () => void;
}
export const Bella: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showModal, setShowModal] = useState(false);

  const party = gameState.context.state.dawnBreaker?.party as Party;

  const deliver = () => {
    const isReward = MILESTONES.includes((party.fulfilledCount ?? 0) + 1);

    console.log({ isReward, count: party.fulfilledCount });
    // Go off to server to reveal reward
    if (isReward) {
      gameService.send("REVEAL", {
        event: {
          type: "dawnParty.prepared",
          createdAt: new Date(),
        },
      });
    } else {
      console.log("YEET");
      gameService.send("dawnParty.prepared");
    }
  };
  const Progress = () => {
    const nextMilestoneIndex = MILESTONES.findIndex(
      (num) => num > (party.fulfilledCount ?? 0)
    );
    let milestone = MILESTONES[nextMilestoneIndex];
    let progress = party.fulfilledCount ?? 0;
    if (nextMilestoneIndex > 0) {
      progress -= MILESTONES[nextMilestoneIndex - 1];
      milestone -= MILESTONES[nextMilestoneIndex - 1];
    }

    return (
      <div className="flex flex-col items-center">
        <p className="text-xs">Next reward</p>
        <div className="flex relative  mt-1" style={{ width: "fit-content" }}>
          <ResizableBar
            percentage={(progress / milestone) * 100}
            type="progress"
            outerDimensions={{
              width: 80,
              height: 10,
            }}
          />
          <span
            className="absolute text-xs"
            style={{
              left: "93px",
              top: "3px",
              fontSize: "16px",
            }}
          >
            {`${progress}/${milestone}`}
          </span>
          <img
            src={chest}
            className={"absolute h-8 shadow-lg"}
            style={{
              right: 0,
              top: "-4px",
            }}
          />
        </div>
      </div>
    );
  };

  if (gameState.matches("revealing")) {
    return (
      <Panel>
        <p className="p-2 loading">Loading</p>
      </Panel>
    );
  }

  if (gameState.matches("revealed")) {
    return (
      <Panel>
        <Revealed onAcknowledged={onClose} />
      </Panel>
    );
  }

  if (showModal) {
    const requirements = party.requirements as Partial<
      Record<InventoryItemName, number>
    >;

    if (party.fulfilledCount === 22) {
      return (
        <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES.bella}>
          <div className="p-2">
            <p className="text-sm mb-2">
              We have fed all of these hungry Bumpkins. Time to relax!
            </p>
            <p className="text-sm">Time to relax!</p>
          </div>
        </CloseButtonPanel>
      );
    }

    const fulfilledAt = party.fulfilledAt ?? 0;
    const secondsLeft = (fulfilledAt + PARTY_COOLDOWN - Date.now()) / 1000;

    if (secondsLeft > 0) {
      return (
        <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES.bella}>
          <div className="p-2 flex flex-col items-center">
            <Progress />
            <p className="text-sm my-2 text-center">Thanks for your help!</p>
            <p className="text-sm mb-2  text-center">
              Could you come back later to help again?
            </p>
            <Label type="info">
              {secondsToString(secondsLeft, { length: "full" })}
            </Label>
          </div>
        </CloseButtonPanel>
      );
    }

    const hasIngredients = getKeys(requirements).every((name) =>
      gameState.context.state.inventory[name]?.gte(requirements[name] ?? 0)
    );

    return (
      <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES.bella}>
        <div className="p-2">
          <Progress />

          <p className="text-sm text-center mt-3 mb-2">
            Can you please bring me the following
          </p>
          <div className="flex flex-col items-center mb-2">
            {getKeys(requirements).map((ingredientName, index) => (
              <RequirementLabel
                key={index}
                type="item"
                showLabel
                item={ingredientName}
                balance={
                  gameState.context.state.inventory[ingredientName] ??
                  new Decimal(0)
                }
                requirement={new Decimal(requirements[ingredientName] ?? 0)}
              />
            ))}
          </div>
          <Button onClick={deliver} disabled={!hasIngredients}>
            Deliver
          </Button>
        </div>
      </CloseButtonPanel>
    );
  }

  if (party.fulfilledCount === 22) {
    return (
      <SpeakingModal
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES["bella"]}
        message={[
          {
            text: "Oh, thank goodness for all of your help.",
          },
          {
            text: `We now have enough food to feed these Bumpkins`,
          },
        ]}
      />
    );
  }
  return (
    <>
      <SpeakingModal
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES["bella"]}
        message={[
          {
            text: "Oh, thank goodness you're here! I can't catch a break.",
          },
          {
            text: `I'm completely overwhelmed with preparations for the party. Look at all these Bumpkins who've arrived!`,
          },
          {
            text: `If you help me gather wood and food I will reward you!`,
            actions: [
              {
                text: "No",
                cb: onClose,
              },
              {
                text: "Sure, let's do it",
                cb: () => {
                  setShowModal(true);
                },
              },
            ],
          },
        ]}
      />
    </>
  );
};
