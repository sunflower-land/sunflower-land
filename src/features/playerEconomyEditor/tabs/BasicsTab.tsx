import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { InnerPanel, Panel } from "components/ui/Panel";
import { TextInput } from "components/ui/TextInput";
import { Dropdown } from "components/ui/Dropdown";
import { Modal } from "components/ui/Modal";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import type { EditorFormState } from "../lib/types";
import { SectionHeader } from "../components/SectionHeader";
import { FieldRow } from "../components/FieldRow";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CONFIG } from "lib/config";
import { useAuth } from "features/auth/lib/Provider";
import { useGame } from "features/game/GameProvider";
import { portal } from "features/world/ui/community/actions/portal";
import { getCachedFont } from "lib/utils/fonts";
import {
  canonicalHostedMinigamePlayUrl,
  looksLikeMinigamesSunflowerLandUrl,
} from "../lib/hostedMinigameUrl";
import { EconomySiteFilesUpload } from "../components/EconomySiteFilesUpload";
import { usePlayerEconomyEditorSession } from "../PlayerEconomyEditorSessionContext";
import Switch from "components/ui/Switch";

const MAIN_CURRENCY_AUTO_VALUE = "__main_currency_auto__";

export const BasicsTab: React.FC<{
  form: EditorFormState;
  mode: "create" | "edit";
  onChange: (next: Partial<EditorFormState>) => void;
}> = ({ form, mode, onChange }) => {
  const { t } = useAppTranslation();
  const { state: editorSession, refreshHostedSiteMetadata } =
    usePlayerEconomyEditorSession();
  const { authState } = useAuth();
  const { gameState } = useGame();

  const sessionToken = authState.context.user.rawToken as string | undefined;
  const farmId = gameState.context.farmId;

  const [playGameLoading, setPlayGameLoading] = useState(false);
  const [playGameError, setPlayGameError] = useState<string | null>(null);
  const [showUploadRequiredModal, setShowUploadRequiredModal] = useState(false);
  const playUrlSyncRef = useRef<string>("");

  const hasUploadedCode = editorSession.hostedSiteIndex != null;

  const handleToggleEnabled = () => {
    // Block enabling when no code has been uploaded yet — show a guidance modal
    // instead. Disabling is always allowed.
    if (!form.enabled && !hasUploadedCode) {
      setShowUploadRequiredModal(true);
      return;
    }
    onChange({ enabled: !form.enabled });
  };

  const activeItemCount = useMemo(
    () => form.items.filter((i) => !i.deleted).length,
    [form.items],
  );

  const tradeableItems = useMemo(
    () =>
      form.items.filter((i) => !i.deleted && i.tradeable && i.id !== undefined),
    [form.items],
  );

  const mainCurrencyOptions = useMemo(() => {
    const keys = tradeableItems
      .map((i) => String(i.id))
      .sort((a, b) => Number(a) - Number(b));
    return [MAIN_CURRENCY_AUTO_VALUE, ...keys];
  }, [tradeableItems]);

  const labelForCurrencyOption = (value: string) => {
    if (value === MAIN_CURRENCY_AUTO_VALUE)
      return t("playerEconomyEditor.basics.mainCurrencyAuto");
    const item = tradeableItems.find((i) => String(i.id) === value);
    return item ? `${item.name} (${value})` : value;
  };

  const mainCurrencyDropdownValue =
    form.mainCurrencyToken.trim() === ""
      ? MAIN_CURRENCY_AUTO_VALUE
      : form.mainCurrencyToken.trim();

  const slugTrim = form.slug.trim();
  const hostedSiteIndexKey = useMemo(() => {
    const h = editorSession.hostedSiteIndex;
    if (!h) return "";
    return `${h.bucket}|${h.key}|${h.lastModified}`;
  }, [editorSession.hostedSiteIndex]);

  useEffect(() => {
    playUrlSyncRef.current = "";
  }, [slugTrim]);

  useEffect(() => {
    if (!slugTrim || !hostedSiteIndexKey) return;
    const syncId = `${slugTrim}|${hostedSiteIndexKey}`;
    if (playUrlSyncRef.current === syncId) return;
    const expected = canonicalHostedMinigamePlayUrl(slugTrim);
    if (form.playUrl.trim() !== expected) {
      onChange({ playUrl: expected });
    }
    playUrlSyncRef.current = syncId;
  }, [slugTrim, hostedSiteIndexKey, form.playUrl, onChange]);

  useEffect(() => {
    const p = form.playUrl.trim();
    if (!slugTrim) {
      if (p && looksLikeMinigamesSunflowerLandUrl(p)) {
        onChange({ playUrl: "" });
      }
      return;
    }
    const expected = canonicalHostedMinigamePlayUrl(slugTrim);
    if (looksLikeMinigamesSunflowerLandUrl(p) && p !== expected) {
      onChange({ playUrl: expected });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync hosted URL to slug; onChange is stable enough via parent updateForm
  }, [slugTrim, form.playUrl]);

  /** Hosted adventure URL: set canonical when slug exists and play URL is still empty. */
  useEffect(() => {
    if (!slugTrim) return;
    if (form.playUrl.trim() !== "") return;
    onChange({ playUrl: canonicalHostedMinigamePlayUrl(slugTrim) });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only fill default when slug set and playUrl empty
  }, [slugTrim]);

  const handlePlayGame = useCallback(async () => {
    setPlayGameError(null);
    if (!sessionToken) {
      setPlayGameError(t("playerEconomyEditor.basics.portalJwtNotSignedIn"));
      return;
    }
    if (farmId == null || Number.isNaN(farmId)) {
      setPlayGameError(t("playerEconomyEditor.basics.portalJwtNoFarm"));
      return;
    }
    if (!slugTrim) return;
    setPlayGameLoading(true);
    try {
      const { token } = await portal({
        portalId: slugTrim,
        token: sessionToken,
        farmId,
        skipCache: true,
      });
      const baseUrl = canonicalHostedMinigamePlayUrl(slugTrim).replace(
        /\/$/,
        "",
      );
      const params = new URLSearchParams();
      params.set("jwt", token);
      params.set("network", CONFIG.NETWORK);
      params.set("language", localStorage.getItem("language") || "en");
      params.set("font", getCachedFont());
      if (CONFIG.API_URL) {
        params.set("apiUrl", CONFIG.API_URL);
      }
      const url = `${baseUrl}/?${params.toString()}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setPlayGameError(
        e instanceof Error
          ? e.message
          : t("playerEconomyEditor.basics.portalJwtFetchFailed"),
      );
    } finally {
      setPlayGameLoading(false);
    }
  }, [farmId, sessionToken, slugTrim, t]);

  return (
    <div className="space-y-3">
      <Modal
        show={showUploadRequiredModal}
        onHide={() => setShowUploadRequiredModal(false)}
      >
        <Panel>
          <div className="p-1">
            <Label type="danger" className="mb-2">
              {t("playerEconomyEditor.basics.uploadRequiredTitle")}
            </Label>
            <p className="text-sm mb-3 leading-tight">
              {t("playerEconomyEditor.basics.uploadRequiredMessage")}
            </p>
            <Button onClick={() => setShowUploadRequiredModal(false)}>
              {t("close")}
            </Button>
          </div>
        </Panel>
      </Modal>

      {/* Game Identity */}
      <InnerPanel className="p-3 space-y-2">
        <SectionHeader type="info" icon={SUNNYSIDE.icons.player}>
          {t("playerEconomyEditor.basics.gameIdentity")}
        </SectionHeader>
        <FieldRow label={t("playerEconomyEditor.basics.slugLabel")}>
          <TextInput
            value={form.slug}
            onValueChange={(slug) =>
              onChange({
                slug: mode === "create" ? slug.toLowerCase() : slug,
              })
            }
            maxLength={63}
            placeholder={t("playerEconomyEditor.basics.slugPlaceholder")}
            className={mode === "edit" ? "pointer-events-none opacity-70" : ""}
          />
        </FieldRow>
        <div className="pl-1">
          <Switch
            checked={form.enabled}
            onChange={handleToggleEnabled}
            label={t("playerEconomyEditor.basics.isEnabled")}
          />
          <p className="text-xxs text-amber-100/75 leading-snug mt-1">
            {t("playerEconomyEditor.basics.isEnabledHint")}
          </p>
        </div>
        {activeItemCount > 0 ? (
          <FieldRow label={t("playerEconomyEditor.basics.mainCurrencyLabel")}>
            {tradeableItems.length === 0 ? (
              <p className="text-xs opacity-70">
                {t("playerEconomyEditor.basics.mainCurrencyNoTradeable")}
              </p>
            ) : (
              <Dropdown
                options={mainCurrencyOptions}
                value={mainCurrencyDropdownValue}
                onChange={(v) =>
                  onChange({
                    mainCurrencyToken: v === MAIN_CURRENCY_AUTO_VALUE ? "" : v,
                  })
                }
                placeholder={t("playerEconomyEditor.basics.mainCurrencyAuto")}
                getOptionLabel={labelForCurrencyOption}
              />
            )}
          </FieldRow>
        ) : null}
        <div className="space-y-2 w-full">
          <p className="text-xs text-amber-100/75 leading-snug ml-1">
            {t("playerEconomyEditor.basics.customMinigamesDeployHint")}
          </p>
          <EconomySiteFilesUpload
            slug={form.slug}
            mode={mode}
            hostedSiteIndex={editorSession.hostedSiteIndex}
            onAfterIndexUpload={() => void refreshHostedSiteMetadata()}
            onPlayGame={() => void handlePlayGame()}
            playGameLoading={playGameLoading}
            playGameError={playGameError}
          />
        </div>
      </InnerPanel>

      {/* Descriptions */}
      <InnerPanel className="p-3 space-y-2">
        <SectionHeader type="info" icon={SUNNYSIDE.icons.expression_chat}>
          {t("playerEconomyEditor.basics.descriptions")}
        </SectionHeader>
        <FieldRow label="Title">
          <TextInput
            value={form.descriptionTitle}
            onValueChange={(v) => onChange({ descriptionTitle: v })}
            placeholder="My Awesome Game"
          />
        </FieldRow>
        <FieldRow label="Subtitle">
          <TextInput
            value={form.descriptionSubtitle}
            onValueChange={(v) => onChange({ descriptionSubtitle: v })}
            placeholder="A short tagline"
          />
        </FieldRow>
        <FieldRow label="Welcome Message">
          <TextInput
            value={form.descriptionWelcome}
            onValueChange={(v) => onChange({ descriptionWelcome: v })}
            placeholder="Welcome to the adventure..."
          />
        </FieldRow>
        <FieldRow label="Rules">
          <TextInput
            value={form.descriptionRules}
            onValueChange={(v) => onChange({ descriptionRules: v })}
            placeholder="Click to collect, earn points..."
          />
        </FieldRow>
      </InnerPanel>
    </div>
  );
};
