import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import type {
  EditorFormState,
  EditorTab,
  HostedMinigameSiteIndexInfo,
} from "./lib/types";
import { EMPTY_FORM } from "./lib/types";
import { configToForm } from "./lib/configToForm";
import { formToConfig } from "./lib/formToConfig";
import { useEditorApi } from "./lib/useEditorApi";

/* ─── Single session state (editor only; not the game machine) ─── */

export type PlayerEconomyEditorSessionState = {
  phase: "loading" | "ready" | "failed";
  mode: "create" | "edit";
  slug: string;
  form: EditorFormState | null;
  /** Last explicitly saved snapshot (dirty detection). */
  baseline: EditorFormState | null;
  /** S3 `index.html` for hosted minigame site; from economy-editor list API. */
  hostedSiteIndex: HostedMinigameSiteIndexInfo | null;
  loadError: string | null;
  syncError: string | null;
  savedFlash: boolean;
  activeTab: EditorTab;
  previewUnsavedOpen: boolean;
};

export type PlayerEconomyEditorSessionAction =
  | {
      type: "LOAD_OK";
      form: EditorFormState;
      hostedSiteIndex: HostedMinigameSiteIndexInfo | null;
    }
  | { type: "LOAD_FAIL"; message: string }
  | {
      type: "SET_HOSTED_SITE_INDEX";
      hostedSiteIndex: HostedMinigameSiteIndexInfo | null;
    }
  | { type: "UPDATE_FORM"; update: (prev: EditorFormState) => EditorFormState }
  | { type: "SET_TAB"; tab: EditorTab }
  | { type: "COMMIT_SAVE_LOCAL"; form: EditorFormState }
  | { type: "CLEAR_SAVED_FLASH" }
  | { type: "SYNC_ERROR"; message: string }
  | { type: "CLEAR_SYNC_ERROR" }
  | { type: "SET_PREVIEW_UNSAVED"; open: boolean };

function sessionInit(
  mode: "create" | "edit",
  slug: string,
): PlayerEconomyEditorSessionState {
  if (mode === "create") {
    const f = structuredClone(EMPTY_FORM);
    return {
      phase: "ready",
      mode: "create",
      slug: "",
      form: f,
      baseline: structuredClone(f),
      hostedSiteIndex: null,
      loadError: null,
      syncError: null,
      savedFlash: false,
      activeTab: "basics",
      previewUnsavedOpen: false,
    };
  }
  return {
    phase: "loading",
    mode: "edit",
    slug,
    form: null,
    baseline: null,
    hostedSiteIndex: null,
    loadError: null,
    syncError: null,
    savedFlash: false,
    activeTab: "basics",
    previewUnsavedOpen: false,
  };
}

function sessionReducer(
  state: PlayerEconomyEditorSessionState,
  action: PlayerEconomyEditorSessionAction,
): PlayerEconomyEditorSessionState {
  switch (action.type) {
    case "LOAD_OK":
      return {
        ...state,
        phase: "ready",
        form: action.form,
        baseline: structuredClone(action.form),
        hostedSiteIndex: action.hostedSiteIndex,
        loadError: null,
      };
    case "SET_HOSTED_SITE_INDEX":
      return { ...state, hostedSiteIndex: action.hostedSiteIndex };
    case "LOAD_FAIL":
      return {
        ...state,
        phase: "failed",
        form: null,
        baseline: null,
        hostedSiteIndex: null,
        loadError: action.message,
      };
    case "UPDATE_FORM": {
      if (!state.form) return state;
      return { ...state, form: action.update(state.form) };
    }
    case "SET_TAB":
      return { ...state, activeTab: action.tab };
    case "COMMIT_SAVE_LOCAL": {
      const next = structuredClone(action.form);
      return {
        ...state,
        form: next,
        baseline: structuredClone(next),
        savedFlash: true,
      };
    }
    case "CLEAR_SAVED_FLASH":
      return { ...state, savedFlash: false };
    case "SYNC_ERROR":
      return { ...state, syncError: action.message };
    case "CLEAR_SYNC_ERROR":
      return { ...state, syncError: null };
    case "SET_PREVIEW_UNSAVED":
      return { ...state, previewUnsavedOpen: action.open };
    default:
      return state;
  }
}

export type PlayerEconomyEditorSessionContextValue = {
  state: PlayerEconomyEditorSessionState;
  dispatch: React.Dispatch<PlayerEconomyEditorSessionAction>;
  /** All form edits go through this (functional update). */
  updateForm: (update: (prev: EditorFormState) => EditorFormState) => void;
  setActiveTab: (tab: EditorTab) => void;
  setPreviewUnsavedOpen: (open: boolean) => void;
  /**
   * Commits the given form locally (baseline + flash), then POSTs to the API.
   * Local state does not wait on or merge the response; failures open the sync modal.
   */
  commitSaveLocalAndQueueSync: (form: EditorFormState) => void;
  requestItemImageUploadUrl: ReturnType<
    typeof useEditorApi
  >["requestItemImageUploadUrl"];
  prepareEconomySiteUploads: ReturnType<
    typeof useEditorApi
  >["prepareEconomySiteUploads"];
  /** Re-fetch list row metadata (e.g. S3 `index.html` last modified) without touching the form. */
  refreshHostedSiteMetadata: () => Promise<void>;
};

const PlayerEconomyEditorSessionContext =
  createContext<PlayerEconomyEditorSessionContextValue | null>(null);

