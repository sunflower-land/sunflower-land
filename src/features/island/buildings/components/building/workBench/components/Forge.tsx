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
  RockName,
  UpgradedResourceName,
} from "features/game/types/resources";
import React, { useContext, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { canUpgrade } from "features/game/events/landExpansion/upgradeNode";
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
      upgradeTo: selectedResource as Exclude<RockName, "Stone Rock">,
      id: uuidv4().slice(0, 8),
    });

    if (showAnimations) confetti();
    setShowSuccess(true);
  };

  const forgingSoon = selected.price === 0;

  return (
    <>
      <SplitScreenView
        panel={
          <CraftingRequirements
            gameState={state}
            details={{
              item: selectedResource,
            }}
            requirements={
              forgingSoon
                ? undefined
                : {
                    coins: selected.price,
                    resources: selected.ingredients(state.bumpkin.skills),
                  }
            }
            actionView={
              <Button
                onClick={forge}
                disabled={
                  forgingSoon ||
                  !canUpgrade(
                    state,
                    selectedResource as Exclude<RockName, "Stone Rock">,
                  )
                }
              >
                {t("forge")}
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
                  image={ITEM_DETAILS[resourceName]?.image}
                  className={
                    ADVANCED_RESOURCES[resourceName].price === 0
                      ? "opacity-75"
                      : "opacity-100"
                  }
                />
              );
            })}
          </>
        }
      />

      {showSuccess && (
        <Modal show={showSuccess} onHide={() => setShowSuccess(false)}>
          <Panel className="m-auto flex flex-col gap-2">
            <Label type="success">
              {t("upgrade.success", {
                resource: selectedResource,
              })}
            </Label>
            <div className="flex flex-col gap-2 my-2 items-center">
              <img src={ITEM_DETAILS[selectedResource].image} width={50} />
              <span>
                {t("upgrade.success.description", {
                  resource: selectedResource,
                })}
              </span>
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
