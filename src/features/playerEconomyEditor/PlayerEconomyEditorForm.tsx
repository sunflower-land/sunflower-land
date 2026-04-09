import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { JsonTab } from "./tabs/JsonTab";
import { suggestNextActionId } from "./lib/actionIdHelpers";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { usePlayerEconomyEditorSession } from "./PlayerEconomyEditorSessionContext";
import { isValidPlayerEconomySlug } from "./lib/playerEconomySlug";

function normalizeEditorFormForDirtyCheck(state: EditorFormState) {
  return {
    slug: state.slug,
    playUrl: state.playUrl,
    mainCurrencyToken: state.mainCurrencyToken,
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

const TAB_DEFS: { id: EditorTab; icon: string }[] = [
  { id: "basics", icon: SUNNYSIDE.icons.expression_chat },
  { id: "items", icon: SUNNYSIDE.icons.basket },
  { id: "actions", icon: SUNNYSIDE.icons.lightning },
  { id: "json", icon: SUNNYSIDE.icons.expand },
];

export const PlayerEconomyEditorForm: React.FC = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const {
    state,
    updateForm,
    setActiveTab,
    setPreviewUnsavedOpen,
    commitSaveLocalAndQueueSync,
    requestItemImageUploadUrl,
  } = usePlayerEconomyEditorSession();

  const form = state.form;
  const baseline = state.baseline;
  const activeTab = state.activeTab;
  const savedFlash = state.savedFlash;
  const mode = state.mode;

  const [saveValidationError, setSaveValidationError] = useState<string | null>(
    null,
  );
  const formRef = useRef(form);

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  const patchEmptyActionIds = useCallback(() => {
    updateForm((prev) => {
      if (!prev.actions.some((a) => !a.id.trim())) return prev;
      const used = new Set(
        prev.actions.map((a) => a.id.trim()).filter(Boolean),
      );
      const actions = prev.actions.map((a) => {
        if (a.id.trim()) return a;
        const id = suggestNextActionId(a.actionType, used);
        used.add(id);
        return { ...a, id };
      });
      return { ...prev, actions };
    });
  }, [updateForm]);

  if (!form || !baseline) return null;

  const handleSave = () => {
    setSaveValidationError(null);
    if (!form.slug.trim()) {
      setSaveValidationError(t("playerEconomyEditor.error.slugRequired"));
      return;
    }
    if (mode === "create" && !isValidPlayerEconomySlug(form.slug)) {
      setSaveValidationError(t("playerEconomyEditor.error.slugInvalid"));
      return;
    }
    commitSaveLocalAndQueueSync(form);
  };

  const goToPreview = () => {
    const cur = formRef.current;
    if (!cur) return;
    const slug = cur.slug.trim();
    if (!slug) return;
    navigate(`/economy/${encodeURIComponent(slug)}`);
  };

  const handlePreviewClick = () => {
    const s = form.slug.trim();
    if (!s) return;
    if (isEditorFormDirty(form, baseline)) {
      setPreviewUnsavedOpen(true);
      return;
    }
    goToPreview();
  };

  const confirmPreviewWithUnsavedChanges = () => {
    setPreviewUnsavedOpen(false);
    goToPreview();
  };

  const patchForm = (next: Partial<EditorFormState>) =>
    updateForm((prev) => ({ ...prev, ...next }));

  const updateItem = (index: number, next: Partial<ItemForm>) =>
    updateForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], ...next };
      return { ...prev, items };
    });

  const addItem = () =>
    updateForm((prev) => {
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
            trophy: false,
            initialBalance: 0,
          },
        ],
      };
    });

  const deleteItem = (index: number) =>
    updateForm((prev) => {
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
    if (!current) {
      throw new Error("Editor form is not ready");
    }
    const item = current.items[index];
    const slug = current.slug.trim();

    if (!CONFIG.API_URL) {
      throw new Error(t("playerEconomyEditor.error.imageUploadNeedsApi"));
    }

    if (!slug) {
      throw new Error(t("playerEconomyEditor.error.slugBeforeImageUpload"));
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
    updateForm((prev) => {
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
    updateForm((prev) => {
      const actions = [...prev.actions];
      actions[index] = { ...actions[index], ...next };
      return { ...prev, actions };
    });

  const addAction = (action: ActionForm) =>
    updateForm((prev) => ({ ...prev, actions: [...prev.actions, action] }));

  const deleteAction = (index: number) =>
    updateForm((prev) => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index),
    }));

  const renderTabContent = () => {
    switch (activeTab) {
      case "basics":
        return <BasicsTab form={form} mode={mode} onChange={patchForm} />;
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
            patchEmptyActionIds={patchEmptyActionIds}
          />
        );
      case "json":
        return <JsonTab form={form} updateForm={updateForm} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <OuterPanel
        hasTabs
        className="flex-1 overflow-hidden flex flex-col relative"
      >
        <div
          className="absolute flex"
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            left: `0px`,
            right: `${PIXEL_SCALE * 1}px`,
          }}
        >
          <div className="flex overflow-x-auto scrollbar-hide mr-auto">
            {TAB_DEFS.map((tab, index) => (
              <Tab
                key={tab.id}
                isFirstTab={index === 0}
                className="relative mr-1"
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                <SquareIcon icon={tab.icon} width={7} />
                <span className="text-xs sm:text-sm text-ellipsis ml-1 whitespace-nowrap">
                  {t(`playerEconomyEditor.tab.${tab.id}`)}
                </span>
              </Tab>
            ))}
          </div>
          <img
            src={SUNNYSIDE.icons.close}
            alt=""
            className="flex-none cursor-pointer float-right hover:brightness-90"
            onClick={() => navigate("/economy-editor")}
            style={{
              width: `${PIXEL_SCALE * 11}px`,
              height: `${PIXEL_SCALE * 11}px`,
              marginTop: `${PIXEL_SCALE * 1}px`,
              marginRight: `${PIXEL_SCALE * 1}px`,
              imageRendering: "pixelated",
            }}
          />
        </div>

        <div className="flex-1 overflow-y-auto scrollable p-2 pb-20">
          {renderTabContent()}
        </div>
      </OuterPanel>

      <div className="mt-1 space-y-1">
        {savedFlash && (
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-sm bg-[#286c4e]/90 border border-[#1e4d38]">
            <img
              src={SUNNYSIDE.icons.confirm}
              alt=""
              className="w-4 h-4 flex-shrink-0"
              style={{ imageRendering: "pixelated" }}
            />
            <span className="text-xs text-white">
              {t("playerEconomyEditor.footer.saved")}
            </span>
          </div>
        )}
        {saveValidationError && (
          <Label type="danger" className="mb-1">
            {saveValidationError}
          </Label>
        )}
        <div className="flex gap-1">
          <Button
            type="button"
            className="flex-[1] min-w-0 shrink"
            disabled={!form.slug.trim()}
            onClick={handlePreviewClick}
          >
            {t("playerEconomyEditor.footer.preview")}
          </Button>
          <Button className="flex-[2] min-w-0" onClick={handleSave}>
            {mode === "create"
              ? t("playerEconomyEditor.footer.createEconomy")
              : t("playerEconomyEditor.footer.saveChanges")}
          </Button>
        </div>
      </div>

      <Modal
        show={state.previewUnsavedOpen}
        onHide={() => setPreviewUnsavedOpen(false)}
      >
        <Panel>
          <div className="p-2 space-y-3">
            <p className="text-xs">
              {t("playerEconomyEditor.unsavedPreview.body")}
            </p>
            <div className="flex gap-1">
              <Button
                className="flex-1"
                onClick={() => setPreviewUnsavedOpen(false)}
              >
                {t("playerEconomyEditor.unsavedPreview.cancel")}
              </Button>
              <Button
                className="flex-1"
                onClick={confirmPreviewWithUnsavedChanges}
              >
                {t("playerEconomyEditor.unsavedPreview.continue")}
              </Button>
            </div>
          </div>
        </Panel>
      </Modal>
    </div>
  );
};