type ProviderProps = {
  mode: "create" | "edit";
  slug: string;
  children?: React.ReactNode;
};

export function PlayerEconomyEditorSessionProvider({
  mode,
  slug,
  children,
}: ProviderProps) {
  const { t } = useAppTranslation();
  const {
    loadRows,
    submitEvent,
    requestItemImageUploadUrl,
    prepareEconomySiteUploads,
  } = useEditorApi();
  const [state, dispatch] = useReducer(
    sessionReducer,
    { mode, slug },
    ({ mode: m, slug: s }) => sessionInit(m, s),
  );

  const loadGenRef = useRef(0);

  useEffect(() => {
    if (mode !== "edit" || !slug.trim()) return;
    const gen = ++loadGenRef.current;
    let cancelled = false;
    void (async () => {
      try {
        const rows = await loadRows();
        if (cancelled || gen !== loadGenRef.current) return;
        const row = rows.find((r) => r.slug === slug);
        if (!row) {
          dispatch({
            type: "LOAD_FAIL",
            message: t("playerEconomyEditor.error.notFound"),
          });
          return;
        }
        dispatch({
          type: "LOAD_OK",
          form: configToForm(slug, row.config),
          hostedSiteIndex: row.hostedSiteIndex ?? null,
        });
      } catch (e) {
        if (cancelled || gen !== loadGenRef.current) return;
        dispatch({
          type: "LOAD_FAIL",
          message:
            e instanceof Error
              ? e.message
              : t("playerEconomyEditor.error.loadEdit"),
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, slug, loadRows, t]);

  useEffect(() => {
    if (!state.savedFlash) return;
    const id = window.setTimeout(
      () => dispatch({ type: "CLEAR_SAVED_FLASH" }),
      2600,
    );
    return () => window.clearTimeout(id);
  }, [state.savedFlash]);

  const updateForm = useCallback(
    (update: (prev: EditorFormState) => EditorFormState) => {
      dispatch({ type: "UPDATE_FORM", update });
    },
    [],
  );

  const setActiveTab = useCallback((tab: EditorTab) => {
    dispatch({ type: "SET_TAB", tab });
  }, []);

  const setPreviewUnsavedOpen = useCallback((open: boolean) => {
    dispatch({ type: "SET_PREVIEW_UNSAVED", open });
  }, []);

  const refreshHostedSiteMetadata = useCallback(async () => {
    if (mode !== "edit" || !slug.trim()) return;
    try {
      const rows = await loadRows();
      const row = rows.find((r) => r.slug === slug.trim());
      dispatch({
        type: "SET_HOSTED_SITE_INDEX",
        hostedSiteIndex: row?.hostedSiteIndex ?? null,
      });
    } catch {
      // ignore — editor form stays usable
    }
  }, [mode, slug, loadRows]);

  const commitSaveLocalAndQueueSync = useCallback(
    (form: EditorFormState) => {
      const snapshot = structuredClone(form);
      dispatch({ type: "COMMIT_SAVE_LOCAL", form: snapshot });

      const trimmedSlug = snapshot.slug.trim();
      const event =
        mode === "create"
          ? ({
              type: "playerEconomy.created" as const,
              slug: trimmedSlug,
              config: formToConfig(snapshot),
            } as const)
          : ({
              type: "playerEconomy.edited" as const,
              slug,
              config: formToConfig(snapshot),
            } as const);

      void submitEvent(event).catch((err) => {
        dispatch({
          type: "SYNC_ERROR",
          message:
            err instanceof Error
              ? err.message
              : t("playerEconomyEditor.error.update"),
        });
      });
    },
    [mode, slug, submitEvent, t],
  );

  const value = useMemo<PlayerEconomyEditorSessionContextValue>(
    () => ({
      state,
      dispatch,
      updateForm,
      setActiveTab,
      setPreviewUnsavedOpen,
      commitSaveLocalAndQueueSync,
      requestItemImageUploadUrl,
      prepareEconomySiteUploads,
      refreshHostedSiteMetadata,
    }),
    [
      state,
      updateForm,
      setActiveTab,
      setPreviewUnsavedOpen,
      commitSaveLocalAndQueueSync,
      requestItemImageUploadUrl,
      prepareEconomySiteUploads,
      refreshHostedSiteMetadata,
    ],
  );

  return (
    <PlayerEconomyEditorSessionContext.Provider value={value}>
      {children}
      <Modal
        show={Boolean(state.syncError)}
        onHide={() => dispatch({ type: "CLEAR_SYNC_ERROR" })}
      >
        <Panel>
          <div className="p-2 space-y-3">
            <Label type="danger" className="block">
              {t("playerEconomyEditor.syncError.title")}
            </Label>
            <p className="text-xs whitespace-pre-wrap">{state.syncError}</p>
            <p className="text-[10px] opacity-70">
              {t("playerEconomyEditor.syncError.hint")}
            </p>
            <Button className="w-full" onClick={() => window.location.reload()}>
              {t("playerEconomyEditor.syncError.refresh")}
            </Button>
          </div>
        </Panel>
      </Modal>
    </PlayerEconomyEditorSessionContext.Provider>
  );
}

export function usePlayerEconomyEditorSession(): PlayerEconomyEditorSessionContextValue {
  const ctx = useContext(PlayerEconomyEditorSessionContext);
  if (!ctx) {
    throw new Error(
      "usePlayerEconomyEditorSession must be used within PlayerEconomyEditorSessionProvider",
    );
  }
  return ctx;
}
