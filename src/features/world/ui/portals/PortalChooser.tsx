import React, { useState } from "react";
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
import { translate } from "lib/i18n/translate";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { MineWhack } from "./MineWhack";
import { Memory } from "./Memory";

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
  npc: NPCName;
  title: string;
  description: string;
  component: React.FC<{ onClose: () => void }>;
}

export const PORTAL_OPTIONS: PortalOption[] = [
  {
    id: "chicken-rescue",
    npc: "billy",
    title: translate("portal.chickenRescue.title"),
    description: translate("portal.chickenRescue.description"),
    component: ChickenRescue,
  },
  {
    id: "crops-and-chickens",
    npc: "cluck e cheese",
    title: translate("portal.cropsAndChickens.title"),
    description: translate("portal.cropsAndChickens.description"),
    component: CropsAndChickens,
  },
  {
    id: "fruit-dash",
    npc: "felga",
    title: translate("portal.fruitDash.title"),
    description: translate("portal.fruitDash.description"),
    component: FruitDash,
  },
  {
    id: "mine-whack",
    npc: "minewhack",
    title: translate("portal.mineWhack.title"),
    description: translate("portal.mineWhack.description"),
    component: MineWhack,
  },
  {
    id: "memory",
    npc: "memory",
    title: translate("portal.memory.title"),
    description: translate("portal.memory.description"),
    component: Memory,
  },
];

export const PortalChooser: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { t } = useAppTranslation();
  const [selectedGame, setSelectedGame] = useState<MinigameName>();
  const [showIntro, setShowIntro] = useState(!hasReadIntro());

  if (showIntro) {
    return (
      <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES["billy"]}>
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
      </CloseButtonPanel>
    );
  }

  const selectedOption = PORTAL_OPTIONS.find(
    (game) => game.id === selectedGame,
  );
  if (selectedOption) {
    const GameComponent = selectedOption.component;
    return (
      <CloseButtonPanel
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES[selectedOption.npc]}
      >
        <GameComponent onClose={onClose} />
      </CloseButtonPanel>
    );
  }

  return (
    <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES["billy"]}>
      <div className="flex flex-col items-center">
        <div className="p-2">
          <Label type="default" icon={SUNNYSIDE.icons.player}>
            {`Choose your adventure!`}
          </Label>
        </div>

        <div className="flex flex-col gap-1 w-full">
          {PORTAL_OPTIONS.map(({ id, npc, title, description }) => (
            <ButtonPanel
              key={id}
              className="flex flex-row items-center gap-2"
              onClick={() => setSelectedGame(id)}
            >
              {npc && <NPCIcon parts={NPC_WEARABLES[npc]} />}
              <div className="flex flex-col items-start gap-1">
                <span className="text-sm">{title}</span>
                <span className="text-xs mt-1">{description}</span>
              </div>
            </ButtonPanel>
          ))}
        </div>
      </div>
    </CloseButtonPanel>
  );
};
