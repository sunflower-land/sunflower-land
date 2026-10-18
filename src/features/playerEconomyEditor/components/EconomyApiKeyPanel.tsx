import React, { useState } from "react";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { CopyField } from "components/ui/CopyField";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import Switch from "components/ui/Switch";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SectionHeader } from "./SectionHeader";
import { usePlayerEconomyEditorSession } from "../PlayerEconomyEditorSessionContext";

/** Header the minigames API reads the economy secret key from. */
export const ECONOMY_PRIVATE_KEY_HEADER = "x-economy-private-key";

/**
 * Economy secret API key: toggle requiring it on every minigames API action,
 * show a freshly created / rotated key once, and rotate it.
 */
export const EconomyApiKeyPanel: React.FC<{
  requirePrivateKey: boolean;
  onToggle: (requirePrivateKey: boolean) => void;
}> = ({ requirePrivateKey, onToggle }) => {
  const { t } = useAppTranslation();
  const {
    state: { apiKey },
    rotateApiKey,
  } = usePlayerEconomyEditorSession();

  const [showRotateConfirm, setShowRotateConfirm] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [rotateError, setRotateError] = useState<string | null>(null);

  const handleConfirmRotate = async () => {
    setRotating(true);
    setRotateError(null);
    try {
      await rotateApiKey();
      setShowRotateConfirm(false);
    } catch (e) {
      setRotateError(
        e instanceof Error
          ? e.message
          : t("playerEconomyEditor.apiKey.rotateFailed"),
      );
    } finally {
      setRotating(false);
    }
  };

  return (
    <InnerPanel className="p-3 space-y-2">
      <SectionHeader type="warning" icon={SUNNYSIDE.icons.lock}>
        {t("playerEconomyEditor.apiKey.title")}
      </SectionHeader>

      <div className="pl-1">
        <Switch
          checked={requirePrivateKey}
          onChange={() => onToggle(!requirePrivateKey)}
          label={t("playerEconomyEditor.apiKey.requireToggle")}
        />
        <p className="text-xxs text-amber-100/75 leading-snug mt-1">
          {t("playerEconomyEditor.apiKey.requireHint", {
            header: ECONOMY_PRIVATE_KEY_HEADER,
          })}
        </p>
        <p className="text-xxs text-amber-100/75 leading-snug mt-1">
          {t("playerEconomyEditor.apiKey.serverOnlyHint")}
        </p>
      </div>

      {requirePrivateKey && !apiKey.hasKey && (
        <Label type="danger">
          {t("playerEconomyEditor.apiKey.noKeyWarning")}
        </Label>
      )}

      {apiKey.revealed ? (
        <div className="space-y-1">
          <Label type="danger">{t("playerEconomyEditor.apiKey.copyNow")}</Label>
          <CopyField
            text={apiKey.revealed}
            copyFieldMessage={t("playerEconomyEditor.apiKey.copy")}
          />
        </div>
      ) : (
        <p className="text-xs leading-snug ml-1">
          {apiKey.hasKey
            ? apiKey.createdAt
              ? t("playerEconomyEditor.apiKey.hiddenSince", {
                  date: new Date(apiKey.createdAt).toLocaleString(),
                })
              : t("playerEconomyEditor.apiKey.hidden")
            : t("playerEconomyEditor.apiKey.none")}
        </p>
      )}

      <Button
        disabled={rotating}
        onClick={() => {
          setRotateError(null);
          setShowRotateConfirm(true);
        }}
      >
        {apiKey.hasKey
          ? t("playerEconomyEditor.apiKey.rotate")
          : t("playerEconomyEditor.apiKey.generate")}
      </Button>

      <ConfirmationModal
        show={showRotateConfirm}
        onHide={() => {
          if (rotating) return;
          setShowRotateConfirm(false);
        }}
        messages={[
          apiKey.hasKey
            ? t("playerEconomyEditor.apiKey.rotateConfirm")
            : t("playerEconomyEditor.apiKey.generateConfirm"),
          ...(rotateError ? [rotateError] : []),
        ]}
        onCancel={() => {
          if (rotating) return;
          setShowRotateConfirm(false);
        }}
        onConfirm={() => void handleConfirmRotate()}
        confirmButtonLabel={
          apiKey.hasKey
            ? t("playerEconomyEditor.apiKey.rotate")
            : t("playerEconomyEditor.apiKey.generate")
        }
        disabled={rotating}
      />
    </InnerPanel>
  );
};
