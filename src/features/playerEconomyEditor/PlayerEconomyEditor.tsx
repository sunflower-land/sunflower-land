import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Panel, InnerPanel, ButtonPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { TextInput } from "components/ui/TextInput";
import { SUNNYSIDE } from "assets/sunnyside";
import checkeredBg from "assets/land/checkered_bg.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { minigameDashboardBackdropStyle } from "features/minigame/lib/minigameBoardPixels";

import type { PlayerEconomyConfigRow } from "./lib/types";
import { useEditorApi } from "./lib/useEditorApi";
import { PlayerEconomyEditorSessionProvider } from "./PlayerEconomyEditorSessionContext";
import { PlayerEconomyEditorSessionView } from "./PlayerEconomyEditorSessionView";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  isValidPlayerEconomySlug,
  normalizePlayerEconomySlugInput,
} from "./lib/playerEconomySlug";

/* ─── List view ────────────────────────────────────────────────── */

export const PlayerEconomyEditor: React.FC = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { loadRows } = useEditorApi();
  const [rows, setRows] = useState<PlayerEconomyConfigRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await loadRows();
        if (!mounted) return;
        setRows(data);
      } catch (e) {
        if (!mounted) return;
        setError(
          e instanceof Error
            ? e.message
            : t("playerEconomyEditor.error.loadList"),
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, [loadRows]);

  return (
    <div className="p-2 pb-16 space-y-2 relative h-full">
      <Panel className="p-3">
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Label type="vibrant" icon={SUNNYSIDE.icons.hammer}>
              {t("playerEconomyEditor.title")}
            </Label>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              const base = pathname.includes("/world")
                ? "/world/marketplace"
                : "/marketplace";
              navigate(`${base}/economies`);
            }}
          >
            <span className="text-sm">
              {t("playerEconomyEditor.viewAllEconomiesMarketplace")}
            </span>
          </Button>
        </div>

        {loading && (
          <InnerPanel className="p-3 text-center">
            <p className="text-xs animate-pulse">
              {t("playerEconomyEditor.loadingMinigames")}
            </p>
          </InnerPanel>
        )}

        {error && <Label type="danger">{error}</Label>}

        {!loading && rows.length === 0 && (
          <InnerPanel className="p-4 text-center">
            <p className="text-xs opacity-60 mb-1">
              {t("playerEconomyEditor.emptyList.line1")}
            </p>
            <p className="text-[10px] opacity-40">
              {t("playerEconomyEditor.emptyList.line2")}
            </p>
          </InnerPanel>
        )}

        <div className="space-y-1 mt-2">
          {rows.map((row) => (
            <ButtonPanel
              key={row.slug}
              onClick={() => navigate(`/economy-editor/edit/${row.slug}`)}
              className="p-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold">{row.slug}</div>
                  <div className="text-[10px] opacity-60">
                    {t("playerEconomyEditor.updated")}{" "}
                    {new Date(row.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <img
                  src={SUNNYSIDE.icons.arrow_right}
                  className="w-3"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            </ButtonPanel>
          ))}
        </div>
      </Panel>

      <div className="fixed bottom-2 left-0 right-0 px-2 z-10">
        <Button
          className="w-full"
          onClick={() => navigate("/economy-editor/create")}
        >
          <span className="text-sm">{t("playerEconomyEditor.createNew")}</span>
        </Button>
      </div>
    </div>
  );
};

/* ─── Create view ──────────────────────────────────────────────── */

/**
 * Simple slug-entry landing that fires `playerEconomy.created` and then
 * navigates to the full editor at `/economy-editor/edit/:slug`. The editor
 * tabs/setup only appear once the economy exists on the server.
 */
export const PlayerEconomyEditorCreate: React.FC = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { submitEvent } = useEditorApi();

  const [slug, setSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    const normalized = normalizePlayerEconomySlugInput(slug);
    if (!normalized) {
      setError(t("playerEconomyEditor.error.slugRequired"));
      return;
    }
    if (!isValidPlayerEconomySlug(normalized)) {
      setError(t("playerEconomyEditor.error.slugInvalid"));
      return;
    }
    setCreating(true);
    setError(null);
    try {
      await submitEvent({ type: "playerEconomy.created", slug: normalized });
      navigate(`/economy-editor/edit/${normalized}`);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : t("playerEconomyEditor.error.create"),
      );
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-2">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={minigameDashboardBackdropStyle(checkeredBg)}
      />

      <img
        src={SUNNYSIDE.icons.close}
        className="absolute right-2 top-2 z-20 cursor-pointer"
        onClick={() => !creating && navigate("/economy-editor")}
        style={{
          width: `${PIXEL_SCALE * 11}px`,
          height: `${PIXEL_SCALE * 11}px`,
        }}
        alt=""
      />

      <InnerPanel className="relative z-10 w-full max-w-md p-3">
        <div className="flex items-center gap-2 mb-3">
          <Label type="vibrant" icon={SUNNYSIDE.icons.plus}>
            {t("playerEconomyEditor.modal.createTitle")}
          </Label>
        </div>

        <p className="text-xs mb-2 leading-tight text-[#3e2731]">
          {t("playerEconomyEditor.createLanding.description")}
        </p>
        <p className="text-xs mb-2 leading-tight text-[#3e2731]/80">
          {t("playerEconomyEditor.modal.slugHint")}
        </p>

        <TextInput
          value={slug}
          onValueChange={(v) => setSlug(v.toLowerCase())}
          placeholder="e.g. my-awesome-game"
          maxLength={63}
        />

        {error && (
          <Label type="danger" className="mt-2">
            {error}
          </Label>
        )}

        <div className="flex gap-2 mt-3">
          <Button
            variant="secondary"
            disabled={creating}
            onClick={() => navigate("/economy-editor")}
          >
            {t("playerEconomyEditor.createLanding.back")}
          </Button>
          <Button disabled={creating || !slug.trim()} onClick={handleCreate}>
            {creating
              ? t("playerEconomyEditor.creating")
              : t("playerEconomyEditor.create")}
          </Button>
        </div>
      </InnerPanel>
    </div>
  );
};

/* ─── Edit view ────────────────────────────────────────────────── */

export const PlayerEconomyEditorEdit: React.FC = () => {
  const { slug = "" } = useParams<{ slug: string }>();

  return (
    <div className="h-full overflow-hidden p-2">
      <PlayerEconomyEditorSessionProvider key={slug} mode="edit" slug={slug}>
        <PlayerEconomyEditorSessionView />
      </PlayerEconomyEditorSessionProvider>
    </div>
  );
};
