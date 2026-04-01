import React, { useEffect, useState } from "react";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Tab } from "components/ui/Tab";
import { SquareIcon } from "components/ui/SquareIcon";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

import type {
  EditorFormState,
  EditorTab,
  ItemForm,
  ActionForm,
} from "./lib/types";
import { BasicsTab } from "./tabs/BasicsTab";
import { ItemsTab } from "./tabs/ItemsTab";
import { ActionsTab } from "./tabs/ActionsTab";

const TABS: { id: EditorTab; icon: string; name: string }[] = [
  { id: "basics", icon: SUNNYSIDE.icons.expression_chat, name: "Basics" },
  { id: "items", icon: SUNNYSIDE.icons.basket, name: "Items" },
  { id: "actions", icon: SUNNYSIDE.icons.lightning, name: "Actions" },
];

export const MinigameEditorForm: React.FC<{
  mode: "create" | "edit";
  initial: EditorFormState;
  saving: boolean;
  error: string | null;
  onSave: (form: EditorFormState) => void;
  onBack: () => void;
}> = ({ mode, initial, saving, error, onSave, onBack }) => {
  const [form, setForm] = useState<EditorFormState>(initial);
  const [activeTab, setActiveTab] = useState<EditorTab>("basics");

  useEffect(() => {
    setForm(initial);
  }, [initial]);

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
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          key: "",
          name: "",
          description: "",
          image: "",
          tradeable: false,
          presignedPutUrl: "",
        },
      ],
    }));

  const deleteItem = (index: number) =>
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));

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

    const item = form.items[index];
    if (!item.presignedPutUrl.trim()) {
      throw new Error("Add a pre-signed S3 PUT URL first");
    }

    const response = await fetch(item.presignedPutUrl.trim(), {
      method: "PUT",
      headers: { "Content-Type": file.type || "image/png" },
      body: file,
    });
    if (!response.ok) {
      throw new Error(`Upload failed (${response.status})`);
    }

    const publicUrl =
      item.presignedPutUrl.split("?")[0] ?? item.presignedPutUrl;
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = {
        ...items[index],
        image: publicUrl,
        uploadError: undefined,
      };
      return { ...prev, items };
    });
  };

  const handleUploadImage = (index: number, file: File) => {
    void uploadImage(index, file).catch((err) => {
      updateItem(index, {
        uploadError: err instanceof Error ? err.message : "Upload failed",
      });
    });
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
          {/* Back button */}
          <img
            src={SUNNYSIDE.icons.arrow_left}
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
      <div className="mt-1">
        {error && (
          <Label type="danger" className="mb-1">
            {error}
          </Label>
        )}
        <Button disabled={saving} onClick={() => onSave(form)}>
          {saving
            ? "Saving..."
            : mode === "create"
              ? "Create Minigame"
              : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
