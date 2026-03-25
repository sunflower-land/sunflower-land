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

const PORTAL_AI_FORM_URL =
  "https://docs.google.com/forms/d/19kA1K2py4gowO3xOiueMdNYjkNbr7itWpeYkPOScsDY";

const AI_BUILDER_FARM_IDS = [
  1, 3, 39488, 4237476849907764, 147717, 128727, 1411, 62559, 7693815612267337,
  2102169881534930,
];

const _farmId = (state: MachineState) => state.context.farmId;

export const ExperimentsSettings: React.FC<ContentComponentProps> = ({
  onClose,
}) => {
  const { gameService, setFromRoute } = useContext(GameContext);
  const farmId = useSelector(gameService, _farmId);
  const navigate = useNavigate();

  const [showPortalAIOverlay, setShowPortalAIOverlay] = useState(false);

  const hasAIBuilderAccess = AI_BUILDER_FARM_IDS.includes(farmId ?? 0);

  const handleOpenAIBuilder = () => {
    setShowPortalAIOverlay(false);
    onClose();
    setFromRoute(window.location.hash.replace("#", "") || "/");
    navigate("/ai-builder");
  };

  return (
    <>
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
