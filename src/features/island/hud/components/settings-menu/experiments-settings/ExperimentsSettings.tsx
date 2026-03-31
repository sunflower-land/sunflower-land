import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "@xstate/react";
import { Button } from "components/ui/Button";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { ContentComponentProps } from "../GameOptions";
import { Context as GameContext } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { hasFeatureAccess } from "lib/flags";
import { TOKEN_MINIGAME_DASHBOARD_SLUGS } from "features/minigame/lib/tokenMinigameDashboardSlugs";

const ECONOMY_MINIGAME_LABELS: Record<
  (typeof TOKEN_MINIGAME_DASHBOARD_SLUGS)[number],
  string
> = {
  "chicken-rescue-v2": "Chicken Rescue V2",
};

const PORTAL_AI_FORM_URL =
  "https://docs.google.com/forms/d/19kA1K2py4gowO3xOiueMdNYjkNbr7itWpeYkPOScsDY";

const AI_BUILDER_FARM_IDS = [
  1, 3, 39488, 4237476849907764, 147717, 128727, 1411, 62559, 7693815612267337,
  2102169881534930,
];

const _farmId = (state: MachineState) => state.context.farmId;
const _gameState = (state: MachineState) => state.context.state;

export const ExperimentsSettings: React.FC<ContentComponentProps> = ({
  onClose,
}) => {
  const { gameService, setFromRoute } = useContext(GameContext);
  const farmId = useSelector(gameService, _farmId);
  const gameState = useSelector(gameService, _gameState);
  const navigate = useNavigate();

  const [showPortalAIOverlay, setShowPortalAIOverlay] = useState(false);
  const [showEconomyMinigamesOverlay, setShowEconomyMinigamesOverlay] =
    useState(false);
  const [economyMinigameSlug, setEconomyMinigameSlug] = useState<
    (typeof TOKEN_MINIGAME_DASHBOARD_SLUGS)[number]
  >(TOKEN_MINIGAME_DASHBOARD_SLUGS[0]);

  const hasAIBuilderAccess = AI_BUILDER_FARM_IDS.includes(farmId ?? 0);
  const hasEconomyMinigamesAccess = hasFeatureAccess(
    gameState,
    "TOKEN_MINIGAMES",
  );

  const handleOpenAIBuilder = () => {
    setShowPortalAIOverlay(false);
    onClose();
    setFromRoute(window.location.hash.replace("#", "") || "/");
    navigate("/ai-builder");
  };

  const handleStartEconomyMinigame = () => {
    setShowEconomyMinigamesOverlay(false);
    onClose();
    setFromRoute(window.location.hash.replace("#", "") || "/");
    navigate(`/minigame/${economyMinigameSlug}`);
  };

  return (
    <>
      <ModalOverlay
        show={showEconomyMinigamesOverlay}
        onBackdropClick={() => setShowEconomyMinigamesOverlay(false)}
      >
        <InnerPanel className="w-full shadow">
          <div className="mb-2">
            <Label type="default">{"Economy minigames"}</Label>
          </div>

          <p className="text-sm mb-3">
            {
              "Choose a tokenized minigame and open its dashboard (beta testers only)."
            }
          </p>

          <div className="flex flex-col gap-1 mb-3">
            <Label type="default">{"Minigame"}</Label>
            <select
              className="text-sm p-1 border-2 border-gray-400 rounded bg-white"
              value={economyMinigameSlug}
              onChange={(e) =>
                setEconomyMinigameSlug(
                  e.target
                    .value as (typeof TOKEN_MINIGAME_DASHBOARD_SLUGS)[number],
                )
              }
            >
              {TOKEN_MINIGAME_DASHBOARD_SLUGS.map((slug) => (
                <option key={slug} value={slug}>
                  {ECONOMY_MINIGAME_LABELS[slug]}
                </option>
              ))}
            </select>
          </div>

          <Button className="mt-auto" onClick={handleStartEconomyMinigame}>
            {"Start"}
          </Button>
        </InnerPanel>
      </ModalOverlay>

      <ModalOverlay
        show={showPortalAIOverlay}
        onBackdropClick={() => setShowPortalAIOverlay(false)}
      >
        <InnerPanel className="w-full shadow">
          <div className="mb-2">
            <Label type="default">{"Portal AI"}</Label>
          </div>

          <p className="text-sm mb-3">
            {
              "Please fill out the Google Form to share your interest in Portal AI."
            }
          </p>

          <a
            href={PORTAL_AI_FORM_URL}
            className="underline text-xs mb-3 block break-all"
            target="_blank"
            rel="noreferrer"
          >
            {PORTAL_AI_FORM_URL}
          </a>

          <Button
            className="mt-auto"
            onClick={() => window.open(PORTAL_AI_FORM_URL, "_blank")}
          >
            {"Open Google Form"}
          </Button>

          {hasAIBuilderAccess && (
            <Button className="mt-1" onClick={handleOpenAIBuilder}>
              {"Open AI Builder"}
            </Button>
          )}
        </InnerPanel>
      </ModalOverlay>

      <div className="grid grid-cols-1 gap-1 min-h-[240px] content-start">
        {hasEconomyMinigamesAccess && (
          <Button
            className="self-start"
            onClick={() => setShowEconomyMinigamesOverlay(true)}
          >
            <span>{"Economy minigames"}</span>
          </Button>
        )}
        <Button
          className="self-start"
          onClick={() => setShowPortalAIOverlay(true)}
        >
          <span>{"Portal AI"}</span>
        </Button>
      </div>
    </>
  );
};
