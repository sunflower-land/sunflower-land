import React from "react";
import { useNavigate } from "react-router";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { usePlayerEconomyEditorSession } from "./PlayerEconomyEditorSessionContext";
import { PlayerEconomyEditorForm } from "./PlayerEconomyEditorForm";

/** Loading, load failure, or main editor form (use inside PlayerEconomyEditorSessionProvider). */
export function PlayerEconomyEditorSessionView() {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { state } = usePlayerEconomyEditorSession();

  if (state.phase === "loading") {
    return (
      <div className="p-2">
        <Panel className="p-3 text-center">
          <p className="text-xs animate-pulse">
            {t("playerEconomyEditor.loadingEdit")}
          </p>
        </Panel>
      </div>
    );
  }

  if (state.phase === "failed") {
    return (
      <div className="p-2 space-y-2">
        <Panel className="p-3 space-y-2">
          {state.loadError && <Label type="danger">{state.loadError}</Label>}
          <Button onClick={() => navigate("/economy-editor")}>
            {t("playerEconomyEditor.backToList")}
          </Button>
        </Panel>
      </div>
    );
  }

  if (!state.form) return null;

  return <PlayerEconomyEditorForm />;
}
