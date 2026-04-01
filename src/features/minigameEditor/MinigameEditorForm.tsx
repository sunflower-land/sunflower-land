import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { OuterPanel, Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Tab } from "components/ui/Tab";
import { SquareIcon } from "components/ui/SquareIcon";
import { Modal } from "components/ui/Modal";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CONFIG } from "lib/config";

import type {
  EditorFormState,
  EditorTab,
  ItemForm,
  ActionForm,
} from "./lib/types";
import { BasicsTab } from "./tabs/BasicsTab";
import { ItemsTab } from "./tabs/ItemsTab";
import { ActionsTab } from "./tabs/ActionsTab";
import { useEditorApi } from "./lib/useEditorApi";

function normalizeEditorFormForDirtyCheck(state: EditorFormState) {
  return {
    slug: state.slug,
    playUrl: state.playUrl,
    descriptionTitle: state.descriptionTitle,
    descriptionSubtitle: state.descriptionSubtitle,
    descriptionWelcome: state.descriptionWelcome,
    descriptionRules: state.descriptionRules,
    items: state.items.map(
      ({ imageUploading: _u, uploadError: _e, ...item }) => item,
    ),
    actions: state.actions,
  };
}

function isEditorFormDirty(
  form: EditorFormState,
  baseline: EditorFormState,
): boolean {
  return (
    JSON.stringify(normalizeEditorFormForDirtyCheck(form)) !==
    JSON.stringify(normalizeEditorFormForDirtyCheck(baseline))
  );
}

const TABS: { id: EditorTab; icon: string; name: string }[] = [
  { id: "basics", icon: SUNNYSIDE.icons.expression_chat, name: "Basics" },
  { id: "items", icon: SUNNYSIDE.icons.basket, name: "Items" },
  { id: "actions", icon: SUNNYSIDE.icons.lightning, name: "Rules" },
];

