import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import { EXPANSION_ORIGINS, LAND_SIZE } from "../lib/constants";
import { UpcomingExpansionModal } from "./UpcomingExpansionModal";
import { Coordinates, MapPlacement } from "./MapPlacement";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Pontoon } from "./Pontoon";

import { Context } from "features/game/GameProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import landComplete from "assets/land/land_complete.png";
import lockIcon from "assets/skills/lock.png";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useActor } from "@xstate/react";
import { Revealing } from "features/game/components/Revealing";
import { Panel } from "components/ui/Panel";
import { Revealed } from "features/game/components/Revealed";
import { gameAnalytics } from "lib/gameAnalytics";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { getBumpkinLevel } from "features/game/lib/level";
import { Label } from "components/ui/Label";
import { NPC_WEARABLES } from "lib/npcs";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { ITEM_DETAILS } from "features/game/types/images";
import { craftingRequirementsMet } from "features/game/lib/craftingRequirement";
import classNames from "classnames";
import {
  ExpansionRequirements,
  GameState,
  Inventory,
} from "features/game/types/game";
import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `expansion-read.${host}-${window.location.pathname}`;

function acknowledgeRead() {
  localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toString());
}

function hasRead() {
  return !!localStorage.getItem(LOCAL_STORAGE_KEY);
}

interface ExpandIconProps {
  onOpen: () => void;
  requirements: ExpansionRequirements;
  position: Coordinates;
  isLocked: boolean;
  canExpand: boolean;
  showHelper: boolean;
  inventory: Inventory;
}
export const ExpandIcon: React.FC<ExpandIconProps> = ({
  onOpen,
  requirements,
  position,
  isLocked,
  canExpand,
  showHelper,
  inventory,
}) => {
  const [showLockedModal, setShowLockedModal] = useState(false);

  const showRequirements = inventory["Basic Land"]?.lte(5);

  return (
    <>
      <Modal
        centered
        show={showLockedModal}
        onHide={() => setShowLockedModal(false)}
      >
        <CloseButtonPanel onClose={() => setShowLockedModal(false)}>
          <div className="flex flex-col items-center">
            <Label className="mt-2" icon={lockIcon} type="danger">
              {translate("lvl")} {requirements.bumpkinLevel}{" "}
              {translate("required")}
            </Label>
            <img
              src={ITEM_DETAILS.Hammer.image}
              className="w-10 mx-auto my-2"
            />
            <p className="text-sm text-center mb-2">
              {translate("statements.visit.firePit")}
            </p>
          </div>
        </CloseButtonPanel>
      </Modal>

      <MapPlacement
        x={position.x - LAND_SIZE / 2}
        y={position.y + LAND_SIZE / 2}
        height={LAND_SIZE}
        width={LAND_SIZE}
      >
        <div className="w-full h-full flex flex-col items-center justify-center opacity-100">
          <img
            src={SUNNYSIDE.icons.expand}
            width={18 * PIXEL_SCALE}
            className={classNames(
              `relative cursor-pointer hover:img-highlight`,
              {
                "animate-pulsate": showHelper,
              }
            )}
            onClick={() => {
              if (isLocked) {
                setShowLockedModal(true);
              } else {
                onOpen();
              }
            }}
          />
          {showRequirements && (
            <>
              <div className="flex mt-2 flex-wrap justify-center px-4 items-center">
                {getKeys(requirements.resources ?? {})
                  .filter((name) => name !== "Block Buck")
                  .map((name) => (
                    <div className="mr-3 flex items-center mb-1" key={name}>
                      <RequirementLabel
                        type="item"
                        item={name}
                        requirement={
                          new Decimal(requirements.resources[name] ?? 0)
                        }
                        balance={inventory[name] ?? new Decimal(0)}
                      />
                      {inventory[name]?.gte(
                        requirements.resources[name] ?? 0
                      ) && (
                        <img
                          src={SUNNYSIDE.icons.confirm}
                          className="h-4 ml-0.5"
                        />
                      )}
                    </div>
                  ))}
              </div>
              {isLocked && (
                <Label type="default" icon={lockIcon} className="mt-2">
                  {translate("lvl")} {requirements.bumpkinLevel}
                </Label>
              )}
            </>
          )}
          {!showRequirements && (
            <>
              {canExpand ? (
                <Label
                  type="default"
                  icon={SUNNYSIDE.icons.confirm}
                  className="mt-2"
                >
                  {translate("expand")}
                </Label>
              ) : (
                <Label
                  type="default"
                  icon={SUNNYSIDE.icons.cancel}
                  className="mt-2"
                >
                  {translate("expand")}
                </Label>
              )}
            </>
          )}
        </div>
      </MapPlacement>
    </>
  );
};

