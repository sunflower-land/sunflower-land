import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { useNavigate } from "react-router";

import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { isBuildingDestroyed } from "features/island/buildings/components/building/Building";
import type { BuildingName } from "features/game/types/buildings";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { FarmSurface } from "../core/surface";
import { InteriorBumpkins } from "features/home/components/InteriorBumpkins";
import { useVisiting } from "lib/utils/visitUtils";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { interiorRoomRect } from "../layers/InteriorBackdropLayer";
import { useWorldAnchor } from "../bridge/useWorldAnchor";
import type { GameBridge } from "../bridge/GameBridge";

/**
 * Home-interior chrome that stays React [home/Home.tsx]: the unplaced-bumpkin
 * row above the room and the exit button below it. Both are anchored to the
 * room so they track the camera; the room art, painting and every placement
 * are Phaser.
 */

const ROOM_ANCHOR = "interior-room";

/** [Home.tsx] the one-time Pumpkin Pete welcome. */
function hasReadHomeIntro() {
  return !!localStorage.getItem("home.intro");
}
function acknowledgeHomeIntro() {
  localStorage.setItem("home.intro", new Date().toISOString());
}

const _island = (state: MachineState) => state.context.state.island;
const _landscaping = (state: MachineState) => state.matches("landscaping");

export const InteriorUI: React.FC<{
  bridge: GameBridge;
  location: FarmSurface;
}> = ({ bridge, location }) => {
  const { gameService } = useContext(Context);
  const { isVisiting } = useVisiting();
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const island = useSelector(gameService, _island);
  const landscaping = useSelector(gameService, _landscaping);

  // Anchor to the room ART box, which is what the DOM positions this chrome
  // against [Home.tsx] — not the inset placement grid.
  const petHouseLevel = useSelector(
    gameService,
    (state: MachineState) => state.context.state.petHouse?.level ?? 1,
  );
  const expansion = useSelector(
    gameService,
    (state: MachineState) => state.context.state.interior.expansion,
  );
  const room = interiorRoomRect(
    location,
    island.type,
    petHouseLevel,
    expansion,
  );
  React.useEffect(() => {
    if (!room) return;
    bridge.anchors.setAnchor(ROOM_ANCHOR, room);
    return () => bridge.anchors.removeAnchor(ROOM_ANCHOR);
  }, [bridge, room?.x, room?.y, room?.width, room?.height]);

  const dealActive = !!React.useSyncExternalStore(
    (onChange) => bridge.animalDeal.subscribe(onChange),
    () => bridge.animalDeal.get(),
  );

  // [BarnInside.tsx / GreenhouseInside.tsx] a calendar event that destroyed
  // this building kicks the player back to the farm. Only those two DOM
  // screens guard for it.
  const DESTRUCTIBLE: Partial<Record<FarmSurface, BuildingName>> = {
    barn: "Barn",
    greenhouse: "Greenhouse",
  };
  const buildingName = DESTRUCTIBLE[location];
  const destroyed = useSelector(
    gameService,
    (state: MachineState) =>
      !!buildingName &&
      isBuildingDestroyed({
        name: buildingName,
        calendar: state.context.state.calendar,
      }),
  );
  React.useEffect(() => {
    if (destroyed) navigate("/");
  }, [destroyed, navigate]);

  const [showIntro, setShowIntro] = React.useState(
    () => location === "home" && !hasReadHomeIntro() && !isVisiting,
  );

  const rect = useWorldAnchor(ROOM_ANCHOR);
  if (!rect?.visible) return null;

  return (
    <>
      {/* [Home.tsx] first-visit intro */}
      <Modal show={showIntro}>
        <SpeakingModal
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
          message={[
            { text: t("home-intro.one") },
            { text: t("home-intro.two") },
            { text: t("home-intro.three") },
          ]}
          onClose={() => {
            setShowIntro(false);
            acknowledgeHomeIntro();
          }}
        />
      </Modal>
      {/* Only the house has the unplaced-bumpkin row [Home.tsx]. */}
      {location === "home" && !isVisiting && (
        <div
          className="absolute pointer-events-auto"
          style={{
            left: `${rect.left}px`,
            top: `${rect.top - 64}px`,
            width: `${rect.width}px`,
          }}
        >
          <InteriorBumpkins />
        </div>
      )}

      {/* The interior floors navigate by stairs + HUD, not an exit button
          [Interior.tsx]. */}
      {!landscaping &&
        !dealActive &&
        location !== "interior" &&
        location !== "level_one" && (
          <div
            className="absolute pointer-events-auto"
            style={{
              left: `${rect.left}px`,
              top: `${rect.top + rect.height + 16}px`,
              width: `${rect.width}px`,
            }}
          >
            <Button
              onClick={() =>
                navigate(
                  isVisiting
                    ? `/visit/${gameService.getSnapshot().context.farmId}`
                    : "/",
                )
              }
            >
              {t("exit")}
            </Button>
          </div>
        )}
    </>
  );
};