export const MinigameEditorForm: React.FC<{
  mode: "create" | "edit";
  initial: EditorFormState;
  saving: boolean;
  error: string | null;
  onSave: (form: EditorFormState) => Promise<void>;
  onBack: () => void;
}> = ({ mode, initial, saving, error, onSave, onBack }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState<EditorFormState>(initial);
  /** Baseline for unsafe (unsaved) checks; updated after successful save. */
  const [dirtyBaseline, setDirtyBaseline] = useState<EditorFormState>(initial);
  const [activeTab, setActiveTab] = useState<EditorTab>("basics");
  const [savedFlash, setSavedFlash] = useState(false);
  const [previewUnsafeModalOpen, setPreviewUnsafeModalOpen] = useState(false);
  const formRef = useRef(form);
  const { requestItemImageUploadUrl } = useEditorApi();

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  useEffect(() => {
    setForm(initial);
    setDirtyBaseline(structuredClone(initial));
  }, [initial]);

  useEffect(() => {
    if (!savedFlash) return;
    const id = window.setTimeout(() => setSavedFlash(false), 2600);
    return () => window.clearTimeout(id);
  }, [savedFlash]);

  const handleSave = async () => {
    try {
      await onSave(form);
      setSavedFlash(true);
      setDirtyBaseline(structuredClone(form));
    } catch {
      /* error surfaced via `error` prop from parent */
    }
  };

  const goToPreview = () => {
    const slug = formRef.current.slug.trim();
    if (!slug) return;
    navigate(`/minigame/${encodeURIComponent(slug)}`);
  };

  const handlePreviewClick = () => {
    const slug = form.slug.trim();
    if (!slug) return;
    if (isEditorFormDirty(form, dirtyBaseline)) {
      setPreviewUnsafeModalOpen(true);
      return;
    }
    goToPreview();
  };

  const confirmPreviewWithUnsafeChanges = () => {
    setPreviewUnsafeModalOpen(false);
    goToPreview();
  };

  /* ── Helpers for child callbacks ─── */

  const updateForm = (next: Partial<EditorFormState>) =>
    setForm((prev) => ({ ...prev, ...next }));

  const updateItem = (index: number, next: Partial<ItemForm>) =>
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], ...next };
      return { ...prev, items };
    });

  const addItem = () =>
    setForm((prev) => {
      const nextId =
        prev.items.reduce((m, i) => Math.max(m, i.id ?? -1), -1) + 1;
      return {
        ...prev,
        items: [
          ...prev.items,
          {
            key: String(nextId),
            name: "",
            description: "",
            image: "",
            id: nextId,
            tradeable: false,
            generator: false,
            initialBalance: 0,
          },
        ],
      };
    });

  const deleteItem = (index: number) =>
    setForm((prev) => {
      const items = [...prev.items];
      if (index < 0 || index >= items.length) return prev;
      items[index] = { ...items[index], deleted: true };
      return { ...prev, items };
    });

  const uploadImage = async (index: number, file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    const meta = await new Promise<{ width: number; height: number }>(
      (resolve, reject) => {
        image.onload = () =>
          resolve({ width: image.naturalWidth, height: image.naturalHeight });
        image.onerror = () => reject(new Error("Invalid image file"));
        image.src = objectUrl;
      },
    ).finally(() => URL.revokeObjectURL(objectUrl));

    if (meta.width > 64 || meta.height > 64) {
      throw new Error("Image must be 64x64 pixels or smaller");
    }

    const current = formRef.current;
    const item = current.items[index];
    const slug = current.slug.trim();

    if (!CONFIG.API_URL) {
      throw new Error(
        "Image upload needs the live API. Use a build where the game points at the API, or deploy the minigame editor against staging/production.",
      );
    }

    if (!slug) {
      throw new Error(
        "Set your minigame slug in Basics before uploading images.",
      );
    }
    if (item.id === undefined) {
      throw new Error(
        "This item has no ID in the config. Remove it and add a new item, then upload again.",
      );
    }

    const extMatch = file.name.match(/\.([a-zA-Z0-9]+)$/);
    const presign = await requestItemImageUploadUrl({
      slug,
      itemId: item.id,
      contentType: file.type || "image/png",
      extension: extMatch?.[1],
    });
    const putUrl = presign.presignedPutUrl;
    const publicUrlOverride = presign.publicUrl;

    const response = await fetch(putUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "image/png" },
      body: file,
    });
    if (!response.ok) {
      throw new Error(`Upload failed (${response.status})`);
    }

    const publicUrl =
      (publicUrlOverride && publicUrlOverride.trim()) ||
      putUrl.split("?")[0] ||
      putUrl;
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = {
        ...items[index],
        image: publicUrl,
        imageUploading: false,
        uploadError: undefined,
      };
      return { ...prev, items };
    });
  };

  const handleUploadImage = async (index: number, file: File) => {
    updateItem(index, { imageUploading: true, uploadError: undefined });
    try {
      await uploadImage(index, file);
    } catch (err) {
      updateItem(index, {
        imageUploading: false,
        uploadError: err instanceof Error ? err.message : "Upload failed",
      });
    }
  };

  const updateAction = (index: number, next: Partial<ActionForm>) =>
    setForm((prev) => {
      const actions = [...prev.actions];
      actions[index] = { ...actions[index], ...next };
      return { ...prev, actions };
    });

  const addAction = (action: ActionForm) =>
    setForm((prev) => ({ ...prev, actions: [...prev.actions, action] }));

  const deleteAction = (index: number) =>
    setForm((prev) => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index),
    }));

  /* ── Tab content ─── */

  const renderTabContent = () => {
    switch (activeTab) {
      case "basics":
        return <BasicsTab form={form} mode={mode} onChange={updateForm} />;
      case "items":
        return (
          <ItemsTab
            form={form}
            onUpdateItem={updateItem}
            onAddItem={addItem}
            onDeleteItem={deleteItem}
            onUploadImage={handleUploadImage}
          />
        );
      case "actions":
        return (
          <ActionsTab
            form={form}
            onUpdateAction={updateAction}
            onAddAction={addAction}
            onDeleteAction={deleteAction}
          />
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with tabs */}
      <OuterPanel
        hasTabs
        className="flex-1 overflow-hidden flex flex-col relative"
      >
        {/* Tab bar */}
        <div
          className="absolute flex"
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            left: `0px`,
            right: `${PIXEL_SCALE * 1}px`,
          }}
        >
          <div className="flex overflow-x-auto scrollbar-hide mr-auto">
            {TABS.map((tab, index) => (
              <Tab
                key={tab.id}
                isFirstTab={index === 0}
                className="relative mr-1"
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                <SquareIcon icon={tab.icon} width={7} />
                <span className="text-xs sm:text-sm text-ellipsis ml-1 whitespace-nowrap">
                  {tab.name}
                </span>
              </Tab>
            ))}
          </div>
          {/* Close (exit editor) */}
          <img
            src={SUNNYSIDE.icons.close}
            alt=""
            className="flex-none cursor-pointer float-right hover:brightness-90"
            onClick={onBack}
            style={{
              width: `${PIXEL_SCALE * 11}px`,
              height: `${PIXEL_SCALE * 11}px`,
              marginTop: `${PIXEL_SCALE * 1}px`,
              marginRight: `${PIXEL_SCALE * 1}px`,
              imageRendering: "pixelated",
            }}
          />
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto scrollable p-2 pb-20">
          {renderTabContent()}
        </div>
      </OuterPanel>

      {/* Sticky footer with save + error */}
      <div className="mt-1 space-y-1">
        {savedFlash && (
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-sm bg-[#286c4e]/90 border border-[#1e4d38]">
            <img
              src={SUNNYSIDE.icons.confirm}
              alt=""
              className="w-4 h-4 flex-shrink-0"
              style={{ imageRendering: "pixelated" }}
            />
            <span className="text-xs text-white">{"Saved"}</span>
          </div>
        )}
        {error && (
          <Label type="danger" className="mb-1">
            {error}
          </Label>
        )}
        <div className="flex gap-1">
          <Button
            type="button"
            disabled={!form.slug.trim()}
            onClick={handlePreviewClick}
          >
            {"Preview"}
          </Button>
          <Button
            className="flex-1"
            disabled={saving}
            onClick={() => void handleSave()}
          >
            {saving
              ? "Saving..."
              : mode === "create"
                ? "Create Minigame"
                : "Save Changes"}
          </Button>
        </div>
      </div>

      <Modal
        show={previewUnsafeModalOpen}
        onHide={() => setPreviewUnsafeModalOpen(false)}
      >
        <Panel>
          <div className="p-2 space-y-3">
            <p className="text-xs">
              {"You have unsafe changes. Would you like to continue?"}
            </p>
            <div className="flex gap-1">
              <Button
                className="flex-1"
                onClick={() => setPreviewUnsafeModalOpen(false)}
              >
                {"Cancel"}
              </Button>
              <Button
                className="flex-1"
                onClick={confirmPreviewWithUnsafeChanges}
              >
                {"Continue"}
              </Button>
            </div>
          </div>
        </Panel>
      </Modal>
    </div>
  );
};