export const ExpansionBuilding: React.FC<{
  state: GameState;
  onDone: () => void;
  onReveal: () => void;
}> = ({ state, onDone, onReveal }) => {
  // Land is still being built
  if (state.expansionConstruction) {
    const origin =
      EXPANSION_ORIGINS[state.inventory["Basic Land"]?.toNumber() ?? 3];

    // Being Built
    if (state.expansionConstruction.readyAt > Date.now()) {
      return (
        <MapPlacement
          x={origin.x - LAND_SIZE / 2}
          y={origin.y + LAND_SIZE / 2}
          height={LAND_SIZE}
          width={LAND_SIZE}
        >
          <Pontoon onDone={onDone} expansion={state.expansionConstruction} />
        </MapPlacement>
      );
    }

    // Ready
    return (
      <MapPlacement
        x={origin.x - LAND_SIZE / 2}
        y={origin.y + LAND_SIZE / 2}
        height={LAND_SIZE}
        width={LAND_SIZE}
      >
        <img
          src={landComplete}
          className="absolute cursor-pointer hover:img-highlight"
          onClick={onReveal}
          style={{
            width: `${PIXEL_SCALE * 66}px`,
            left: `${PIXEL_SCALE * 18}px`,
            bottom: `${PIXEL_SCALE * 12}px`,
          }}
        />
        <div
          className="absolute pointer-events-none animate-pulsate"
          style={{
            width: `${PIXEL_SCALE * 20}px`,
            left: `${PIXEL_SCALE * 42}px`,
            bottom: `${PIXEL_SCALE * 36}px`,
          }}
        >
          <img src={SUNNYSIDE.icons.disc} className="w-full" />
          <img
            src={SUNNYSIDE.icons.confirm}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 12}px`,
              left: `${PIXEL_SCALE * 4}px`,
              bottom: `${PIXEL_SCALE * 5}px`,
            }}
          />
        </div>
      </MapPlacement>
    );
  }

  return null;
};
/**
 * The next piece of land to expand into
 */
export const UpcomingExpansion: React.FC = () => {
  const [_, setRender] = useState(0);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showIntro, setShowIntro] = useState(!hasRead());
  const { openModal } = useContext(ModalContext);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showBumpkinModal, setShowBumpkinModal] = useState(false);

  const state = gameState.context.state;

  const playing = gameState.matches("playing");
  const { t } = useAppTranslation();

  useEffect(() => {
    if (isRevealing && playing) {
      setIsRevealing(false);
    }
  }, [gameState.value]);

  const onExpand = () => {
    gameService.send("land.expanded");
    gameService.send("SAVE");

    const blockBucks =
      gameState.context.state.expansionRequirements?.resources["Block Buck"] ??
      0;
    if (blockBucks) {
      gameAnalytics.trackSink({
        currency: "Block Buck",
        amount: blockBucks,
        item: "Basic Land",
        type: "Fee",
      });
    }

    const expansions =
      (gameState.context.state.inventory["Basic Land"]?.toNumber() ?? 3) + 1;
    gameAnalytics.trackMilestone({
      event: `Farm:Expanding:Expansion${expansions}`,
    });

    setShowBumpkinModal(false);
  };

  const onReveal = () => {
    setIsRevealing(true);
    const state = gameService.send("land.revealed");
    gameService.send("SAVE");

    if (state.context.state.inventory["Basic Land"]?.eq(4)) {
      openModal("FIRST_EXPANSION");
    } else {
      openModal("NEXT_EXPANSION");
    }
  };

  const nextPosition =
    EXPANSION_ORIGINS[state.inventory["Basic Land"]?.toNumber() ?? 0];

  const isLocked =
    getBumpkinLevel(state.bumpkin?.experience ?? 0) <
    (state.expansionRequirements?.bumpkinLevel ?? 0);

  const canExpand = craftingRequirementsMet(state, state.expansionRequirements);

  const showHelper =
    canExpand &&
    (state.bumpkin?.activity?.["Tree Chopped"] ?? 0) >= 3 &&
    // Only pulsate first 5 times
    state.inventory["Basic Land"]?.lte(4);

  return (
    <>
      {state.expansionConstruction && (
        <ExpansionBuilding
          state={state}
          onDone={() => setRender((r) => r + 1)}
          onReveal={onReveal}
        />
      )}

      {!state.expansionConstruction && state.expansionRequirements && (
        <ExpandIcon
          canExpand={canExpand}
          inventory={state.inventory}
          isLocked={isLocked}
          onOpen={() => setShowBumpkinModal(true)}
          position={nextPosition}
          requirements={state.expansionRequirements as ExpansionRequirements}
          showHelper={showHelper ?? false}
        />
      )}

      {gameState.matches("revealing") && isRevealing && (
        <Modal show centered>
          <CloseButtonPanel>
            <Revealing icon={SUNNYSIDE.npcs.goblin_hammering} />
          </CloseButtonPanel>
        </Modal>
      )}

      {gameState.matches("revealed") && isRevealing && (
        <Modal show centered>
          <Panel>
            <Revealed />
          </Panel>
        </Modal>
      )}
      <Modal
        show={showBumpkinModal}
        onHide={() => setShowBumpkinModal(false)}
        centered
      >
        {showIntro && (
          <SpeakingModal
            message={[
              {
                text: translate("grimbly.expansion.one"),
              },
              {
                text: translate("grimbly.expansion.two"),
              },
            ]}
            onClose={() => {
              acknowledgeRead();
              setShowIntro(false);
            }}
            bumpkinParts={NPC_WEARABLES.grimbly}
          />
        )}

        {!showIntro && (
          <CloseButtonPanel
            bumpkinParts={NPC_WEARABLES.grimbly}
            title={t("explorer.description")}
            onClose={() => setShowBumpkinModal(false)}
          >
            <UpcomingExpansionModal
              gameState={state}
              onClose={() => setShowBumpkinModal(false)}
              onExpand={onExpand}
            />
          </CloseButtonPanel>
        )}
      </Modal>
    </>
  );
};
