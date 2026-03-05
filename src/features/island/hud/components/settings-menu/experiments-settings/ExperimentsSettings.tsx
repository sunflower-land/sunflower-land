import React, { useState } from "react";
import { Button } from "components/ui/Button";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { ContentComponentProps } from "../GameOptions";

const PORTAL_AI_FORM_URL =
  "https://docs.google.com/forms/d/19kA1K2py4gowO3xOiueMdNYjkNbr7itWpeYkPOScsDY";

export const ExperimentsSettings: React.FC<ContentComponentProps> = () => {
  const [showPortalAIOverlay, setShowPortalAIOverlay] = useState(false);

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
