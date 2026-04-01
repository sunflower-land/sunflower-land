import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Panel, InnerPanel, ButtonPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { TextInput } from "components/ui/TextInput";
import { Modal } from "components/ui/Modal";
import { SUNNYSIDE } from "assets/sunnyside";

import type { MinigameConfigRow, EditorFormState } from "./lib/types";
import { EMPTY_FORM } from "./lib/types";
import { useEditorApi } from "./lib/useEditorApi";
import { formToConfig } from "./lib/formToConfig";
import { configToForm } from "./lib/configToForm";
import { MinigameEditorForm } from "./MinigameEditorForm";

/* ─── List view ────────────────────────────────────────────────── */

export const MinigameEditor: React.FC = () => {
  const navigate = useNavigate();
  const { loadRows, submitEvent } = useEditorApi();
  const [rows, setRows] = useState<MinigameConfigRow[]>([]);
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
        setError(e instanceof Error ? e.message : "Failed to load");
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
      setCreateError("Slug is required");
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      await submitEvent({ type: "minigame.created", slug });
      navigate(`/minigame-editor/edit/${slug}`);
    } catch (e) {
      setCreateError(
        e instanceof Error ? e.message : "Failed to create minigame",
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
            Minigame Editor
          </Label>
        </div>

        {loading && (
          <InnerPanel className="p-3 text-center">
            <p className="text-xs animate-pulse">Loading your minigames...</p>
          </InnerPanel>
        )}

        {error && <Label type="danger">{error}</Label>}

        {!loading && rows.length === 0 && (
          <InnerPanel className="p-4 text-center">
            <p className="text-xs opacity-60 mb-1">
              You haven't created any minigames yet.
            </p>
            <p className="text-[10px] opacity-40">
              Create your first one to get started!
            </p>
          </InnerPanel>
        )}

        <div className="space-y-1 mt-2">
          {rows.map((row) => (
            <ButtonPanel
              key={row.slug}
              onClick={() => navigate(`/minigame-editor/edit/${row.slug}`)}
              className="p-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold">{row.slug}</div>
                  <div className="text-[10px] opacity-60">
                    Updated: {new Date(row.updatedAt).toLocaleDateString()}
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
          <span className="text-sm">+ Create New Minigame</span>
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
                Create Minigame
              </Label>
              <img
                src={SUNNYSIDE.icons.close}
                className="w-6 cursor-pointer"
                style={{ imageRendering: "pixelated" }}
                onClick={() => !creating && setShowCreateModal(false)}
              />
            </div>

            <p className="text-xs mb-2">
              Enter a unique slug for your minigame.
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
              {creating ? "Creating..." : "Create"}
            </Button>
          </div>
        </Panel>
      </Modal>
    </div>
  );
};

/* ─── Create view ──────────────────────────────────────────────── */

export const MinigameEditorCreate: React.FC = () => {
  const navigate = useNavigate();
  const { submitEvent } = useEditorApi();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSave = async (form: EditorFormState) => {
    setSaving(true);
    setError(null);
    try {
      const slug = form.slug.trim();
      if (!slug) throw new Error("Slug is required");
      await submitEvent({
        type: "minigame.created",
        slug,
        config: formToConfig(form),
      });
      navigate("/minigame-editor");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create minigame");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full overflow-hidden p-2">
      <MinigameEditorForm
        mode="create"
        initial={EMPTY_FORM}
        saving={saving}
        error={error}
        onSave={onSave}
        onBack={() => navigate("/minigame-editor")}
      />
    </div>
  );
};

/* ─── Edit view ────────────────────────────────────────────────── */

export const MinigameEditorEdit: React.FC = () => {
  const navigate = useNavigate();
  const { slug = "" } = useParams<{ slug: string }>();
  const { loadRows, submitEvent } = useEditorApi();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initial, setInitial] = useState<EditorFormState | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const rows = await loadRows();
        const row = rows.find((entry) => entry.slug === slug);
        if (!row) throw new Error("Minigame not found");
        if (!mounted) return;
        setInitial(configToForm(row.slug, row.config));
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Failed to load minigame");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (slug) void load();
    return () => {
      mounted = false;
    };
  }, [loadRows, slug]);

  const onSave = async (form: EditorFormState) => {
    setSaving(true);
    setError(null);
    try {
      await submitEvent({
        type: "minigame.edited",
        slug,
        config: formToConfig(form),
      });
      navigate("/minigame-editor");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update minigame");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-2">
        <Panel className="p-3 text-center">
          <p className="text-xs animate-pulse">Loading minigame...</p>
        </Panel>
      </div>
    );
  }

  if (!initial) {
    return (
      <div className="p-2 space-y-2">
        <Panel className="p-3 space-y-2">
          {error && <Label type="danger">{error}</Label>}
          <Button onClick={() => navigate("/minigame-editor")}>
            Back to List
          </Button>
        </Panel>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden p-2">
      <MinigameEditorForm
        mode="edit"
        initial={initial}
        saving={saving}
        error={error}
        onSave={onSave}
        onBack={() => navigate("/minigame-editor")}
      />
    </div>
  );
};
