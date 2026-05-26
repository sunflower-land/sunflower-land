import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { ButtonPanel, ColorPanel, Panel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { ChickenRescue } from "./ChickenRescue";
import { CropsAndChickens } from "./CropsAndChickens";
import { FruitDash } from "./FruitDash";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES, type NPCName } from "lib/npcs";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { MinigameName } from "features/game/types/minigames";
import { translate } from "lib/i18n/translate";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { MineWhack } from "./MineWhack";
import { Memory } from "./Memory";
import { Context as GameContext } from "features/game/GameProvider";
import { hasFeatureAccess } from "lib/flags";
import { ChaacsTemple } from "./ChaacsTemple";

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
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<MinigameName>();
  const [showIntro, setShowIntro] = useState(!hasReadIntro());
  const [showEconomyConfirm, setShowEconomyConfirm] = useState(false);
  const { gameService } = useContext(GameContext);

  if (
    hasFeatureAccess(
      gameService.getSnapshot().context.state,
      "CHAACS_TEMPLE_BETA",
    ) &&
    PORTAL_OPTIONS.find((portal) => portal.id === "chaacs-temple") == undefined
  ) {
    PORTAL_OPTIONS.push({
      id: "chaacs-temple",
      npc: "chaac",
      title: translate("portal.chaacsTemple.title"),
      description: translate("portal.chaacsTemple.description"),
      component: ChaacsTemple,
    });
  }

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
    <>
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

          <ColorPanel
            type="vibrant"
            className="flex items-center gap-2 p-2 mt-2 w-full cursor-pointer hover:brightness-110"
            onClick={() => setShowEconomyConfirm(true)}
          >
            <img
              src={SUNNYSIDE.icons.search}
              className="shrink-0"
              style={{ width: "20px", height: "20px" }}
            />
            <div className="flex-1">
              <p className="text-xs leading-tight">
                {t("portal.economyMinigames.banner")}
              </p>
              <p className="text-xs underline mt-0.5">{"View more"}</p>
            </div>
          </ColorPanel>
        </div>
      </CloseButtonPanel>

      <Modal
        show={showEconomyConfirm}
        onHide={() => setShowEconomyConfirm(false)}
      >
        <Panel>
          <div className="p-1">
            <Label type="danger" className="mb-2">
              {t("are.you.sure")}
            </Label>
            <p className="text-xs mb-3 leading-snug">
              {t("portal.economyMinigames.disclaimer")}
            </p>
            <div className="flex gap-1">
              <Button onClick={() => setShowEconomyConfirm(false)}>
                {t("cancel")}
              </Button>
              <Button
                onClick={() => {
                  setShowEconomyConfirm(false);
                  onClose();
                  navigate("/economy-hub");
                }}
              >
                {t("confirm")}
              </Button>
            </div>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
