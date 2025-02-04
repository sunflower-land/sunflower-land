import React, { useContext, useState } from "react";
import { ButtonPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { ChickenRescue } from "./ChickenRescue";
import { CropsAndChickens } from "./CropsAndChickens";
import { FruitDash } from "./FruitDash";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES, NPCName } from "lib/npcs";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MinigameName } from "features/game/types/minigames";
import { Halloween } from "./Halloween";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { hasFeatureAccess } from "lib/flags";

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `portal-chooser-${host}-${window.location.pathname}`;

function hasReadIntro() {
  return !!localStorage.getItem(LOCAL_STORAGE_KEY);
}

function acknowledgeIntroRead() {
  localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toString());
}

/**
 * Add a new portal option here
 *
 * @param id: The id of the minigame
 * @param npc: The NPC that will be displayed in the button
 * @param title: The title of the portal
 * @param description: The description of the portal
 * @param component: The portal component to be displayed when the button is clicked
 */

interface PortalOption {
  id: MinigameName;
  npc?: NPCName;
  title: string;
  description: string;
  component: React.FC<{ onClose: () => void }>;
}

const PORTAL_OPTIONS: PortalOption[] = [
  {
    id: "chicken-rescue",
    npc: "billy",
    title: "Chicken Rescue",
    description:
      "Help rescue the chickens while avoiding tricky obstacles in this survival challenge!",
    component: ChickenRescue,
  },
  {
    id: "crops-and-chickens",
    npc: "cluck e cheese",
    title: "Crops & Chickens",
    description:
      "Race against time to collect crops while dodging chickens in this fast-paced challenge!",
    component: CropsAndChickens,
  },
  {
    id: "fruit-dash",
    npc: "felga",
    title: "Fruit Dash",
    description:
      "Survive as long as you can collecting fruits while dodging obstacles in this endless challenge!",
    component: FruitDash,
  },
  {
    id: "halloween",
    npc: "luna",
    title: "Halloween",
    description:
      "Brave the haunted mansion, collect torches, and outrun ghosts in this spooky survival challenge!",
    component: Halloween,
  },
];

const _state = (state: MachineState) => state.context.state;

export const PortalChooser: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { t } = useAppTranslation();
  const [selectedGame, setSelectedGame] = useState<MinigameName>();
  const [showIntro, setShowIntro] = useState(!hasReadIntro());
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  if (showIntro) {
    return (
      <SpeakingText
        message={[
          { text: t("minigame.discovered.one") },
          { text: t("minigame.discovered.two") },
        ]}
        onClose={() => {
          setShowIntro(false);
          acknowledgeIntroRead();
        }}
      />
    );
  }

  const selectedOption = PORTAL_OPTIONS.find(
    (game) => game.id === selectedGame,
  );
  if (selectedOption) {
    const GameComponent = selectedOption.component;
    return <GameComponent onClose={onClose} />;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="p-2">
        <Label type="default" icon={SUNNYSIDE.icons.player}>
          {`Choose your adventure!`}
        </Label>
      </div>

      <div className="flex flex-col gap-1 w-full">
        {PORTAL_OPTIONS.filter(
          ({ id }) =>
            id !== "halloween" || hasFeatureAccess(state, "HALLOWEEN_2024"),
        ).map(({ id, npc, title, description }) => (
          <ButtonPanel
            key={id}
            className="flex flex-row items-center gap-2"
            onClick={() => setSelectedGame(id)}
          >
            {npc && <NPCIcon parts={NPC_WEARABLES[npc]} />}
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold">{title}</span>
              <span className="text-xs mt-1">{description}</span>
            </div>
          </ButtonPanel>
        ))}
      </div>
    </div>
  );
};
