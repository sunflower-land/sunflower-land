import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Panel, InnerPanel, ButtonPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { TextInput } from "components/ui/TextInput";
import { Modal } from "components/ui/Modal";
import { SUNNYSIDE } from "assets/sunnyside";

import type { PlayerEconomyConfigRow } from "./lib/types";
import { useEditorApi } from "./lib/useEditorApi";
import { PlayerEconomyEditorSessionProvider } from "./PlayerEconomyEditorSessionContext";
import { PlayerEconomyEditorSessionView } from "./PlayerEconomyEditorSessionView";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

/* ─── List view ────────────────────────────────────────────────── */

export const PlayerEconomyEditor: React.FC = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { loadRows, submitEvent } = useEditorApi();
  const [rows, setRows] = useState<PlayerEconomyConfigRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createSlug, setCreateSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

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

  const handleCreate = async () => {
    const slug = createSlug.trim();
    if (!slug) {
      setCreateError(t("playerEconomyEditor.error.slugRequired"));
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      await submitEvent({ type: "playerEconomy.created", slug });
      navigate(`/economy-editor/edit/${slug}`);
    } catch (e) {
      setCreateError(
        e instanceof Error ? e.message : t("playerEconomyEditor.error.create"),
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-2 pb-16 space-y-2 relative h-full">
      <Panel className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <Label type="vibrant" icon={SUNNYSIDE.icons.hammer}>
            {t("playerEconomyEditor.title")}
          </Label>
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
          onClick={() => {
            setShowCreateModal(true);
            setCreateSlug("");
            setCreateError(null);
          }}
        >
          <span className="text-sm">{t("playerEconomyEditor.createNew")}</span>
        </Button>
      </div>

      <Modal
        show={showCreateModal}
        onHide={() => !creating && setShowCreateModal(false)}
      >
        <Panel>
          <div className="p-2">
            <div className="flex items-center justify-between mb-3">
              <Label type="default" icon={SUNNYSIDE.icons.plus}>
                {t("playerEconomyEditor.modal.createTitle")}
              </Label>
              <img
                src={SUNNYSIDE.icons.close}
                className="w-6 cursor-pointer"
                style={{ imageRendering: "pixelated" }}
                onClick={() => !creating && setShowCreateModal(false)}
              />
            </div>

            <p className="text-xs mb-2">
              {t("playerEconomyEditor.modal.slugHint")}
            </p>

            <TextInput
              value={createSlug}
              onValueChange={setCreateSlug}
              placeholder="e.g. my-awesome-game"
              maxLength={50}
            />

            {createError && (
              <Label type="danger" className="mt-2">
                {createError}
              </Label>
            )}

            <Button
              className="mt-3"
              disabled={creating || !createSlug.trim()}
              onClick={handleCreate}
            >
              {creating
                ? t("playerEconomyEditor.creating")
                : t("playerEconomyEditor.create")}
            </Button>
          </div>
        </Panel>
      </Modal>
    </div>
  );
};

/* ─── Create view ──────────────────────────────────────────────── */

export const PlayerEconomyEditorCreate: React.FC = () => {
  return (
    <div className="h-full overflow-hidden p-2">
      <PlayerEconomyEditorSessionProvider mode="create" slug="">
        <PlayerEconomyEditorSessionView />
      </PlayerEconomyEditorSessionProvider>
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
