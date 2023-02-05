import React, { useContext, useEffect, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";

import { Button } from "components/ui/Button";
import { Equipped } from "features/game/types/bumpkin";

import { Context } from "../GameProvider";
import { Panel } from "components/ui/Panel";
import { ITEM_DETAILS } from "../types/images";
import token from "assets/icons/token_2.png";
import { TutorialStep } from "lib/tutorial";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { SUNNYSIDE } from "assets/sunnyside";
import mailbox from "assets/decorations/mailbox.png";
import { NPC } from "features/island/bumpkin/components/DynamicMiniNFT";

type Pages = 1 | 2 | 3;

export const Tutorial: React.FC = () => {
  const { gameService } = useContext(Context);
  const [state] = useActor(gameService);
  const milestone = state.context.tutorialStep as TutorialStep;

  console.log({ milestone });

  const [pageNumber, setPageNumber] = useState<Pages>(1);

  const acknowledge = () => {
    gameService.send("ACKNOWLEDGE");
  };

  const Content = () => {
    if (milestone === TutorialStep.SUNFLOWERS_HARVESTED) {
      console.log("REDN");
      if (pageNumber === 1) {
        return (
          <>
            <div className="space-y-3 text-sm p-2 mb-3">
              <p>You are a natural Farmer!</p>
              <div className="flex items-center">
                <p>Now it is time to earn some SFL</p>
                <img src={token} className="ml-1 h-6" />
              </div>
              <p>
                Sunflower Land Token (SFL) is used to buy more seeds, craft
                items and construct buildings.
              </p>
            </div>
            <Button onClick={() => setPageNumber(2)}>Next</Button>
          </>
        );
      }

      return (
        <>
          <div className="space-y-3 text-sm p-2 mb-3">
            <p>You can earn SFL by selling crops at the market.</p>
            <img
              src={ITEM_DETAILS["Market"].image}
              className="w-1/3 img-highlight-heavy m-auto"
            />
            <p>2. Visit the Market and sell Sunflowers</p>
          </div>
          <div className="flex space-x-1">
            <Button onClick={acknowledge}>Got it</Button>
          </div>
        </>
      );
    }

    if (milestone === TutorialStep.SUNFLOWERS_SOLD) {
      return (
        <>
          <div className="space-y-3 text-sm p-2 mb-3">
            <p>That was fast</p>
            <div className="flex items-center">
              <p>You've earned your first SFL!</p>
              <img src={token} className="ml-1 h-6" />
            </div>
            <p>Step 3: Buy 3 Sunflower Seeds</p>
          </div>
          <Button onClick={acknowledge}>Got it</Button>
        </>
      );
    }

    if (milestone === TutorialStep.SUNFLOWER_SEEDS_BOUGHT) {
      return (
        <>
          <div className="space-y-3 text-sm p-2 mb-3">
            <p>Great! Now you can plant these seeds.</p>
            <p>Find 3 empty plots and click on them to plant.</p>
            <img
              src={SUNNYSIDE.soil.soil2}
              className="w-1/4 mx-auto img-highlight-heavy relative"
              style={{ top: "-82px", marginBottom: "-62px" }}
            />
            <p>Step 4: Plant 3 Sunflower Seeds</p>
          </div>
          <Button onClick={acknowledge}>Got it</Button>
        </>
      );
    }

    if (milestone === TutorialStep.SUNFLOWER_SEEDS_PLANTED) {
      return (
        <>
          <div className="space-y-3 text-sm p-2 mb-3">
            <p>Nice work!</p>
            <p>
              It looks like you have mail. Visit the letterbox to view your
              letter
            </p>
            <img
              src={mailbox}
              className="w-8 mx-auto img-highlight-heavy relative"
            />
            <p>Goal: Read the mail</p>
          </div>
          <Button onClick={acknowledge}>Got it</Button>
        </>
      );
    }

    if (milestone === TutorialStep.POTATOES_GATHERED) {
      return (
        <>
          <div className="space-y-3 text-sm p-2 mb-3">
            <p>Potato blood is in your veins!</p>
            <p>It is time to cook these potatoes so we can eat them.</p>
            <p>You can visit the Fire Pit to cook meals for your Bumpkin.</p>
            <img
              src={ITEM_DETAILS["Fire Pit"].image}
              className="w-1/3 m-auto img-highlight-heavy"
            />
            <p>Goal: Cook Mashed Potato</p>
          </div>
          <Button onClick={acknowledge}>Got it</Button>
        </>
      );
    }

    if (milestone === TutorialStep.MASHED_POTATO_COOKED) {
      return (
        <>
          <div className="space-y-3 text-sm p-2 mb-3">
            <p>That looks delicious!</p>
            <p>Click on your Bumpkin to feed them the Mashed Potato</p>
            <div
              className="w-full flex justify-center"
              style={{ height: "70px" }}
            >
              <NPC {...state.context.state.bumpkin.equipped} />
            </div>
            <p>Goal: Feed your Bumpkin</p>
          </div>
          <Button onClick={acknowledge}>Got it</Button>
        </>
      );
    }

    if (milestone === TutorialStep.MASHED_POTATO_EATEN) {
      return (
        <>
          <div className="space-y-3 text-sm p-2 mb-3">
            <p>You just gained 3xp!</p>
            <p>
              Once you level up you will unlock more seeds, buildings &
              equipment.
            </p>

            <p>Goal: Grow Potatoes and Cook Mashed Potato</p>
          </div>
          <Button onClick={acknowledge}>Got it</Button>
        </>
      );
    }

    if (milestone === TutorialStep.LEVEL_TWO) {
      if (pageNumber === 1) {
        return (
          <>
            <div className="space-y-3 text-sm p-2 mb-3">
              <p>Congratulations, you reached level 2!</p>
              <p>You have unlocked Pumpkins, Carrots and a new skill point.</p>
              <p>
                You can use skill points to unlock enhanced farming abilities.
                These are available in your profile in the top left.
              </p>
            </div>
            <Button onClick={() => setPageNumber(2)}>Next</Button>
          </>
        );
      }

      return (
        <>
          <div className="space-y-3 text-sm p-2 mb-3">
            <p>Arghhhhh Goblins!</p>
            <img src={SUNNYSIDE.npcs.goblin} className="w-16 m-auto" />

            <p>
              I thought this place was deserted, it looks like they smelt our
              cooking and they are very hungry!
            </p>
            <p>
              These are mischevious creatures that can wreak havoc on your farm.
            </p>
            <p>If you feed them they will stay happy and give you bonus SFL.</p>
            <p>Goal: Feed the Goblins</p>
          </div>
          <Button onClick={acknowledge}>Got it</Button>
        </>
      );
    }
    return null;
  };

  return (
    <Modal show={true} centered>
      <Panel
        title="Welcome to Sunflower Isles"
        bumpkinParts={state.context.state.bumpkin?.equipped as Equipped}
      >
        <Content />
      </Panel>
    </Modal>
  );
};
