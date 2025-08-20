import confetti from "canvas-confetti";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "@xstate/react";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/lib/crafting";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  ADVANCED_RESOURCES,
  UpgradedResourceName,
} from "features/game/types/resources";
import React, { useContext, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasPlacedStones } from "features/game/events/landExpansion/upgradeNode";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";

export const Forge: React.FC = () => {
  const { gameService, showAnimations } = useContext(Context);
  const { t } = useAppTranslation();
  const [selectedResource, setSelectedResource] =
    useState<UpgradedResourceName>("Fused Stone Rock");
  const [showSuccess, setShowSuccess] = useState(false);

  const state = useSelector(gameService, (state) => state.context.state);
  const selected = ADVANCED_RESOURCES[selectedResource];

  const forge = () => {
    gameService.send({
      type: "stone.upgraded",
      upgradeTo: selectedResource,
      id: uuidv4().slice(0, 8),
    });

    if (showAnimations) confetti();
    setShowSuccess(true);
  };

  return (
    <>
      <SplitScreenView
        panel={
          <CraftingRequirements
            gameState={state}
            details={{
              item: selectedResource,
            }}
            requirements={{
              coins: selected.price,
              resources: selected.ingredients,
            }}
            actionView={
              <Button
                onClick={forge}
                disabled={!hasPlacedStones(state, selectedResource)}
              >
                {"Forge"}
              </Button>
            }
          />
        }
        content={
          <>
            {getKeys(ADVANCED_RESOURCES).map((resourceName) => {
              return (
                <Box
                  isSelected={selectedResource === resourceName}
                  key={resourceName}
                  onClick={() => setSelectedResource(resourceName)}
                  image={ITEM_DETAILS[resourceName].image}
                  // count={inventory[resourceName]}
                  // secondaryImage={isLocked ? SUNNYSIDE.icons.lock : undefined}
                  // showOverlay={isLocked}
                />
              );
            })}
          </>
        }
      />

      {showSuccess && (
        <Modal show={showSuccess} onHide={() => setShowSuccess(false)}>
          <Panel className="m-auto flex flex-col gap-2">
            <Label type="success">{"Stone Upgrade Complete!"}</Label>
            <div className="flex flex-col gap-2 my-2 items-center">
              <img src={ITEM_DETAILS[selectedResource].image} width={50} />
              <span>{"You discovered a new resource!"}</span>
              <Button onClick={() => setShowSuccess(false)}>
                {t("continue")}
              </Button>
            </div>
          </Panel>
        </Modal>
      )}
    </>
  );
};
